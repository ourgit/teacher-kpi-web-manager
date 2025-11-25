<template>
  <div class="page-container scrollable-page">
    <div class="page-content-wrapper">
      <!-- 选项配置区域 -->
        <el-card shadow="hover" class="layout-padding-auto">
          <template #header>
            <div class="card-header">
            <span>选项配置</span>
            <div style="display: flex; gap: 10px; align-items: center;">
              <el-select v-model="currentType" placeholder="请选择类型" style="width: 150px">
                <el-option label="计分" value="count" />
                <el-option label="选择" value="select" />
                <el-option label="排它" value="exclusive" />
              </el-select>
              <el-button type="primary" @click="handleAddOption">添加选项</el-button>
            </div>
          </div>
        </template>
        <div class="options-list">
          <div v-if="options.length === 0" class="empty-tip">
            暂无选项，请点击"添加选项"按钮添加
          </div>
          <div
            v-for="(option, index) in options"
            :key="option.id"
            class="option-item"
          >
            <div class="option-content">
              <div class="option-index">{{ index + 1 }}</div>
              <div class="option-form">
                <el-input
                  v-model="option.name"
                  placeholder="请输入选项名称"
                  @blur="handleOptionChange"
                />
                <el-input-number
                  v-model="option.score"
                  :min="0"
                  :max="100"
                  placeholder="请输入分数"
                  @change="handleOptionChange"
                />
            </div>
              <div class="option-actions">
                <el-button
                  size="small"
                  type="danger"
                  :icon="Delete"
                  circle
                  @click="handleRemoveOption(index)"
                />
                <el-button
                  v-if="index > 0"
                  size="small"
                  :icon="ArrowUp"
                  circle
                  @click="handleMoveOption(index, 'up')"
                />
                <el-button
                  v-if="index < options.length - 1"
                  size="small"
                  :icon="ArrowDown"
                  circle
                  @click="handleMoveOption(index, 'down')"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="config-actions">
          <el-button type="success" @click="handleSubmit">{{ isEditMode ? '更新配置' : '保存配置' }}</el-button>
          <el-button @click="handleClear">清空</el-button>
          <el-button v-if="isEditMode" @click="handleCancelEdit">取消编辑</el-button>
          <!-- <el-button type="warning" @click="handleCopyCode">复制JSON</el-button> -->
          </div>
        </el-card>

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
        <el-table-column prop="jsonParam" label="JSON参数" min-width="400">
          <template #default="{ row }">
            <div class="json-display-wrapper">
              <div class="json-display-header">
                <span class="json-type-badge" :class="getJsonTypeClass(row.jsonParam)">
                  {{ getJsonTypeLabel(row.jsonParam) }}
                </span>
                <el-button
                  size="small"
                  text
                  type="primary"
                  :icon="DocumentCopy"
                  @click="handleCopyJson(row.jsonParam)"
                >
                  复制JSON
                </el-button>
              </div>
              <div class="json-display-content">
                <div class="json-preview">
                  <template v-if="getJsonType(row.jsonParam) === 'count'">
                    <div class="json-preview-item">
                      <el-icon class="preview-icon"><Document /></el-icon>
                      <span class="preview-text">计分类型：无需选项配置</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="json-preview-title">选项列表：</div>
                    <div class="json-preview-options">
                      <div
                        v-for="(item, index) in getJsonOptions(row.jsonParam)"
                        :key="index"
                        class="json-preview-option"
                      >
                        <el-tag class="option-index-tag" size="small">{{ index + 1 }}</el-tag>
                        <span class="option-name">{{ item.name }}</span>
                        <el-tag type="success" size="small" class="option-score-tag">
                          分数：{{ item.score }}
                        </el-tag>
                      </div>
                      <div v-if="getJsonOptions(row.jsonParam).length === 0" class="empty-options">
                        暂无选项
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
          <!--   <el-button size="small" text type="primary" @click="handleLoadJson(row)">加载</el-button> -->
            <el-button
              v-if="row.id !== 1"
              size="small"
              text
              type="primary"
              @click="handleEditJson(row)"
            >编辑</el-button>
            <el-button
              v-if="row.id !== 1"
              size="small"
              text
              type="danger"
              @click="handleDeleteJson(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 保存配置对话框 -->
      <el-dialog v-model="saveDialogVisible" :title="isEditMode ? '更新配置' : '保存配置'" width="600px" @opened="handleDialogOpened">
      <el-form :model="saveForm" label-width="100px">
        <el-form-item label="描述">
            <el-select v-model="saveForm.description" placeholder="请选择类型" style="width: 100%">
              <el-option label="计分" value="count" />
              <el-option label="选择" value="select" />
              <el-option label="排它" value="exclusive" />
            </el-select>
        </el-form-item>
        <el-form-item label="JSON参数">
          <el-input
            v-model="saveForm.jsonText"
            type="textarea"
            :rows="10"
              placeholder="JSON参数"
              readonly
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveJson">{{ isEditMode ? '更新' : '确定' }}</el-button>
      </template>
    </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, ArrowUp, ArrowDown, DocumentCopy, Document } from '@element-plus/icons-vue'
