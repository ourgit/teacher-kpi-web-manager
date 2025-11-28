<template>
  <div class="dialog-container">
    <el-dialog
      title="审批分数"
      v-model="isShowDialog"
      width="900px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="dialogFormRef"
        :model="ruleForm"
        :rules="rules"
        size="default"
        label-width="120px"
      >
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分数" prop="score" v-if="showQualificationSelect()">
              <el-input
                v-model="ruleForm.data.score"
                placeholder="请输入分数"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="选项" prop="score" v-else>
                <el-radio-group v-model="ruleForm.data.score">
                  <el-radio label="5000" size="large">
                  <span class="qualified-text">合格</span>
                </el-radio>
                <el-radio label="-5000" size="large">
                  <span class="unqualified-text">不合格</span>
                </el-radio>
              </el-radio-group>  
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="file-groups" v-loading="loading">
        <template v-if="groupedFileList.length">
          <div
            class="file-group"
            v-for="group in groupedFileList"
            :key="group.key"
          >
            <div class="file-group-header">
              <div class="group-title">
                <el-tag type="primary" effect="dark">
                  {{ group.key }}
                </el-tag>
              </div>
              <div class="group-count">共 {{ group.list.length }} 条</div>
            </div>
            <el-table
              :data="group.list"
              style="width: 100%"
              size="small"
              border
              :default-sort="{ prop: 'path', order: 'ascending' }"
            >
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
              />
              <el-table-column label="文件预览" width="140" align="center">
                <template #default="{ row }">
                  <div class="table-preview">
                    <el-image
                      v-if="isImage(row.path)"
                      :src="getFileUrl(row.path)"
                      fit="cover"
                      class="table-image preview-image"
                      hide-on-click-modal
                      preview-teleported
                      :preview-src-list="state.srcList"
                      show-progress
                    >
                      <template #error>
                        <div class="table-image-error">
                          <el-icon><Picture /></el-icon>
                        </div>
                      </template>
                    </el-image>
                    <div v-else class="table-file-icon">
                      <div @click="downloadFile(row)">
                        <el-icon :color="getFileIconColor(row.path)">
                          <component :is="getFileIcon(row.path)" />
                        </el-icon>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                label="附件说明"
                min-width="140"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <el-text>{{ row.description || '—' }}</el-text>
                </template>
              </el-table-column>
              <el-table-column
                prop="content"
                label="内容"
                min-width="200"
                align="center"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <el-tag type="info" effect="plain">
                    {{ row.content || '未填写' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <el-empty v-else description="暂无附件" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
            size="default"
            :loading="loading"
          >
            提 交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, computed } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { addLeaderScore, getTeacherTaskFile } from '@/api/member/index'
import { Picture, Document } from '@element-plus/icons-vue'

const emit = defineEmits(['refresh'])

const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {},
  srcList: [] as any,
  filteredFileList: [] as any,
  isShowDialog: false,
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

const groupedFileList = computed(() => {
  const groupMap = new Map<string, any[]>()
  state.filteredFileList.forEach((file: any) => {
    const key = file.content || '未分类'
    if (!groupMap.has(key)) {
      groupMap.set(key, [])
    }
    groupMap.get(key)!.push(file)
  })
  return Array.from(groupMap.entries()).map(([key, list]) => ({
    key,
    list,
  }))
})

const showQualificationSelect = ()=>{
  if(state.ruleForm.data.score>=5000||state.ruleForm.data.score<=-5000){
    return false;
  }else{
    return true;
  }
}

const toRelativePath = (path: any) => {
  if (!path || typeof path !== 'string') return ''
  return path.startsWith('/') ? path : `/${path}`
}

const downloadFile = (row: any) => {
  try {
    const relativePath = toRelativePath(row.path)
    if (!relativePath) throw new Error('无效的文件路径')
    const link = document.createElement('a')
    link.href = relativePath
    link.download = getFilenameFromUrl(relativePath)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return true
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('文件下载失败')
    return false
  }
}


const getFilenameFromUrl = (url: any) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    return pathname.split('/').pop() || 'download'
  } catch {
    const segments = url.split('/')
    return segments[segments.length - 1] || 'download'
  }
}

const getFileIconColor = (path: any) => {
  if (isImage(path)) return '#409EFF'
  return '#909399'
}

const getFileIcon = (path: any) => {
  if (isImage(path)) return Picture
  return Document
}

const isImage = (path: any) => {
  if (!path || typeof path !== 'string') return false
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext))
}

const getFileUrl = (path: any) => {
  if (!path || typeof path !== 'string') return ''
  const normalizedPath = path.replace(/^\/+/, '')
  return `http://120.48.81.209/${normalizedPath}`
}

const splitFilePaths = (path: string | undefined) => {
  if (!path) return []
  return path
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const normalizeFileList = (list: any[] = []) => {
  const normalized: any[] = []
  list.forEach((item) => {
    const paths = splitFilePaths(item.path)
    if (paths.length === 0) {
      normalized.push(item)
      return
    }
    paths.forEach((path, idx) => {
      normalized.push({
        ...item,
        path,
        _pathIndex: idx,
      })
    })
  })
  return normalized
}

const getTaskFile = (row: any) => {
  getTeacherTaskFile({
    taskId: row.id,
    userId: row.userId,
  })
    .then((data: any) => {
      const list = Array.isArray(data.list) ? data.list : []
      state.filteredFileList = normalizeFileList(list)
      state.srcList = state.filteredFileList
        .filter((file: any) => !!file.path)
        .map((file: any) => getFileUrl(file.path))
    })
    .catch(() => {
      console.error('出错')
    })
}

const openDialog = (row: any) => {
  state.isShowDialog = true
  state.ruleForm = {
    id: row.id,
    data: {
      tesId: row.tesId,
      score: row.teacherElementScore.score,
    },
  }
  getTaskFile(row)
}

const closeDialog = () => {
  state.isShowDialog = false
}

const onCancel = () => {
  closeDialog()
}

const onSubmit = () => {
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      addLeaderScore(state.ruleForm)
        .then(() => {
          ElMessage({
            message: '审批成功',
            type: 'success',
          })
          state.loading = false
          closeDialog()
          emit('refresh')
        })
        .catch(() => {
          state.loading = false
        })
    } else {
      return false
    }
  })
}

defineExpose({
  openDialog,
})
</script>

<style scoped>
.qualified-text {
  color: #67c23a;
  font-weight: 500;
}

.unqualified-text {
  color: #f56c6c;
  font-weight: 500;
}

.file-groups {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.file-group {
  padding: 14px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fdfdff;
}

.file-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.group-count {
  color: #909399;
  font-size: 13px;
}
</style>