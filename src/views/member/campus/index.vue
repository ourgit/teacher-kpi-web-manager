<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <template #header>
        <div class="card-header">
          <span>校区管理</span>
        </div>
      </template>
      <el-form :inline="true" :model="queryForm" class="query-form">
        <el-form-item label="学校名称">
          <el-input v-model="queryForm.campusName" placeholder="请输入学校名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 200px">
            <el-option label="全部" :value="null" />
            <el-option label="正常运营" :value="1" />
            <el-option label="暂停运营" :value="2" />
            <el-option label="已关闭" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getListData">
            <el-icon><ele-Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><ele-RefreshRight /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="openDialog()">
            <el-icon><ele-Plus /></el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="filteredList" v-loading="loading" border style="width: 100%">
        <el-table-column prop="campusName" label="学校名称" show-overflow-tooltip />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="principal" label="负责人" width="120" />
        <el-table-column prop="capacity" label="容量(人)" width="110" />
        <el-table-column prop="establishDate" label="成立日期" width="150">
          <template #default="{ row }">
            {{ formatDate(row.establishDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">
              {{ formatStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="更新时间" width="170" show-overflow-tooltip />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="110px">
        <el-form-item label="学校名称" prop="campusName">
          <el-input v-model="formData.campusName" placeholder="请输入学校名称" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="负责人" prop="principal">
          <el-input v-model="formData.principal" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-form-item label="容量(人)" prop="capacity">
          <el-input-number v-model="formData.capacity" :min="0" :step="50" controls-position="right" style="width: 100%" />
        </el-form-item>
        <el-form-item label="成立日期" prop="establishDate">
          <el-date-picker
            v-model="formData.establishDate"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常运营</el-radio>
            <el-radio :label="2">暂停运营</el-radio>
            <el-radio :label="3">已关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="dialogSubmitting">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, toRefs, nextTick } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { getCampusList, addCampus, updateCampus, deleteCampus } from '@/api/member/index'

interface CampusItem {
  id?: number
  campusName: string
  address: string
  phone: string
  principal: string
  capacity: number | null
  establishDate: string
  status: number
  createTime?: string
  updateTime?: string
}

const state = reactive({
  list: [] as CampusItem[],
  loading: false,
  dialogVisible: false,
  dialogSubmitting: false,
  dialogTitle: '新增校区',
  queryForm: {
    campusName: '',
    status: null as number | null,
  },
  formData: initFormData(),
})

const formRef = ref<FormInstance>()

function initFormData(): CampusItem {
  return {
    campusName: '',
    address: '',
    phone: '',
    principal: '',
    capacity: null,
    establishDate: '',
    status: 1,
  }
}

const rules: FormRules = {
  campusName: [{ required: true, message: '请输入学校名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  principal: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入容量', trigger: 'blur' }],
  establishDate: [{ required: true, message: '请选择成立日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const { list, loading, dialogVisible, dialogSubmitting, dialogTitle, queryForm, formData } = toRefs(state)

const filteredList = computed(() => {
  return state.list.filter((item) => {
    const matchName = queryForm.value.campusName
      ? item.campusName?.toLowerCase().includes(queryForm.value.campusName.toLowerCase())
      : true
    const matchStatus =
      queryForm.value.status !== null && queryForm.value.status !== undefined
        ? item.status === queryForm.value.status
        : true
    return matchName && matchStatus
  })
})

function getListData() {
  state.loading = true
  getCampusList()
    .then((res: any) => {
      state.list = res.list || res.data || []
    })
    .finally(() => {
      state.loading = false
    })
}

function handleReset() {
  state.queryForm.campusName = ''
  state.queryForm.status = null
  getListData()
}

function openDialog(row?: CampusItem) {
  if (row) {
    state.dialogTitle = '编辑校区'
    state.formData = {
      id: row.id,
      campusName: row.campusName,
      address: row.address,
      phone: row.phone,
      principal: row.principal,
      capacity: row.capacity,
      establishDate: row.establishDate,
      status: row.status,
    }
  } else {
    state.dialogTitle = '新增校区'
    state.formData = initFormData()
  }
  state.dialogVisible = true
  nextTick(() => formRef.value?.clearValidate())
}

function handleSave() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      state.dialogSubmitting = true
      const api = state.formData.id ? updateCampus : addCampus
      await api(state.formData)
      ElMessage.success(state.formData.id ? '更新成功' : '新增成功')
      state.dialogVisible = false
      getListData()
    } catch (error) {
      // 已由拦截器处理
    } finally {
      state.dialogSubmitting = false
    }
  })
}

function handleDelete(row: CampusItem) {
  ElMessageBox.confirm(`确认删除【${row.campusName}】吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      await deleteCampus({ id: row.id })
      ElMessage.success('删除成功')
      getListData()
    })
    .catch(() => {})
}

function formatStatus(status: number) {
  if (status === 1) return '正常运营'
  if (status === 2) return '暂停运营'
  if (status === 3) return '已关闭'
  return '未知'
}

function statusTagType(status: number) {
  if (status === 1) return 'success'
  if (status === 2) return 'warning'
  if (status === 3) return 'info'
  return 'default'
}

function formatDate(date: string) {
  if (!date) return '--'
  return date.split('T')[0]
}

onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss">
.query-form {
  margin-bottom: 15px;
}
.card-header {
  font-weight: 600;
  font-size: 16px;
}
.dialog-footer {
  text-align: right;
}
</style>

