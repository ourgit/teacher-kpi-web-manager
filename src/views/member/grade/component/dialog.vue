<template>
  <div class="dialog-container">
    <el-dialog :title="dialog.title" v-model="dialog.isShowDialog" width="500px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="dialogFormRef" :model="ruleForm" :rules="rules" size="default" label-width="120px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="会员等级" prop="level">
              <el-input v-model="ruleForm.level" placeholder="请输入会员等级" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="解锁金额" prop="needScore">
              <el-input v-model="ruleForm.needScore" placeholder="请输入解锁金额" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="等级昵称" prop="levelName">
              <el-input v-model="ruleForm.levelName" placeholder="请输入等级昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="员工奖励点数" prop="awardRatio">
              <el-space>
                <el-input v-model="ruleForm.awardRatio" placeholder="员工奖励点数" clearable></el-input>%
              </el-space>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="会员简介" prop="sketch">
              <el-input v-model="ruleForm.sketch" placeholder="请输入会员简介" type="textarea" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-button size="small" text type="primary" @click="onOpenCard()">绑定优惠券</el-button>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="ruleForm.couponGift">
            <el-table :data="ruleForm.couponGift" v-loading="loading" style="width: 100%">
              <el-table-column prop="couponId" label="ID" width="80" />
              <el-table-column label="数量" width="80">
                <template #default="{ row }">
                  <el-input v-model="row.count" type="number"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="couponTitle" label="名字" min-width="80" />
              <el-table-column label="操作" width="80">
                <template #default="scoped">
                  <el-button @click="delCouponList(scoped.$index)" size="small" text type="primary">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
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
    <selectDialog ref="selectDialogRef" @select="bindCoupon" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, defineAsyncComponent } from 'vue'
import { ElForm } from 'element-plus'
import { addMemberLevel, updataMemberLevel, getMemberLevel } from "@/api/member/index";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])
// 引入组件
const selectDialog = defineAsyncComponent(
  () => import('./select.vue')
)
const selectDialogRef = ref()
// 定义变量内容
const dialogFormRef = ref(ElForm)
const state = reactive({
  loading: false,
  ruleForm: {} as any,
  rules: {
    tabName: [{ required: true, trigger: 'blur', message: '请填写TAB名称' }],
    sort: [{ required: true, trigger: 'blur', message: '请填写排列序号' }],
  },
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
  id: 0,
})

const { loading, ruleForm, rules, dialog } = toRefs(state)

// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (row) {
    state.id = row.id
  }
  if (type === 'edit') {
    state.dialog.title = '修改会员等级'
    state.dialog.submitTxt = '修 改'
    getMemberLevel({
      id: row.id,
    }).then((res) => {
      state.ruleForm = {
        needScore: res.needScore / 100,
        level: res.level,
        levelName: res.levelName,
        couponGift: res.couponGift ? res.couponGift : [],
        sketch: res.sketch,
        awardRatio: res.awardRatio
      }
    })
  } else {
    state.dialog.title = '新增会员等级'
    state.dialog.submitTxt = '新 增'
    state.ruleForm = {
      needScore: '',
      level: 1,
      levelName: '',
      couponGift: [],
      sketch: '',
      awardRatio: ''
    }
  }
  state.dialog.type = type
  state.dialog.isShowDialog = true
}
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

// 删除绑定列表
const delCouponList = (index: number) => {
  state.ruleForm.couponGift.splice(index, 1)
}
// 提交
const onSubmit = () => {
  const ruleForm = JSON.parse(JSON.stringify(state.ruleForm))
  ruleForm.needScore = ruleForm.needScore * 100
  dialogFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.dialog.type === 'add') {
        addMemberLevel(ruleForm)
          .then(() => {
            state.loading = false
            closeDialog()
            emit('refresh')
          })
          .catch(() => {
            state.loading = false
          })
      } else {
        updataMemberLevel(
          {
            id: state.id,
            ...ruleForm
          }
        )
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

const bindCoupon = (val: any) => {
  val.map((item: any) => {
    state.ruleForm.couponGift.push(
      {
        couponId: item.id,
        count: item.count,
        couponTitle: item.couponTitle
      }
    )
  })
}

//打开卡券弹窗
const onOpenCard = () => {
  selectDialogRef.value.openDialog()
}
// 暴露变量
defineExpose({
  openDialog,
})
</script>

<style lang="scss" scoped></style>
