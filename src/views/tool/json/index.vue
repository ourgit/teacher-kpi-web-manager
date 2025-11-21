<template>
  <div class="page-container layout-padding">
    <el-row :gutter="20">
      <!-- 左侧元素列表 -->
      <el-col :span="8">
        <el-card shadow="hover" class="layout-padding-auto">
          <template #header>
            <div class="card-header">
              <span>元素</span>
            </div>
          </template>
          <div class="element-tip">
            拖拽左侧的表单元素到右侧区域,即可生成相应的HTML代码,表单代码,轻松搞定!
          </div>
          <div class="element-list">
            <div
              v-for="element in elementList"
              :key="element.type"
              class="element-item"
              draggable="true"
              @dragstart="handleDragStart($event, element)"
            >
              <div class="element-label">{{ element.label }}:</div>
              <div class="element-preview" v-html="getElementPreview(element)"></div>
            </div>
          </div>
          <div class="element-actions">
            <el-button type="success" @click="handleSubmit">提交</el-button>
            <el-button @click="handleClear">清空</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧拖拽区域 -->
      <el-col :span="16">
        <el-card shadow="hover" class="layout-padding-auto">
          <template #header>
            <div class="card-header">
              <span>拖拽左侧表单元素到此区域</span>
              <el-select v-model="columnCount" size="small" style="width: 150px">
                <el-option label="显示1列" :value="1" />
                <el-option label="显示2列" :value="2" />
                <el-option label="显示3列" :value="3" />
              </el-select>
            </div>
          </template>
          <div
            class="drop-area"
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
          >
            <div v-if="droppedElements.length === 0" class="empty-tip">
              请拖拽左侧元素到此处
            </div>
            <div
              v-for="(element, index) in droppedElements"
              :key="index"
              class="dropped-element"
              :style="{ width: `${100 / columnCount}%` }"
            >
              <div class="element-label">{{ element.label }}:</div>
              <div class="element-preview" v-html="getElementPreview(element)"></div>
              <div class="element-actions">
                <a href="javascript:void(0)" @click="handleEdit(index)">编辑HTML</a>
                <span> | </span>
                <a href="javascript:void(0)" @click="handleRemove(index)">移除</a>
              </div>
            </div>
          </div>
          <div class="code-actions">
            <el-button type="warning" @click="handleCopyCode">复制代码</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- JSON列表 -->
    <el-card shadow="hover" class="layout-padding-auto" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>JSON列表</span>
        </div>
      </template>
      <el-table :data="jsonList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="jsonParam" label="JSON参数" show-overflow-tooltip>
          <template #default="{ row }">
            <pre>{{ formatJsonParam(row.jsonParam) }}</pre>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleLoadJson(row)">加载</el-button>
            <el-button size="small" text type="danger" @click="handleDeleteJson(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑HTML对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑HTML" width="800px">
      <el-input
        v-model="editingHtml"
        type="textarea"
        :rows="15"
        placeholder="请输入HTML代码"
      />
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateHtml">更新HTML</el-button>
      </template>
    </el-dialog>

    <!-- 添加JSON对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加JSON" width="600px" @opened="handleDialogOpened">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="描述">
          <el-input v-model="addForm.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="JSON参数">
          <el-input
            v-model="addForm.jsonText"
            type="textarea"
            :rows="10"
            placeholder="请输入JSON字符串"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddJson">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, resolveComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addJson, getJsonList, deleteJson } from '@/api/tool/index'

interface ElementItem {
  type: string
  label: string
  component: any
  props: any
  html?: string
}

const columnCount = ref(1)
const loading = ref(false)
const jsonList = ref<any[]>([])
const droppedElements = ref<ElementItem[]>([])
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const editingIndex = ref(-1)
const editingHtml = ref('')
const addForm = reactive({
  description: '',
  jsonText: ''
})

