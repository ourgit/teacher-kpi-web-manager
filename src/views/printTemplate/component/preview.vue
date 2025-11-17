<template>
  <el-dialog title="打印预览" v-model="isShowDialog" :width="width + 'mm'" :close-on-click-modal="false" :destroy-on-close="true">
    <div id="preview_content"></div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="default">取 消</el-button>
        <el-button type="primary" @click="onPrint" size="default" :loading="waitShowPrinter">打印</el-button>
        <el-button type="primary" @click="toPdf" size="default" :loading="waitShowPrinter">生成PDF</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'

const state = reactive({
  waitShowPrinter: false,
  // 纸张宽 mm
  width: '',
  // 模板
  hiprintTemplate: {} as any,
  // 数据
  printData: {},
  isShowDialog: false
})

const { waitShowPrinter, width, isShowDialog } = toRefs(state)

// 打开弹窗
const openDialog = (hiprintTemplate: any, printData: any, width = '210') => {
  state.isShowDialog = true
  state.width = width
  state.hiprintTemplate = hiprintTemplate
  state.printData = printData
  setTimeout(() => {
    $('#preview_content').html(hiprintTemplate.getHtml(printData))
  }, 500)
}

// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false
}
// 取消
const onCancel = () => {
  closeDialog()
}

const onPrint = () => {
  state.waitShowPrinter = true
  state.hiprintTemplate.print(state.printData, {}, {
    callback: () => {
      state.waitShowPrinter = false
    }
  })
}

const toPdf = () => {
  console.log(state.hiprintTemplate)
  state.hiprintTemplate.toPdf(state.printData, '打印预览pdf');
}

// 暴露变量
defineExpose({
  openDialog,
});
</script>
