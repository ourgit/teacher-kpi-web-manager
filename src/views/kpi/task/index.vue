<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item label="ID">
          <el-input v-model="queryData.id" size="default" placeholder="请输入ID" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status" size="default" placeholder="用户" clearable>
            <el-option label="全部" value="" />
            <el-option label="已完成" value="已完成" />
            <el-option label="待完成" value="待完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="上报用户">
          <el-select v-model="queryData.childId" size="default" placeholder="用户" clearable>
            <el-option label="全部" :value="0" />
            <el-option v-for="item in state.userList" :key="item.id" :label="item.userName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="default" type="primary" @click="getListData">
            <el-icon>
              <ele-Search />
            </el-icon>
            查询
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="Id" width="120" />
        <el-table-column prop="status" label="状态" show-overflow-tooltip width="130"/>
        <el-table-column label="该用户评分分数" show-overflow-tooltip>
          <template #default="{ row }">
              {{ isPass(row.teacherElementScore?.score) }}
          </template>
        </el-table-column>
        <el-table-column label="最终分数" show-overflow-tooltip>
          <template #default="{ row }">
              {{ isPass(row.teacherElementScore?.finalScore) }}
          </template>
        </el-table-column>
        <el-table-column prop="element.element" label="评分要素名称" show-overflow-tooltip/>
        <el-table-column prop="userName" label="上报用户" show-overflow-tooltip/>
        <el-table-column prop="parentName" label="评分用户" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="parent-tags" v-if="formatParentNames(row.parentName).length">
              <el-tag
                v-for="(name, idx) in formatParentNames(row.parentName)"
                :key="idx"
                type="info"
                effect="light"
                class="parent-tag"
              >
                {{ name }}
              </el-tag>
            </div>
            <span v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="onAudit(row)">审核</el-button>
            <el-button v-if="row.status === '已完成'" size="small" text type="success" @click="onSettle(row)">结算</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-bottom">
        <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <auditDialog ref="auditDialogRef" @refresh="getListData"/>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, onMounted, ref, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getLeaderTask,getTeacherList, deleteTeacherTask } from '@/api/member/index'
import { storeToRefs } from 'pinia'
import { useUserInfo } from '@/stores/userInfo'
const stores = useUserInfo()
const { userInfos } = storeToRefs(stores) as any
import { Session } from '@/utils/storage'

const auditDialog = defineAsyncComponent(
  () => import('./component/audit.vue')
)

// 引入组件
// 定义变量
const auditDialogRef = ref()
const state = reactive({
  list: [],
  loading: false,
  currentPage: 1,
  totalPage: 1,
  queryData: {
    id:'',
    status:'',
    childId:''
  } as any,
  current:1,
  submitData: {},
  roleList: [] as any,
  userList: [] as any,
  totalMembers: 0,
  totalBalance: 0
})

const { list, loading, currentPage, totalPage, queryData, totalMembers, totalBalance } = toRefs(state)

const getListTeacher=()=>{
  getTeacherList()
  .then((data: any) =>{
    console.log(data)
    state.userList=data.list;
  }).catch(() => {
    console.error("获取失败");
  })
}

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  const formData = state.queryData
  getLeaderTask({
    userId:Session.getString("uid"),
    ...formData
  }).then((data: any) => {
    state.loading = false
    state.list = data.data
    state.submitData = state.queryData
  }).catch(() => {
    state.loading = false
    state.queryData.filter = JSON.parse(state.queryData.filter)
  })
}

//判断用户评分分数合格还是不合格
const isPass = (score:number)=>{
  if(score >= 5000){
    return '合格'
  }else if(score <= -5000){
    return '不合格'
  }else{
    return score
  }
}

const formatParentNames = (names: string | undefined) => {
  if (!names) return []
  return names
    .split(/[,，、\s]/)
    .map(item => item.trim())
    .filter(Boolean)
}


const onAudit = (row:any)=>{
  auditDialogRef.value.openDialog(row)
}

const onSettle = (row:any)=>{
  ElMessageBox.confirm('是否确认结算？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(()=>{
    state.loading = true
    deleteTeacherTask({
      taskId: row.id
    }).then(()=>{
      ElMessage.success('结算成功')
      getListData()
    }).catch(()=>{
      state.loading = false
    })
  }).catch(()=>{})
}

const handleSizeChange = () => {
  getListData()
}

const handleCurrentChange = () => {
  getListData()
}

// 页面加载时
onMounted(() => {
  getListData()
  getListTeacher()
})

</script>

<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  font-size: 12px;
}

.list {
  width: 400px;
  height: 100%;
  display: flex;
  align-items: center;

  .img {
    width: 120px;
    height: 100%;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100px;
      height: 110px;
    }
  }

  .text {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 18px;
    padding: 10px;
    box-sizing: border-box;

    .name {
      width: 100%;
      height: 18px;
      overflow: hidden;
    }
  }
}

.parent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.parent-tag {
  background-color: #edf5ff;
  color: #1f71ff;
  border-color: transparent;
}
</style>
