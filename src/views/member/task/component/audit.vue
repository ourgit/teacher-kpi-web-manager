<template>
  <div class="dialog-container">
    <el-dialog title="审批分数" v-model="isShowDialog" width="900px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分数" prop="score">
              <el-input v-model="ruleForm.data.score" placeholder="请输入分数" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    <el-table 
      :data="state.filteredFileList" 
      v-loading="loading"
      style="width: 100%"
      :default-sort="{ prop: 'path', order: 'ascending' }"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      
      <el-table-column label="文件预览" width="120" align="center">
      <template #default="{ row }">
        <div class="table-preview">
          <el-image
            v-if="isImage(row.path)"
            :src="getFileUrl(row.path)"
            fit="cover"
            class="table-image preview-image"
            hide-on-click-modal
            preview-teleported
            :preview-src-list="state.srcList" show-progress
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
      
      <el-table-column prop="description" label="附件说明" min-width="120" show-overflow-tooltip>
        <template #default="{ row }">
          <el-text>{{ row.description }}</el-text>
        </template>
      </el-table-column>
      
      <el-table-column prop="content" label="内容" min-width="220" align="center" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag type="primary" effect="light">
            {{ row.content }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">提 交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent,reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { addLeaderScore,getTeacherTaskFile } from '@/api/member/index'
import {
  Picture,
  Document
} from '@element-plus/icons-vue'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
  },
  srcList: [] as any,
  filteredFileList:[] as any,
  isShowDialog: false
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

const downloadFile=(row:any)=>{
  try {
    // 创建隐藏的下载链接
    const link = document.createElement('a')
    link.href = "/"+row.path
    link.download = getFilenameFromUrl("/"+row.path)
    link.style.display = 'none'
    
    // 添加到DOM并触发点击
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
const getFilenameFromUrl = (url:any) => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    return pathname.split('/').pop() || 'download'
  } catch {
    // 如果URL解析失败，尝试从路径中提取
    const segments = url.split('/')
    return segments[segments.length - 1] || 'download'
  }
}

const getFileIconColor = (path:any) => {
  if (isImage(path)) return '#409EFF'
  return '#909399'
}
const getFileIcon = (path:any) => {
  if (isImage(path)) return Picture
  return Document
}
const isImage = (path:any) => {
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
  return imageExtensions.some(ext => path.toLowerCase().endsWith(ext))
}
const getFileUrl = (path:any) => {
  return `http://120.48.81.209/${path}`
}
const getTaskFile=(row :any)=>{
  getTeacherTaskFile({
    taskId: row.id
  }).then((data: any)=>{
    state.filteredFileList=data.list;
    state.srcList =state.filteredFileList.map((filter:any)=>getFileUrl(filter.path))
  }).catch(()=>{
    console.error("出错")
  })
}

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  state.ruleForm={
    id:row.id,
    data:{
      tesId:row.tesId,
      score:row.teacherElementScore.score
    }
  }
  getTaskFile(row)
}

// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
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

// 暴露变量
defineExpose({
  openDialog,
})
</script>
