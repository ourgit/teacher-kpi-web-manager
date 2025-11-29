<template>
  <div class="dialog-container">
    <el-dialog
      title="更新用户"
      v-model="isShowDialog"
      width="500px"
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
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请输入手机号码" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="ruleForm.userName" placeholder="请输入用户姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="职业名称" prop="typeName">
              <el-input v-model="ruleForm.typeName" placeholder="请输入职业名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属部门" prop="departmentId">
              <el-select v-model="ruleForm.departmentId" placeholder="请选择所属部门" clearable>
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.departmentName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属角色" prop="roleId">
              <el-select v-model="ruleForm.roleId" placeholder="请选择所属角色" clearable>
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.nickName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="状态" prop="status">
              <el-select v-model="ruleForm.status" placeholder="请选择状态" clearable>
                <el-option label="正常" :value="1" />
                <el-option label="锁定" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { updateUser, getRoleList, getDepartmentList } from '@/api/member/index'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)

const state = reactive({
  loading: false,
  ruleForm: {
    id: 0,
    phone: '',
    userName: '',
    typeName: '',
    status: 1,
    roleId: 0,
    departmentId: 0,
  } as any,
  rules: {
    phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
    userName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
    roleId: [{ required: true, message: '请选择所属角色', trigger: 'change' }],
    departmentId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  },
  roleList: [] as any,
  departmentList: [] as any,
  isShowDialog: false,
})

const { loading, ruleForm, rules, isShowDialog, roleList, departmentList } = toRefs(state)

const loadRoleList = () => {
  getRoleList({})
    .then((res: any) => {
      state.roleList = res.list || []
    })
    .catch(() => {})
}

const loadDepartmentList = () => {
  getDepartmentList({})
    .then((res: any) => {
      state.departmentList = res.list || []
    })
    .catch(() => {})
}

// 打开弹窗
const openDialog = (row: any) => {
  state.isShowDialog = true
  loadRoleList()
  loadDepartmentList()
  state.ruleForm = {
    id: row.id,
    phone: row.phone,
    userName: row.userName,
    typeName: row.typeName,
    status: row.status,
    roleId: row.roleId || row.role?.id || 0,
    departmentId: row.departmentId || row.department?.id || 0,
  }
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
    if (!valid) return
    state.loading = true
    const payload = {
      id: ruleForm.value.id,
      userName: ruleForm.value.userName,
      phone: ruleForm.value.phone,
      typeName: ruleForm.value.typeName,
      status: ruleForm.value.status,
      roleId: ruleForm.value.roleId,
      departmentId: ruleForm.value.departmentId,
    }
    updateUser(payload)
      .then(() => {
        ElMessage({
          message: '更新成功',
          type: 'success',
        })
        state.loading = false
        closeDialog()
        emit('refresh')
      })
      .catch(() => {
        state.loading = false
      })
  })
}

// 暴露变量
defineExpose({
  openDialog,
})
</script>