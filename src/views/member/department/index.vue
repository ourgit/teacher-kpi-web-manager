<template>
  <div class="page-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
        </div>
      </template>
      <el-form :inline="true" :model="queryForm" class="query-form">
        <el-form-item label="部门名称">
          <el-input v-model="queryForm.departmentName" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="部门编码">
          <el-input v-model="queryForm.departmentCode" placeholder="请输入部门编码" clearable />
        </el-form-item>
        <el-form-item label="所属校区">
          <el-select v-model="queryForm.campusId" placeholder="请选择校区" clearable filterable style="width: 220px">
            <el-option
              v-for="item in campusOptions"
              :key="item.id"
              :label="item.campusName"
              :value="item.id"
            />
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
      <el-table :data="list" v-loading="loading" border style="width: 100%">
        <el-table-column prop="departmentName" label="部门名称" show-overflow-tooltip />
        <el-table-column prop="departmentCode" label="部门编码" show-overflow-tooltip width="160" />
        <el-table-column prop="campus.campusName" label="所属校区" width="160" />
        <el-table-column prop="description" label="简介" show-overflow-tooltip />
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
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="formData.departmentName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="departmentCode">
          <el-input v-model="formData.departmentCode" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="所属校区" prop="campusId">
          <el-select v-model="formData.campusId" placeholder="请选择所属校区" filterable style="width: 100%">
            <el-option
              v-for="item in campusOptions"
              :key="item.id"
              :label="item.campusName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门简介" prop="description">
          <el-input
            v-model="formData.description"
            placeholder="请输入简介"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
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
import { reactive, ref, onMounted, toRefs, nextTick } from 'vue'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import {
  searchDepartmentList,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  getCampusList,
} from '@/api/member/index'

interface DepartmentItem {
  id?: number
  departmentName: string
  departmentCode: string
  campusId: number | null
  description: string
  campus?: { id: number; campusName: string }
  createTime?: string
  updateTime?: string
}

interface CampusItem {
  id: number
  campusName: string
}

const state = reactive({
  list: [] as DepartmentItem[],
  loading: false,
  dialogVisible: false,
  dialogSubmitting: false,
  dialogTitle: '新增部门',
  queryForm: {
    departmentName: '',
    departmentCode: '',
    campusId: undefined as number | undefined,
  },
  formData: initFormData(),
  campusOptions: [] as CampusItem[],
})

function initFormData(): DepartmentItem {
  return {
    departmentName: '',
    departmentCode: '',
    campusId: null,
    description: '',
  }
}

const formRef = ref<FormInstance>()

const rules: FormRules = {
  departmentName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  departmentCode: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  campusId: [{ required: true, message: '请选择所属校区', trigger: 'change' }],
}

const { list, loading, dialogVisible, dialogSubmitting, dialogTitle, queryForm, formData, campusOptions } =
  toRefs(state)

function getListData() {
  state.loading = true
  searchDepartmentList({
    departmentName: state.queryForm.departmentName || undefined,
    departmentCode: state.queryForm.departmentCode || undefined,
    campusId: state.queryForm.campusId || undefined,
  })
    .then((res: any) => {
      console.log(res)
      state.list = res.list || res.data || []
    })
    .finally(() => {
      state.loading = false
    })
}

function handleReset() {
  state.queryForm.departmentName = ''
  state.queryForm.departmentCode = ''
  state.queryForm.campusId = undefined
  getListData()
}

function openDialog(row?: DepartmentItem) {
  if (row) {
    state.dialogTitle = '编辑部门'
    state.formData = {
      id: row.id,
      departmentName: row.departmentName,
      departmentCode: row.departmentCode,
      campusId: row.campusId,
      description: row.description,
    }
  } else {
    state.dialogTitle = '新增部门'
    state.formData = initFormData()
  }
  state.dialogVisible = true
  nextTick(() => formRef.value?.clearValidate())
}

function loadCampusOptions() {
  getCampusList()
    .then((res: any) => {
      state.campusOptions = res.list || []
    })
    .catch(() => {
      state.campusOptions = []
    })
}

function handleSave() {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      state.dialogSubmitting = true
      const payload = { ...state.formData }
      const api = payload.id ? updateDepartment : addDepartment
      await api(payload)
      ElMessage.success(payload.id ? '更新成功' : '新增成功')
      state.dialogVisible = false
      getListData()
    } catch (error) {
      // 提示已在拦截器中处理
    } finally {
      state.dialogSubmitting = false
    }
  })
}

function handleDelete(row: DepartmentItem) {
  ElMessageBox.confirm(`确认删除【${row.departmentName}】吗？`, '提示', {
    type: 'warning',
  })
    .then(async () => {
      await deleteDepartment({ id: row.id })
      ElMessage.success('删除成功')
      getListData()
    })
    .catch(() => {})
}

function formatStatus(status: number) {
  switch (status) {
    case 1:
      return '正常运营'
    case 2:
      return '暂停运营'
    case 3:
      return '已关闭'
    default:
      return '未知'
  }
}

function statusTagType(status: number) {
  if (status === 1) return 'success'
  if (status === 2) return 'warning'
  if (status === 3) return 'info'
  return 'default'
}

onMounted(() => {
  getListData()
  loadCampusOptions()
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