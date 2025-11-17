<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-form class="query" :inline="true">
        <el-form-item label="ID">
          <el-input v-model="queryData.id" size="default" placeholder="请输入ID" clearable/>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="queryData.phone" size="default" placeholder="请输入手机号" clearable/>
        </el-form-item>
        <el-form-item label="用户姓名">
          <el-input v-model="queryData.userName" size="default" placeholder="请输入用户姓名" clearable/>
        </el-form-item>
        <el-form-item label="职业名称">
          <el-input v-model="queryData.typeName" size="default" placeholder="请输入职业名称" clearable/>
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select v-model="queryData.roleId" size="default" placeholder="会员等级" clearable>
            <el-option label="全部" :value="0" />
            <el-option v-for="item in state.roleList" :key="item.id" :label="item.nickName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.roleId" size="default" placeholder="会员等级" clearable>
            <el-option label="全部" :value="0" />
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="2" />
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
        <el-table-column prop="teacherElementScore.score" label="该用户评分的分数" show-overflow-tooltip/>
        <el-table-column prop="element.element" label="评分要素名称" show-overflow-tooltip/>
        <el-table-column prop="userName" label="上报用户" show-overflow-tooltip/>
        <el-table-column prop="parentName" label="评分用户" show-overflow-tooltip/>
        <!-- <el-table-column label="用户角色" show-overflow-tooltip width="100">
          <template #default="{ row }">
            {{ formatUserType(row.userType) }}
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="{ row }">
            <el-form>
              <el-dropdown style="margin-left:10px">
                <el-button size="small" text type="primary">
                  更多
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="onAudit(row)">审批</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form>
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
import { getLeaderTask } from '@/api/member/index'
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
    
  } as any,
  current:1,
  submitData: {},
  roleList: [] as any,
  totalMembers: 0,
  totalBalance: 0
})

const { list, loading, currentPage, totalPage, queryData, totalMembers, totalBalance } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  if (JSON.stringify(state.queryData) !== JSON.stringify(state.submitData)) {
    state.currentPage = 1
  }
  // if(state.currentPage==1){
  //   state.current=1
  // }else{
  //   state.current=(state.currentPage-1)*10+1
  // }
  // const formData = state.queryData
  getLeaderTask({
    userId:Session.getString("uid")
  }).then((data: any) => {
    state.loading = false
    state.list = data.data
    // if (state.currentPage === 1) {
    //   state.totalPage = data.pages
    //   state.totalMembers = data.totalMembers
    //   state.totalBalance = data.totalBalance
    // }
    state.submitData = state.queryData
  }).catch(() => {
    state.loading = false
    state.queryData.filter = JSON.parse(state.queryData.filter)
  })
}


const onAudit = (row:any)=>{
  auditDialogRef.value.openDialog(row)
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
</style>
