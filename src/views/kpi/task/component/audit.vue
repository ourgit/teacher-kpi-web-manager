<template>
  <div class="dialog-container">
    <el-dialog
      title="审批分数"
      v-model="isShowDialog"
      width="1600px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <el-table :data="state.elementList" v-loading="loading" style="width: 100%">
        <el-table-column prop="elementName" label="要素名称" width="120" />
        <el-table-column prop="maxScore" label="最高分数" show-overflow-tooltip width="130"/>
        <el-table-column prop="teacherElementScore" label="该教师的分数" show-overflow-tooltip/>
        <el-table-column label="内容列表" min-width="200">
          <template #default="{ row }">
            <el-table :data="row.contentList" v-loading="loading" style="width: 100%">
              <el-table-column prop="content" label="内容名称" show-overflow-tooltip/>
              <el-table-column prop="maxScore" label="最高分数" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :class="getQualificationClass(row.maxScore)">
                    {{ getQualificationText(row.maxScore) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="teacherContentScore" label="该教师的期望分数" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :class="getQualificationClass(row.teacherContentScore)">
                    {{ getQualificationText(row.teacherContentScore) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="finalScore" label="最终分数" width="150">
                <template #default="{ row }">
                  <el-select
                    v-if="Number(row.maxScore) === 5000"
                    v-model="row.finalScore"
                    placeholder="请选择"
                    size="small"
                    style="width: 100%"
                  >
                    <el-option label="合格 (5000)" :value="5000" />
                    <el-option label="不合格 (-5000)" :value="-5000" />
                  </el-select>
                  <el-input-number
                    v-else
                    v-model="row.finalScore"
                    :precision="2"
                    :step="0.1"
                    size="small"
                    style="width: 100%"
                    controls-position="right"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" show-overflow-tooltip/>
              <el-table-column prop="path" label="附件" min-width="200">
                <template #default="{ row }">
                  <div v-if="row.path" style="display: flex; flex-direction: column; gap: 8px;">
                    <template v-for="(filePath, index) in splitFilePaths(row.path)" :key="index">
                      <div v-if="isImage(filePath)" style="position: relative;">
                        <el-image
                          :src="getFileUrl(filePath)"
                          :preview-src-list="getPreviewSrcList(row.path)"
                          fit="cover"
                          style="width: 80px; height: 80px; border-radius: 4px; cursor: pointer;"
                          :preview-teleported="true"
                        />
                      </div>
                      <div v-else style="display: flex; align-items: center; gap: 4px; padding: 4px 8px; background: #f5f7fa; border-radius: 4px;">
                        <el-icon :size="16" color="#909399">
                          <Document />
                        </el-icon>
                        <span style="font-size: 12px; color: #606266;">{{ getFilenameFromPath(filePath) }}</span>
                      </div>
                    </template>
                  </div>
                  <span v-else style="color: #909399; font-size: 12px;">暂无附件</span>
                </template>
              </el-table-column>
              <el-table-column prop="isNeedFile" label="是否需要文件">
                <template #default="{ row }">
                  <el-tag v-if="row.isNeedFile==true" type="danger" effect="dark">
                    需要文件
                  </el-tag>
                  <el-tag v-else type="primary" effect="dark">
                    不需要文件
                  </el-tag>
                </template>
              </el-table-column>
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
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { addLeaderScore, getElementListById } from '@/api/member/index'
import { Document } from '@element-plus/icons-vue'
import { fileIPLocate } from '@/utils/getIP'

const emit = defineEmits(['refresh'])

const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {},
  elementList: [] as any,
  isShowDialog: false,
  status:0,
  flag:true,
})

const { loading, ruleForm, rules, isShowDialog } = toRefs(state)

// 分割文件路径（支持逗号、中文逗号、换行符分隔）
const splitFilePaths = (path: string | undefined) => {
  if (!path) return []
  return path
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

// 判断是否为图片
const isImage = (path: string) => {
  if (!path || typeof path !== 'string') return false
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg']
  return imageExtensions.some((ext) => path.toLowerCase().endsWith(ext))
}

// 获取文件完整URL
const getFileUrl = (path: string) => {
  if (!path || typeof path !== 'string') return ''
  const normalizedPath = path.replace(/^\/+/, '')
  return `${fileIPLocate}/${normalizedPath}`
}

// 从路径中提取文件名
const getFilenameFromPath = (path: string) => {
  if (!path) return ''
  const segments = path.split('/')
  return segments[segments.length - 1] || path
}

// 构建图片预览列表（保持同一组预览）
const getPreviewSrcList = (paths: string | undefined) => {
  return splitFilePaths(paths)
    .filter((item) => isImage(item))
    .map((item) => getFileUrl(item))
}

// 期望分数对应状态
const getQualificationText = (score: number | string | undefined) => {
  const numericScore = Number(score)
  if (Number.isNaN(numericScore)) return ''
  if (numericScore >= 5000) return '合格'
  if (numericScore <= -5000) return '不合格'
  return numericScore
}

const getQualificationClass = (score: number | string | undefined) => {
  const numericScore = Number(score)
  if (Number.isNaN(numericScore)) return ''
  if (numericScore >= 5000) return 'qualified-text'
  if (numericScore <= -5000) return 'unqualified-text'
  return ''
}

const getElementListByIndicatorId=(row: any,status: any) => {
  getElementListById({
    indicatorId:row.indicator.id,
    userId:row.userId,
    status:status
  }).then((data:any)=>{
    state.elementList=data.list;
    console.log(state.elementList)
    state.elementList.forEach((element:any)=>{
      element.contentList.forEach((content:any)=>{
        // 如果最终分数为null，默认为0.0
        if (content.finalScore === null || content.finalScore === undefined) {
          content.finalScore = Number(0.0)
        }
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
  state.status=status;
}

const closeDialog = () => {
  state.isShowDialog = false
}

const onCancel = () => {
  closeDialog()
}

const onSubmit = () => {
  if(state.flag){
    state.flag=false
    // 重新收集最新的最终分数，以字符串格式的浮点数传递
    state.ruleForm.data = []
    state.elementList.forEach((element:any)=>{
      element.contentList.forEach((content:any)=>{
        const item={
          contentId:content.contentId,
          score:parseFloat(content.finalScore || 0).toFixed(2)
        }
        state.ruleForm.data.push(item)
      })
    })
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
    state.flag=true
  }
    
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

</style>