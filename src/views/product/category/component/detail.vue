<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="所属商家" prop="orgId">
              <el-select v-model="ruleForm.orgId" placeholder="选择商家" @change="onChangeOrg" clearable filterable>
                <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="父类ID" name="parentId">
              <el-cascader v-model="selectCateValue" :options="cateList" :props="{ checkStrictly: true, value: 'id', label: 'name' }" style="width: 100%!important;" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入分类名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="选中图标" prop="poster">
              <upload-img v-model="ruleForm.poster" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="未选中图标" prop="imgUrl">
              <upload-img v-model="ruleForm.imgUrl" :width="80" :height="80" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="排列序号" prop="sort">
              <el-input v-model="ruleForm.sort" placeholder="请输入排列序号，值越大越靠前" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="分类状态">
              <el-switch v-model="ruleForm.show" inline-prompt :active-value="1" :inactive-value="2" active-text="启" inactive-text="禁"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="default" :loading="loading">{{ dialog.submitTxt }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue'
import { ElForm } from 'element-plus'
import {
  getCategroyList,
  getCategroyDetail,
  addCategroy,
  updateCategroy,
} from '@/api/product/category/index'
import { getOrganList } from '@/api/organ/index'
import UploadImg from '@/components/upload/uploadImg.vue'


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    orgId: [{ required: true, trigger: 'blur', message: '请选择商家' }],
    name: [{ required: true, trigger: 'blur', message: '请填写分类名称' }],
    sort: [{ required: true, trigger: 'blur', message: '请填写排列序号' }],
  },
  cateList: [] as any,
  selectCateValue: [] as any,
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  orgList: [] as any,
})

const { loading, ruleForm, rules, cateList, selectCateValue, dialog, orgList } =
  toRefs(state)

watch(selectCateValue, (newValue: any) => {
  state.ruleForm.parentId = newValue[newValue.length - 1]
})

// 获取商家列表
const getOrganListData = () => {
  getOrganList({
    page: 0,
  }).then((data: any) => {
    state.orgList = data.list
  })
}


// 打开弹窗
const openDialog = (type: string, row: any) => {
  state.dialog.type = type
  state.dialog.isShowDialog = true
  if (type === 'edit') {
    state.dialog.title = '修改分类'
    state.dialog.submitTxt = '修 改'
  } else {
    state.dialog.title = '新增分类'
    state.dialog.submitTxt = '新 增'
  }
  getOrganListData()
  if (type === 'edit') {
    getCategroyDetail({
      id: row.id,
    }).then((res) => {
      getCategoryListData(res.orgId)
      state.ruleForm = {
        id: row.id,
        parentId: res.parentId,
        name: res.name,
        poster: res.poster,
        imgUrl: res.imgUrl,
        show: res.show,
        sort: res.sort,
        exclude: res.exclude,
        discountJson: [],
        staffAwardRatio: res.staffAwardRatio
      }
      const pathArray = res.path.split('/')
      const arr = [] as any
      pathArray.map((val: any) => {
        if (val !== '' && val !== undefined) {
          arr.push(parseInt(val))
        }
      })
      if (arr.length === 0) {
        state.selectCateValue = [0]
      } else {
        state.selectCateValue = arr
      }
    })
  } else {
    state.ruleForm = {
      parentId: '',
      name: '',
      poster: '',
      imgUrl: '',
      show: 1,
      sort: 1,
      exclude: false,
      discountJson: [],
      staffAwardRatio: ''
    }
    state.selectCateValue = []
  }
}

const onChangeOrg = (e: any) => {
  getCategoryListData(e)
  state.ruleForm.parentId = ''
  state.selectCateValue = []
}

// 获取分类列表
const getCategoryListData = (e: any) => {
  getCategroyList({
    orgId: e
  }).then((res: any) => {
    state.cateList = [{ name: '作为顶级分类', id: 0 }]
    res.list.forEach((item: any) => {
      state.cateList.push({
        id: item.id,
        name: item.name,
        children: item.children,
      })
    })
  })
}

// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.discountJson = JSON.stringify(ruleForm.discountJson)
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addCategroy(ruleForm)
          .then((res) => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updateCategroy(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      }
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
