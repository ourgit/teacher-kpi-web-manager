<template>
    <div class="page-container layout-padding">
  <div class="mindmap-wrapper">
    <div class="mindmap-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" @click="addRootNode">
          <el-icon><Plus /></el-icon>
          添加主节点
        </el-button>
        <el-button @click="centerView">
          <el-icon><Position /></el-icon>
          居中
        </el-button>
        <el-button @click="zoom = 1">
          <el-icon><Refresh /></el-icon>
          重置缩放
        </el-button>
      </div>
      <div class="toolbar-right">
        <span>缩放: {{ Math.round(zoom * 100) }}%</span>
        <el-button-group>
          <el-button @click="zoomOut">
            <el-icon><ZoomOut /></el-icon>
          </el-button>
          <el-button @click="zoomIn">
            <el-icon><ZoomIn /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 主容器 -->
    <div 
      class="mindmap-container" 
      ref="containerRef"
      @mousedown="startDrag"
      @mousemove="doDrag"
      @mouseup="stopDrag"
      @wheel="handleWheel"
    >
      <div 
        class="mindmap-content" 
        :style="{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: 'center'
        }"
      >
        <!-- 中心节点 -->
        <div 
          v-if="rootNode" 
          class="node root-node"
          :class="{ selected: selectedNodeId === rootNode.id }"
          :style="getNodeStyle(rootNode)"
          @click.stop="selectNode(rootNode)"
          @dblclick.stop="editNode(rootNode)"
        >
          <div class="node-content">
            <input
              v-if="rootNode.isEditing"
              v-model="rootNode.text"
              @blur="saveEdit(rootNode)"
              @keyup.enter="saveEdit(rootNode)"
              @keyup.esc="cancelEdit(rootNode)"
              class="node-edit"
              @click.stop
              ref="editInputRef"
            />
            <template v-else>
              <div class="node-text">{{ rootNode.text }}</div>
              <div class="node-actions">
                <el-button 
                  type="text" 
                  size="small"
                  @click.stop="addChild(rootNode)"
                  title="添加子节点"
                >
                  <el-icon><Plus /></el-icon>
                </el-button>
              </div>
            </template>
          </div>
          
          <!-- 子节点容器 -->
          <div v-if="rootNode.children && rootNode.children.length" class="children-container">
            <div 
              v-for="(child, index) in rootNode.children" 
              :key="child.id"
              class="child-wrapper"
              :style="{ 
                '--total': rootNode.children.length, 
                '--index': index 
              }"
            >
              <!-- 连接线 -->
              <svg class="connector" width="100" height="50">
                <path 
                  d="M0,0 Q50,0 100,50" 
                  fill="none" 
                  stroke="#ccc" 
                  stroke-width="2"
                />
              </svg>
              
              <!-- 子节点 -->
              <branch-node
                :node="child"
                :depth="1"
                :parent="rootNode"
                @select="selectNode"
                @edit="editNode"
                @add-child="addChild"
                @delete="deleteNode"
              />
            </div>
          </div>
        </div>

        <!-- 无数据时的提示 -->
        <div v-else class="empty-state" @click="addRootNode">
          <el-empty description="点击添加中心节点" />
        </div>
      </div>
    </div>

    <!-- 属性面板 -->
    <div v-if="selectedNode" class="property-panel">
      <div class="panel-header">
        <h3>节点属性</h3>
        <el-button 
          type="text" 
          @click="closePanel"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <div class="panel-content">
        <el-form label-width="80px" size="small">
          <el-form-item label="文本">
            <el-input 
              v-model="selectedNode.text" 
              @change="updateNode(selectedNode)"
            />
          </el-form-item>
          
          <el-form-item label="颜色">
            <el-color-picker
              v-model="selectedNode.color"
              @change="updateNode(selectedNode)"
            />
          </el-form-item>
          
          <el-form-item label="背景色">
            <el-color-picker
              v-model="selectedNode.bgColor"
              @change="updateNode(selectedNode)"
            />
          </el-form-item>
          
          <el-form-item label="图标">
            <el-select 
              v-model="selectedNode.icon" 
              placeholder="选择图标"
              @change="updateNode(selectedNode)"
            >
              <el-option 
                v-for="icon in iconOptions" 
                :key="icon.value"
                :value="icon.value"
                :label="icon.label"
              >
                <el-icon><component :is="icon.value" /></el-icon>
                <span style="margin-left: 8px">{{ icon.label }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="字体大小">
            <el-slider
              v-model="selectedNode.fontSize"
              :min="12"
              :max="24"
              @change="updateNode(selectedNode)"
            />
          </el-form-item>
        </el-form>
        
        <el-button 
          type="danger" 
          @click="deleteSelectedNode"
          style="width: 100%; margin-top: 20px;"
        >
          <el-icon><Delete /></el-icon>
          删除节点
        </el-button>
      </div>
    </div>
  </div>  
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick,computed,inject } from 'vue'
import { 
  Plus, 
  Position, 
  Refresh, 
  ZoomIn, 
  ZoomOut, 
  Close, 
  Delete,
} from '@element-plus/icons-vue'