// 渲染元素组件
const renderElement = (element: ElementItem) => {
  const component = element.component
  const props = element.props
  
  if (component === 'span') {
    return h('span', props.innerHTML || '这里是纯文字信息')
  }
  
  if (component === 'el-radio-group') {
    return h(resolveComponent('el-radio-group') as any, props, {
      default: () => [
        h(resolveComponent('el-radio') as any, { label: 'option1' }, '选项1'),
        h(resolveComponent('el-radio') as any, { label: 'option2' }, '选项2')
      ]
    })
  }
  
  if (component === 'el-checkbox-group') {
    return h(resolveComponent('el-checkbox-group') as any, props, {
      default: () => [
        h(resolveComponent('el-checkbox') as any, { label: 'option1' }, '选项1'),
        h(resolveComponent('el-checkbox') as any, { label: 'option2' }, '选项2'),
        h(resolveComponent('el-checkbox') as any, { label: 'option3' }, '选项3')
      ]
    })
  }
  
  if (component === 'el-select') {
    return h(resolveComponent('el-select') as any, props, {
      default: () => [
        h(resolveComponent('el-option') as any, { label: '选项1', value: 'option1' }),
        h(resolveComponent('el-option') as any, { label: '选项2', value: 'option2' })
      ]
    })
  }
  
  return h(resolveComponent(component) as any, props)
}

// 元素列表
const elementList = ref<ElementItem[]>([
  {
    type: 'text',
    label: '文本框',
    component: 'el-input',
    props: { placeholder: '请输入文本', modelValue: '' }
  },
  {
    type: 'textarea',
    label: '多行文本框',
    component: 'el-input',
    props: { type: 'textarea', placeholder: '请输入文本', modelValue: '' }
  },
  {
    type: 'password',
    label: '密码框',
    component: 'el-input',
    props: { type: 'password', placeholder: '请输入密码', modelValue: '', showPassword: false }
  },
  {
    type: 'select',
    label: '下拉框',
    component: 'el-select',
    props: { placeholder: '请选择', modelValue: '' }
  },
  {
    type: 'text-display',
    label: '纯文本',
    component: 'span',
    props: { innerHTML: '这里是纯文字信息' }
  },
  {
    type: 'radio',
    label: '单选框',
    component: 'el-radio-group',
    props: { modelValue: 'option1' }
  },
  {
    type: 'checkbox',
    label: '复选框',
    component: 'el-checkbox-group',
    props: { modelValue: [] }
  },
  {
    type: 'switch',
    label: '切换按钮',
    component: 'el-switch',
    props: { modelValue: true }
  },
  {
    type: 'date',
    label: '日期选择',
    component: 'el-date-picker',
    props: { type: 'date', placeholder: '选择日期', modelValue: '' }
  }
])

// 获取元素预览HTML
const getElementPreview = (element: ElementItem): string => {
  // 如果元素有自定义HTML，优先使用
  if (element.html) {
    return element.html
  }
  
  // 否则使用默认预览
  if (element.type === 'text-display') {
    return element.props.innerHTML || '这里是纯文字信息'
  }
  if (element.type === 'text') {
    return `<input type="text" class="el-input__inner" placeholder="${element.props.placeholder || ''}" readonly>`
  }
  if (element.type === 'textarea') {
    return `<textarea class="el-textarea__inner" placeholder="${element.props.placeholder || ''}" readonly></textarea>`
  }
  if (element.type === 'password') {
    return `<input type="password" class="el-input__inner" placeholder="${element.props.placeholder || ''}" readonly>`
  }
  if (element.type === 'select') {
    return `<select class="el-select__inner" readonly><option>选项1</option><option>选项2</option></select>`
  }
  if (element.type === 'radio') {
    return `<div><label><input type="radio" name="radio" checked> 选项1</label> <label><input type="radio" name="radio"> 选项2</label></div>`
  }
  if (element.type === 'checkbox') {
    return `<div><label><input type="checkbox"> 选项1</label> <label><input type="checkbox"> 选项2</label> <label><input type="checkbox"> 选项3</label></div>`
  }
  if (element.type === 'switch') {
    return `<span class="el-switch is-checked"><span class="el-switch__core"></span></span>`
  }
  if (element.type === 'date') {
    return `<input type="text" class="el-input__inner" placeholder="${element.props.placeholder || ''}" value="2018-04-20" readonly>`
  }
  return ''
}

// 拖拽开始
const handleDragStart = (event: DragEvent, element: ElementItem) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify(element))
  }
}

// 拖拽放置
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const data = event.dataTransfer?.getData('application/json')
  if (data) {
    const element = JSON.parse(data)
    const newElement = {
      ...element,
      id: Date.now() + Math.random()
    }
    droppedElements.value.push(newElement)
    generateJson()
  }
}

// 编辑HTML
const handleEdit = (index: number) => {
  editingIndex.value = index
  const element = droppedElements.value[index]
  editingHtml.value = element.html || generateElementHtml(element)
  editDialogVisible.value = true
}