import useClipboard from 'vue-clipboard3'
import { addJson, getJsonList, deleteJson, updateJson } from '@/api/tool/index'

interface OptionItem {
  id: number
  name: string
  score: number
}

// 类型映射：英文值 -> 中文名称
const typeMap: Record<string, string> = {
  count: '计分',
  select: '选择',
  exclusive: '排它',
  exclude: '排它'
}

// 类型反向映射：中文名称 -> 英文值
const typeReverseMap: Record<string, string> = {
  '计分': 'count',
  '选择': 'select',
  '排它': 'exclusive'
}

const loading = ref(false)
const jsonList = ref<any[]>([])
const options = ref<OptionItem[]>([])
const currentType = ref('select')
const isEditMode = ref(false)
const editingId = ref(0)
const saveDialogVisible = ref(false)
const saveForm = reactive({
  id: 0,
  description: 'select',
  jsonText: ''
})

// 添加选项
const handleAddOption = () => {
  const newOption: OptionItem = {
    id: Date.now() + Math.random(),
    name: '',
    score: 0
  }
  options.value.push(newOption)
}

// 移除选项
const handleRemoveOption = (index: number) => {
  options.value.splice(index, 1)
}

// 移动选项
const handleMoveOption = (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex >= 0 && targetIndex < options.value.length) {
    const temp = options.value[index]
    options.value[index] = options.value[targetIndex]
    options.value[targetIndex] = temp
  }
}

// 选项变化时更新JSON
const handleOptionChange = () => {
  // 可以在这里实时更新预览
}

// 生成JSON
const generateJson = (type?: string) => {
  const jsonType = type || currentType.value || 'select'
  
  if (jsonType === 'count') {
    return {
      type: 'count',
      data: []
    }
  }
  
  if (options.value.length === 0) {
    return null
  }
  
  // 过滤掉名称为空的选项
  const validOptions = options.value
    .filter(opt => opt.name && opt.name.trim())
    .map(opt => ({
      name: opt.name.trim(),
      score: opt.score || 0
    }))
  
  if (validOptions.length === 0) {
    return null
  }
  
  return {
    type: jsonType,
    data: validOptions
  }
}

// 复制代码
/* const handleCopyCode = () => {
  const json = generateJson()
  if (!json) {
    ElMessage.warning('请先配置选项')
    return
  }
  const jsonStr = JSON.stringify(json, null, 2)
  navigator.clipboard.writeText(jsonStr).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
} */