// 节点组件
const BranchNode = {
  name: 'BranchNode',
  props: ['node', 'depth', 'parent'],
  emits: ['select', 'edit', 'add-child', 'delete'],
  template: `
    <div 
      class="node branch-node" 
      :class="{ 
        selected: selectedNodeId === node.id,
        'has-children': node.children && node.children.length
      }"
      :style="getNodeStyle(node)"
      @click.stop="handleClick"
      @dblclick.stop="handleDblClick"
    >
      <div class="node-content">
        <input
          v-if="node.isEditing"
          v-model="node.text"
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          class="node-edit"
          @click.stop
          ref="editInputRef"
        />
        <template v-else>
          <el-icon v-if="node.icon" class="node-icon">
            <component :is="node.icon" />
          </el-icon>
          <div class="node-text">{{ node.text }}</div>
          <div class="node-actions">
            <el-button 
              type="text" 
              size="small"
              @click.stop="addChild"
              title="添加子节点"
            >
              <el-icon><Plus /></el-icon>
            </el-button>
            <el-button 
              type="text" 
              size="small"
              @click.stop="editNode"
              title="编辑"
            >
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button 
              type="text" 
              size="small"
              @click.stop="deleteNode"
              class="delete-btn"
              title="删除"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </template>
      </div>
      
      <!-- 子节点 -->
      <div v-if="node.children && node.children.length" class="children-container">
        <div 
          v-for="(child, index) in node.children" 
          :key="child.id"
          class="child-wrapper"
          :style="{ 
            '--total': node.children.length, 
            '--index': index 
          }"
        >
          <!-- 连接线 -->
          <svg class="connector" width="100" height="50">
            <path 
              d="M0,0 Q50,0 100,50" 
              fill="none" 
              stroke="#ccc" 
              stroke-width="2"
            />
          </svg>
          
          <branch-node
            :node="child"
            :depth="depth + 1"
            :parent="node"
            @select="$emit('select', $event)"
            @edit="$emit('edit', $event)"
            @add-child="$emit('add-child', $event)"
            @delete="$emit('delete', $event)"
          />
        </div>
      </div>
    </div>
  `,
  setup(props, { emit }) {
    const selectedNodeId = inject('selectedNodeId')
    const editInputRef = ref(null)
    
    const getNodeStyle = (node) => {
      return {
        '--color': node.color || getDefaultColor(props.depth),
        '--bg-color': node.bgColor || getDefaultBgColor(props.depth),
        '--font-size': `${node.fontSize || 14}px`
      }
    }
    
    const getDefaultColor = (depth) => {
      const colors = ['#1677ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96']
      return colors[depth % colors.length]
    }
    
    const getDefaultBgColor = (depth) => {
      const bgColors = ['#e6f7ff', '#f6ffed', '#fff7e6', '#f9f0ff', '#fff0f6']
      return bgColors[depth % bgColors.length]
    }
    
    const handleClick = () => {
      emit('select', props.node)
    }
    
    const handleDblClick = () => {
      emit('edit', props.node)
    }
    
    const addChild = () => {
      emit('add-child', props.node)
    }
    
    const editNode = () => {
      emit('edit', props.node)
    }
    
    const deleteNode = () => {
      emit('delete', { node: props.node, parent: props.parent })
    }
    
    const saveEdit = () => {
      props.node.isEditing = false
    }
    
    const cancelEdit = () => {
      props.node.isEditing = false
    }
    
    return {
      selectedNodeId,
      editInputRef,
      getNodeStyle,
      handleClick,
      handleDblClick,
      addChild,
      editNode,
      deleteNode,
      saveEdit,
      cancelEdit
    }
  }
}