// 更新HTML
const handleUpdateHtml = () => {
  if (editingIndex.value >= 0) {
    droppedElements.value[editingIndex.value].html = editingHtml.value
    // 强制更新视图
    droppedElements.value = [...droppedElements.value]
    generateJson()
  }
  editDialogVisible.value = false
}

// 移除元素
const handleRemove = (index: number) => {
  droppedElements.value.splice(index, 1)
  generateJson()
}

// 生成元素HTML
const generateElementHtml = (element: ElementItem): string => {
  const label = element.label
  const type = element.type
  
  if (type === 'checkbox') {
    return `<label class="col-sm-3 control-label">${label}: </label>
<div class="col-sm-9">
<label class="check-box">
<input type="checkbox" value="option1" id="inlineCheckbox1">选项1
</label>
<label class="check-box">
<input type="checkbox" value="option2" id="inlineCheckbox2">选项2
</label>
<label class="check-box">
<input type="checkbox" value="option3" id="inlineCheckbox3">选项3
</label>
</div>`
  }
  
  if (type === 'radio') {
    return `<label class="col-sm-3 control-label">${label}: </label>
<div class="col-sm-9">
<label class="check-box">
<input type="radio" name="radio${Date.now()}" value="option1" id="inlineRadio1" checked>选项1
</label>
<label class="check-box">
<input type="radio" name="radio${Date.now()}" value="option2" id="inlineRadio2">选项2
</label>
</div>`
  }
  
  if (type === 'select') {
    return `<label class="col-sm-3 control-label">${label}: </label>
<div class="col-sm-9">
<select class="form-control">
<option value="option1">选项1</option>
<option value="option2">选项2</option>
</select>
</div>`
  }
  
  return `<label class="col-sm-3 control-label">${label}: </label>
<div class="col-sm-9">
<input type="text" class="form-control" placeholder="请输入${label}">
</div>`
}

// 生成JSON
const generateJson = () => {
  // 根据拖拽的元素生成JSON格式
  const hasSelect = droppedElements.value.some(el => el.type === 'select' || el.type === 'checkbox' || el.type === 'radio')
  
  if (hasSelect) {
    // 选择类型 - 查找复选框、单选框或下拉框元素
    const selectElement = droppedElements.value.find(el => el.type === 'checkbox' || el.type === 'radio' || el.type === 'select')
    
    if (selectElement) {
      // 从HTML中解析选项，或使用默认选项
      let options: Array<{ name: string; score: number }> = []
      if (selectElement.html) {
        // 尝试从HTML中解析选项
        const parser = new DOMParser()
        const doc = parser.parseFromString(selectElement.html, 'text/html')
        
        // 解析复选框和单选框
        const checkboxes = doc.querySelectorAll('input[type="checkbox"], input[type="radio"]')
        if (checkboxes.length > 0) {
          checkboxes.forEach((cb, index) => {
            // 获取label中的文本，可能是nextSibling或者parent的textContent
            let labelText = ''
            const parent = cb.parentElement
            if (parent) {
              // 获取label标签内的文本，去掉input本身
              const clone = parent.cloneNode(true) as HTMLElement
              const input = clone.querySelector('input')
              if (input) {
                input.remove()
              }
              labelText = clone.textContent?.trim() || `选项${index + 1}`
            } else {
              labelText = cb.nextSibling?.textContent?.trim() || `选项${index + 1}`
            }
            if (labelText) {
              options.push({ name: labelText, score: 18 - index * 2 })
            }
          })
        }
        
        // 解析下拉框
        const select = doc.querySelector('select')
        if (select && options.length === 0) {
          const selectOptions = select.querySelectorAll('option')
          selectOptions.forEach((opt, index) => {
            const labelText = opt.textContent?.trim() || opt.value || `选项${index + 1}`
            options.push({ name: labelText, score: 18 - index * 2 })
          })
        }
        
        // 如果解析失败，使用默认选项
        if (options.length === 0) {
          if (selectElement.type === 'checkbox') {
            options = [
              { name: '选项1', score: 18 },
              { name: '选项2', score: 16 },
              { name: '选项3', score: 14 }
            ]
          } else {
            options = [
              { name: '选项1', score: 18 },
              { name: '选项2', score: 16 }
            ]
          }
        }
      } else {
        // 默认选项
        if (selectElement.type === 'checkbox') {
          options = [
            { name: '选项1', score: 18 },
            { name: '选项2', score: 16 },
            { name: '选项3', score: 14 }
          ]
        } else {
          options = [
            { name: '选项1', score: 18 },
            { name: '选项2', score: 16 }
          ]
        }
      }
      
      return {
        type: 'select',
        data: options
      }
    }
  }
  
  // 计分类型
  return {
    type: 'count',
    data: []
  }
}