// 提交
const handleSubmit = () => {
  // 如果是计分类型，不需要选项
  if (currentType.value === 'count') {
    const json = generateJson('count')
    if (!json) {
      ElMessage.error('生成JSON失败')
      return
    }
    saveForm.description = currentType.value
    saveForm.jsonText = JSON.stringify(json, null, 2)
    saveForm.id = isEditMode.value ? editingId.value : 0
    saveDialogVisible.value = true
    return
  }
  
  // 选择和排它类型需要选项
  if (options.value.length === 0) {
    ElMessage.warning('请先添加选项')
    return
  }
  
  const validOptions = options.value.filter(opt => opt.name && opt.name.trim())
  if (validOptions.length === 0) {
    ElMessage.warning('请至少填写一个选项名称')
    return
  }
  
  const json = generateJson()
  if (!json) {
    ElMessage.error('生成JSON失败')
    return
  }
  saveForm.description = currentType.value
  saveForm.jsonText = JSON.stringify(json, null, 2)
  saveForm.id = isEditMode.value ? editingId.value : 0
  saveDialogVisible.value = true
}

// 对话框打开时生成JSON
const handleDialogOpened = () => {
  const json = generateJson()
  if (json) {
    saveForm.jsonText = JSON.stringify(json, null, 2)
  } else {
    saveForm.jsonText = ''
  }
}

// 监听类型变化，重新生成JSON
watch(() => saveForm.description, () => {
  if (saveDialogVisible.value) {
    const json = generateJson(saveForm.description)
    if (json) {
      saveForm.jsonText = JSON.stringify(json, null, 2)
    } else {
      saveForm.jsonText = ''
    }
  }
})

// 监听当前类型变化，同步到保存表单
watch(() => currentType.value, () => {
  if (saveDialogVisible.value) {
    saveForm.description = currentType.value
    const json = generateJson(currentType.value)
    if (json) {
      saveForm.jsonText = JSON.stringify(json, null, 2)
    } else {
      saveForm.jsonText = ''
    }
  }
})

// 清空
const handleClear = () => {
  options.value = []
  currentType.value = 'select'
  isEditMode.value = false
  editingId.value = 0
}

