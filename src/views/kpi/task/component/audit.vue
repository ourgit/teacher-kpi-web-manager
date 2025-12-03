<template>
  <div class="dialog-container">
    <el-dialog
      title="审批分数"
      v-model="isShowDialog"
      width="1200px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-table :data="state.elementList" v-loading="loading" style="width: 100%">
        <el-table-column prop="elementName" label="要素名称" width="120" />
        <el-table-column prop="maxScore" label="最高分数" show-overflow-tooltip width="130"/>
        <el-table-column prop="teacherElementScore" label="该教师的分数" show-overflow-tooltip/>
        <el-table-column prop="elementType" label="要素类型" show-overflow-tooltip/>
        <el-table-column label="内容列表" min-width="200">
          <template #default="{ row }">
            <el-table :data="row.contentList" v-loading="loading" style="width: 100%">
              <el-table-column prop="content" label="内容名称" show-overflow-tooltip/>
              <el-table-column prop="contentType" label="内容类型" show-overflow-tooltip/>
              <el-table-column prop="teacherContentScore" label="该教师的分数" show-overflow-tooltip />
              <el-table-column prop="description" label="描述" show-overflow-tooltip/>
              <el-table-column prop="path" label="附件路径" show-overflow-tooltip/>
            </el-table>
          </template>
        </el-table-column>
      </el-table>
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
import { addLeaderScore, getElementListById, getTeacherTaskFile } from '@/api/member/index'
import { Picture, Document } from '@element-plus/icons-vue'

const emit = defineEmits(['refresh'])

const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {},
  srcList: [] as any,
  elementList: [] as any,
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
    .catch((e:any) => {
      console.error('出错',e);
    })
}

const getElementListByIndicatorId=(row: any,status: any) => {
  getElementListById({
    indicatorId:row.indicator.id,
    userId:row.userId,
    status:status
  }).then((data:any)=>{
    state.elementList=data.list;
    state.elementList.forEach((element:any)=>{
      element.contentList.forEach((content:any)=>{
        const item={
          contentId:content.contentId,
          score:content.finalScore
        }
        state.ruleForm.data.push(item)
      })
    })
    console.log(state.ruleForm.data);
  }).catch((e:any)=>{
    console.error("出错",e);
  })
}

const openDialog = (row: any,status: any) => {
  state.isShowDialog = true
  state.ruleForm={
    id:row.id,
    userId:row.userId,
    data:[]
  }
  getElementListByIndicatorId(row,status)
  
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