// 主组件
const containerRef = ref()
const editInputRef = ref()
const selectedNodeId = ref(null)
const zoom = ref(1)
const position = reactive({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = reactive({ x: 0, y: 0 })

// 图标选项
const iconOptions = [
  { value: 'Star', label: '星星' },
  { value: 'Circle', label: '圆形' },
  { value: 'Check', label: '对勾' },
  { value: 'Warning', label: '警告' },
  { value: 'QuestionFilled', label: '问号' }
]

// 初始数据
const rootNode = ref({
  id: 1,
  text: '中心主题',
  color: '#1677ff',
  bgColor: '#e6f7ff',
  icon: 'Star',
  fontSize: 20,
  children: [
    {
      id: 2,
      text: '分支主题1',
      color: '#52c41a',
      bgColor: '#f6ffed',
      icon: 'Check',
      fontSize: 16,
      children: [
        { id: 3, text: '子主题1-1', color: '#fa8c16', bgColor: '#fff7e6', fontSize: 14 },
        { id: 4, text: '子主题1-2', color: '#fa8c16', bgColor: '#fff7e6', fontSize: 14 }
      ]
    },
    {
      id: 5,
      text: '分支主题2',
      color: '#722ed1',
      bgColor: '#f9f0ff',
      icon: 'QuestionFilled',
      fontSize: 16,
      children: [
        { id: 6, text: '子主题2-1', color: '#eb2f96', bgColor: '#fff0f6', fontSize: 14 },
        { id: 7, text: '子主题2-2', color: '#eb2f96', bgColor: '#fff0f6', fontSize: 14 }
      ]
    }
  ]
})

// 计算属性
const selectedNode = computed(() => {
  if (!selectedNodeId.value) return null
  return findNodeById(rootNode.value, selectedNodeId.value)
})

// 方法
const getNodeStyle = (node) => ({
  '--color': node.color,
  '--bg-color': node.bgColor,
  '--font-size': `${node.fontSize}px`
})

const findNodeById = (node, id) => {
  if (node.id === id) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, id)
      if (found) return found
    }
  }
  return null
}

const selectNode = (node) => {
  selectedNodeId.value = node.id
}

const addRootNode = () => {
  if (!rootNode.value) {
    rootNode.value = {
      id: Date.now(),
      text: '中心主题',
      color: '#1677ff',
      bgColor: '#e6f7ff',
      icon: 'Star',
      fontSize: 20,
      children: []
    }
  }
}

const addChild = (parentNode) => {
  if (!parentNode.children) {
    parentNode.children = []
  }
  
  const newId = Date.now()
  const depth = getNodeDepth(parentNode)
  const colors = ['#52c41a', '#fa8c16', '#722ed1', '#eb2f96']
  const bgColors = ['#f6ffed', '#fff7e6', '#f9f0ff', '#fff0f6']
  
  const childNode = {
    id: newId,
    text: '新主题',
    color: colors[depth % colors.length],
    bgColor: bgColors[depth % bgColors.length],
    fontSize: Math.max(20 - depth * 2, 12)
  }
  
  parentNode.children.push(childNode)
  selectNode(childNode)
}

const getNodeDepth = (node, depth = 0) => {
  if (node.id === rootNode.value?.id) return depth
  // 简化实现
  return depth
}

const editNode = (node) => {
  node.isEditing = true
  nextTick(() => {
    const input = editInputRef.value
    if (input) {
      input.focus()
      input.select()
    }
  })
}

const saveEdit = (node) => {
  node.isEditing = false
  node.text = node.text.trim() || '未命名'
}

const cancelEdit = (node) => {
  node.isEditing = false
}

const deleteSelectedNode = () => {
  if (selectedNode.value && selectedNode.value !== rootNode.value) {
    deleteNode(selectedNode.value, rootNode.value)
  }
}