// 取消编辑
const handleCancelEdit = () => {
  options.value = []
  currentType.value = 'select'
  isEditMode.value = false
  editingId.value = 0
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

// 获取JSON类型
const getJsonType = (jsonParam: string): string => {
  try {
    const parsed = JSON.parse(jsonParam)
    const type = parsed.type || 'unknown'
    // 将 exclude 标准化为 exclusive
    return type === 'exclude' ? 'exclusive' : type
  } catch {
    return 'unknown'
  }
}

// 获取JSON类型标签
const getJsonTypeLabel = (jsonParam: string): string => {
  const type = getJsonType(jsonParam)
  return typeMap[type] || type
}

// 获取JSON类型样式类
const getJsonTypeClass = (jsonParam: string): string => {
  const type = getJsonType(jsonParam)
  // exclude 和 exclusive 使用相同的样式
  return type === 'exclusive' ? 'type-exclusive' : `type-${type}`
}

// 获取JSON选项列表
const getJsonOptions = (jsonParam: string): Array<{ name: string; score: number }> => {
  try {
    const parsed = JSON.parse(jsonParam)
    if (parsed.type === 'count') {
      return []
    }
    return Array.isArray(parsed.data) ? parsed.data : []
  } catch {
    return []
  }
}

// 复制JSON
const { toClipboard } = useClipboard()
const handleCopyJson = async (jsonParam: string) => {
  try {
    const formattedJson = formatJsonParam(jsonParam)
    await toClipboard(formattedJson)
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 保存JSON（新增或更新）
const handleSaveJson = async () => {
  if (!saveForm.description) {
    ElMessage.warning('请选择类型')
    return
  }
  
  // 如果jsonText为空，重新生成
  if (!saveForm.jsonText || saveForm.jsonText.trim() === '') {
    // 如果是count类型，直接生成
    if (saveForm.description === 'count') {
      const json = generateJson('count')
      if (!json) {
        ElMessage.error('生成JSON失败')
        return
      }
      saveForm.jsonText = JSON.stringify(json, null, 2)
    } else {
      // 选择和排它类型需要选项
      if (options.value.length === 0) {
        ElMessage.warning('请先添加选项')
        return
      }
      const json = generateJson(saveForm.description)
      if (!json) {
        ElMessage.error('生成JSON失败，请检查选项配置')
        return
      }
      saveForm.jsonText = JSON.stringify(json, null, 2)
    }
  }
  
  // 验证JSON格式
  try {
    const parsed = JSON.parse(saveForm.jsonText)
    const validTypes = ['count', 'select', 'exclusive', 'exclude']
    if (!validTypes.includes(parsed.type) || !Array.isArray(parsed.data)) {
      ElMessage.error('JSON格式错误，需要type为count/select/exclusive/exclude且data为数组')
      return
    }
    // 确保JSON中的type与选择的type一致
    if (parsed.type !== saveForm.description) {
      ElMessage.warning('JSON类型与选择的类型不一致，已自动更新')
      parsed.type = saveForm.description
      saveForm.jsonText = JSON.stringify(parsed, null, 2)
    }
  } catch (error) {
    ElMessage.error('JSON格式错误，请检查')
    return
  }
  
  try {
    loading.value = true
    // 将类型值转换为中文label作为描述传给后端
    const descriptionText = typeMap[saveForm.description] || saveForm.description
    
    if (isEditMode.value) {
      // 更新模式
      const res = await updateJson({
        id: saveForm.id,
        jsonText: saveForm.jsonText,
        description: descriptionText
      })
      if (res.code === 200) {
        ElMessage.success('更新成功')
        saveDialogVisible.value = false
        // 重置编辑状态
        isEditMode.value = false
        editingId.value = 0
        options.value = []
        currentType.value = 'select'
        saveForm.id = 0
        saveForm.description = 'select'
        saveForm.jsonText = ''
        getListData()
      }
    } else {
      // 新增模式
      const res = await addJson({
        jsonText: saveForm.jsonText,
        description: descriptionText
      })
      if (res.code === 200) {
        ElMessage.success('添加成功')
        saveDialogVisible.value = false
        saveForm.description = 'select'
        saveForm.jsonText = ''
        currentType.value = 'select'
        options.value = []
        getListData()
      }
    }
  } catch (error) {
    ElMessage.error(isEditMode.value ? '更新失败' : '添加失败')
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

// 加载JSON（用于加载到选项配置区域，不进入编辑模式）
const handleLoadJson = (row: any) => {
  try {
    const jsonParam = JSON.parse(row.jsonParam)
    const validTypes = ['count', 'select', 'exclusive', 'exclude']
    
    if (!validTypes.includes(jsonParam.type)) {
      ElMessage.warning('JSON格式不正确，需要type为count/select/exclusive/exclude的格式')
      return
    }
    
    // 设置类型：如果row.description是中文，转换为英文值；否则使用JSON中的type
    // 将exclude标准化为exclusive
    const jsonType = jsonParam.type === 'exclude' ? 'exclusive' : jsonParam.type
    const descriptionValue = typeReverseMap[row.description] || jsonType
    currentType.value = descriptionValue
    
    // 重置编辑模式
    isEditMode.value = false
    editingId.value = 0
    
    // 如果是count类型，清空选项
    if (jsonParam.type === 'count') {
      options.value = []
      ElMessage.success('加载成功')
      return
    }
    
    // 如果是select、exclusive或exclude类型，加载选项
    if (Array.isArray(jsonParam.data)) {
      options.value = jsonParam.data.map((item: any, index: number) => ({
        id: Date.now() + index + Math.random(),
        name: item.name || '',
        score: item.score || 0
      }))
      ElMessage.success('加载成功')
    } else {
      ElMessage.warning('JSON格式不正确，data应为数组')
    }
  } catch (error) {
    ElMessage.error('加载失败')
  }
}

// 编辑JSON - 加载数据到选项配置区域
const handleEditJson = (row: any) => {
  try {
    const jsonParam = JSON.parse(row.jsonParam)
    const validTypes = ['count', 'select', 'exclusive', 'exclude']
    
    if (!validTypes.includes(jsonParam.type)) {
      ElMessage.warning('JSON格式不正确，需要type为count/select/exclusive/exclude的格式')
      return
    }
    
    // 设置编辑模式
    isEditMode.value = true
    editingId.value = row.id
    
    // 将exclude标准化为exclusive
    const jsonType = jsonParam.type === 'exclude' ? 'exclusive' : jsonParam.type
    const descriptionValue = typeReverseMap[row.description] || jsonType
    currentType.value = descriptionValue
    
    // 如果是count类型，清空选项
    if (jsonParam.type === 'count') {
      options.value = []
    } else {
      // 如果是select、exclusive或exclude类型，加载选项
      if (Array.isArray(jsonParam.data)) {
        options.value = jsonParam.data.map((item: any, index: number) => ({
          id: Date.now() + index + Math.random(),
          name: item.name || '',
          score: item.score || 0
        }))
      } else {
        ElMessage.warning('JSON格式不正确，data应为数组')
        return
      }
    }
    
    ElMessage.success('已加载到编辑区域，请修改后点击"更新配置"')
  } catch (error) {
    ElMessage.error('加载数据失败')
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
  &.scrollable-page {
    position: relative !important;
    height: calc(100vh - 60px) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .page-content-wrapper {
    width: 100%;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .options-list {
    min-height: 200px;
    max-height: 600px;
    overflow-y: auto;
  }

  .empty-tip {
    text-align: center;
    color: #909399;
    padding: 50px 0;
    font-size: 14px;
  }

  .option-item {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fafafa;
    transition: all 0.3s;

    &:hover {
      border-color: #409eff;
      background-color: #f5f7fa;
    }

    .option-content {
    display: flex;
      align-items: center;
    gap: 15px;

      .option-index {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #409eff;
        color: #fff;
        border-radius: 50%;
        font-weight: bold;
        flex-shrink: 0;
      }

      .option-form {
        flex: 1;
        display: flex;
        gap: 15px;

        :deep(.el-input) {
          flex: 2;
        }

        :deep(.el-input-number) {
          flex: 1;
          width: 100%;
        }
      }

      .option-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    }
  }

  .config-actions {
    margin-top: 20px;
    text-align: right;
    padding-top: 20px;
    border-top: 1px solid #dcdfe6;
  }

  .json-display-wrapper {
    position: relative;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    background-color: #ffffff;
    transition: all 0.3s;
    overflow: hidden;

    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 12px rgba(64, 158, 255, 0.15);
    }

    .json-display-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
      border-bottom: 1px solid #e4e7ed;

      .json-type-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;

        &.type-count {
          background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
        }

        &.type-select {
          background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
        }

        &.type-exclusive {
          background: linear-gradient(135deg, #f56c6c 0%, #ff7875 100%);
          box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
          font-weight: 600;
          border: 1px solid rgba(245, 108, 108, 0.3);
        }

        &.type-unknown {
          background: #909399;
        }
      }
    }

    .json-display-content {
      padding: 16px;
      background-color: #ffffff;

      .json-preview {
        .json-preview-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background-color: #f0f9ff;
          border-radius: 6px;
          border-left: 3px solid #409eff;

          .preview-icon {
            font-size: 18px;
            color: #409eff;
          }

          .preview-text {
            color: #606266;
            font-size: 14px;
          }
        }

        .json-preview-title {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 12px;
        }

        .json-preview-options {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .json-preview-option {
            display: flex;
            align-items: center;
            padding: 12px 14px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            border: 1px solid #e4e7ed;
            border-radius: 6px;
            transition: all 0.3s;

            &:hover {
              border-color: #409eff;
              background: linear-gradient(135deg, #ecf5ff 0%, #ffffff 100%);
              box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
            }

            .option-index-tag {
              min-width: 28px;
              text-align: center;
              background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
              border: none;
              color: #fff;
              font-weight: 500;
              margin-right: 10px;
              flex-shrink: 0;
            }

            .option-name {
              font-size: 14px;
              color: #303133;
              font-weight: 500;
              margin-right: 8px;
            }

            .option-score-tag {
              background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
              border: none;
              color: #fff;
              font-weight: 500;
              flex-shrink: 0;
            }
          }

          .empty-options {
            text-align: center;
            padding: 20px;
            color: #909399;
            font-size: 14px;
          }
        }
      }
    }
  }

}
</style>