// 复制代码
const handleCopyCode = () => {
  const json = generateJson()
  const jsonStr = JSON.stringify(json, null, 2)
  navigator.clipboard.writeText(jsonStr).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

// 对话框打开时重新生成JSON
const handleDialogOpened = () => {
  if (droppedElements.value.length === 0) {
    addForm.jsonText = ''
    return
  }
  const json = generateJson()
  if (json) {
    addForm.jsonText = JSON.stringify(json, null, 2)
  } else {
    addForm.jsonText = ''
    ElMessage.warning('生成JSON失败，请检查元素配置')
  }
}

// 提交
const handleSubmit = () => {
  if (droppedElements.value.length === 0) {
    ElMessage.warning('请先拖拽元素到右侧区域')
    return
  }
  const json = generateJson()
  if (!json) {
    ElMessage.error('生成JSON失败')
    return
  }
  addForm.jsonText = JSON.stringify(json, null, 2)
  addDialogVisible.value = true
}

// 清空
const handleClear = () => {
  droppedElements.value = []
}

// 格式化JSON参数
const formatJsonParam = (jsonParam: string) => {
  try {
    const parsed = JSON.parse(jsonParam)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return jsonParam
  }
}

// 添加JSON
const handleAddJson = async () => {
  if (!addForm.description) {
    ElMessage.warning('请输入描述')
    return
  }
  
  // 如果jsonText为空，重新生成
  if (!addForm.jsonText || addForm.jsonText.trim() === '') {
    if (droppedElements.value.length === 0) {
      ElMessage.warning('请先拖拽元素到右侧区域')
      return
    }
    const json = generateJson()
    if (!json) {
      ElMessage.error('生成JSON失败，请检查元素配置')
      return
    }
    addForm.jsonText = JSON.stringify(json, null, 2)
  }
  
  // 验证JSON格式
  try {
    JSON.parse(addForm.jsonText)
  } catch (error) {
    ElMessage.error('JSON格式错误，请检查')
    return
  }
  
  try {
    loading.value = true
    const res = await addJson({
      jsonText: addForm.jsonText,
      description: addForm.description
    })
    if (res.code === 200) {
      ElMessage.success('添加成功')
      addDialogVisible.value = false
      addForm.description = ''
      addForm.jsonText = ''
      getListData()
    }
  } catch (error) {
    ElMessage.error('添加失败')
  } finally {
    loading.value = false
  }
}

// 获取列表
const getListData = async () => {
  try {
    loading.value = true
    const res = await getJsonList({})
    if (res.code === 200) {
      jsonList.value = res.list || []
    }
  } catch (error) {
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

// 加载JSON
const handleLoadJson = (row: any) => {
  try {
    const jsonParam = JSON.parse(row.jsonParam)
    // 根据JSON参数还原元素
    droppedElements.value = []
    // 这里可以根据jsonParam还原元素，简化处理
    ElMessage.success('加载成功')
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

// 删除JSON
const handleDeleteJson = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    loading.value = true
    const res = await deleteJson({ id: row.id })
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getListData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  } finally {
    loading.value = false
  }
}

// 页面加载时获取列表
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.page-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .element-tip {
    font-size: 12px;
    color: #909399;
    margin-bottom: 15px;
    line-height: 1.5;
  }

  .element-list {
    max-height: 600px;
    overflow-y: auto;
  }

  .element-item {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: move;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
      background-color: #f5f7fa;
    }

    .element-label {
      font-weight: bold;
      margin-bottom: 8px;
      color: #303133;
    }
  }

  .element-actions {
    margin-top: 20px;
    text-align: center;
  }

  .drop-area {
    min-height: 400px;
    padding: 20px;
    border: 2px dashed #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-content: flex-start;

    .empty-tip {
      width: 100%;
      text-align: center;
      color: #909399;
      padding: 50px 0;
    }

    .dropped-element {
      padding: 15px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      background-color: #fafafa;
      position: relative;

      .element-label {
        font-weight: bold;
        margin-bottom: 8px;
        color: #303133;
      }

      .element-actions {
        margin-top: 10px;
        font-size: 12px;
        text-align: right;

        a {
          color: #409eff;
          text-decoration: none;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .code-actions {
    margin-top: 20px;
    text-align: right;
  }

  pre {
    margin: 0;
    font-size: 12px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
</style>