const deleteNode = (node, parent) => {
  if (!parent) return
  
  if (Array.isArray(parent)) {
    const index = parent.findIndex(n => n.id === node.id)
    if (index > -1) parent.splice(index, 1)
  } else if (parent.children) {
    const index = parent.children.findIndex(n => n.id === node.id)
    if (index > -1) parent.children.splice(index, 1)
  }
  
  selectedNodeId.value = null
}

const updateNode = (node) => {
  // 节点已通过双向绑定更新
  console.log('节点已更新:', node)
}

const centerView = () => {
  if (containerRef.value) {
    const containerRect = containerRef.value.getBoundingClientRect()
    position.x = (containerRect.width - 400) / 2
    position.y = (containerRect.height - 300) / 2
  }
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.1, 3)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.1, 0.5)
}

const startDrag = (event) => {
  if (event.target === containerRef.value) {
    isDragging.value = true
    dragStart.x = event.clientX - position.x
    dragStart.y = event.clientY - position.y
  }
}

const doDrag = (event) => {
  if (isDragging.value) {
    position.x = event.clientX - dragStart.x
    position.y = event.clientY - dragStart.y
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const handleWheel = (event) => {
  if (event.ctrlKey) {
    event.preventDefault()
    if (event.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }
}

const closePanel = () => {
  selectedNodeId.value = null
}

onMounted(() => {
  centerView()
})
</script>

<style scoped>
.mindmap-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.mindmap-toolbar {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-right {
  font-size: 14px;
  color: #666;
}

.mindmap-container {
  width: 100%;
  height: 100%;
  cursor: grab;
  overflow: hidden;
  position: relative;
}

.mindmap-container:active {
  cursor: grabbing;
}

.mindmap-content {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
  transform-origin: center;
  min-width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px;
}

.empty-state {
  text-align: center;
  padding: 100px;
  cursor: pointer;
  color: #999;
}

.empty-state:hover {
  color: #1677ff;
}

/* 节点样式 */
.node {
  position: relative;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.node:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.node.selected {
  border-color: var(--color, #1677ff);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1);
  z-index: 10;
}

.root-node {
  background: linear-gradient(135deg, var(--bg-color, #e6f7ff), #ffffff);
  border: 2px solid var(--color, #1677ff);
  color: var(--color, #1677ff);
  font-size: var(--font-size, 20px);
  font-weight: bold;
  padding: 12px 24px;
  min-width: 150px;
}

.branch-node {
  background: linear-gradient(135deg, var(--bg-color, #ffffff), #fafafa);
  border: 1px solid var(--color, #52c41a);
  color: var(--color, #52c41a);
  font-size: var(--font-size, 16px);
  margin: 10px;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.node-text {
  font-weight: 500;
  user-select: none;
  white-space: nowrap;
}

.node-icon {
  font-size: 16px;
}

.node-actions {
  opacity: 0;
  display: flex;
  gap: 4px;
  margin-left: 8px;
  transition: opacity 0.3s ease;
}

.node:hover .node-actions {
  opacity: 1;
}

.node-edit {
  border: 2px solid #1677ff;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: inherit;
  color: inherit;
  background: white;
  outline: none;
  min-width: 100px;
  font-family: inherit;
}

.delete-btn {
  color: #f56c6c;
}

.delete-btn:hover {
  background: #fef0f0;
}

/* 子节点容器 */
.children-container {
  display: flex;
  margin-top: 20px;
  position: relative;
  padding-top: 20px;
}

.children-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: 20px;
  background: linear-gradient(to bottom, var(--color, #ccc), transparent);
  transform: translateX(-50%);
}

.child-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 连接线 */
.connector {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.connector path {
  stroke: var(--color, #ccc);
  stroke-dasharray: 5, 5;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to {
    stroke-dashoffset: 10;
  }
}

/* 属性面板 */
.property-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #f5f7fa;
}

.panel-header h3 {
  margin: 0;
  color: #303133;
}

.panel-content {
  padding: 16px;
}

/* 响应式 */
@media (max-width: 768px) {
  .mindmap-toolbar {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
  
  .property-panel {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 8px 8px 0 0;
  }
}
</style>