<template>
  <div class="editor-wrap">
    <Toolbar style="border-bottom: 1px solid #ebeff5" :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
    <Editor style="height: 400px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, computed, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { Session } from '@/utils/storage'
import md5 from 'js-md5'
import { v4 as uuidv4 } from 'uuid'
import { webSalt } from '@/config'
import axios from 'axios'
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const editorRef = shallowRef()

const toolbarConfig = {
  excludeKeys: [
    'bulletedList',
    'fontFamily',
    'code',
    'group-more-style',
    'underline',
    'through',
    'sub',
    'sup',
    'numberedList',
    'codeBlock',
    'todo',
    'redo',
    'undo',
    '|',
  ],
}
const uploadImage = {
  timeout: 5 * 1000, // 5s
  fieldName: 'custom-fileName',
  maxFileSize: 5 * 1024 * 1024, // 10M
  maxNumberOfFiles: 1,
  base64LimitSize: 5 * 1024, // 5kb 以下插入 base64
  onBeforeUpload(files: any) {
    return files // 返回哪些文件可以上传
  },
  onProgress(progress: any) {
    console.log('onProgress', progress)
  },
  onSuccess(file: any, res: any) {
    console.log('onSuccess', file, res)
  },
  onFailed(file: any, res: any) {
    console.log('onFailed', file, res)
  },
  onError(file: any, err: any, res: any) {
    console.error('onError', file, err, res)
  },
  customUpload(file: any, insertFn: any) {
    const uid = Session.getString('uid') || ''
    const token = Session.getString('token') || ''
    const t = Number(new Date(Date.parse(new Date().toString()))) / 100
    const nonce = uuidv4()
    const s = md5(token + md5(token + webSalt + t + nonce))
    const data = new FormData()
    data.append('file', file) // file 即选中的文件
    const config = {
      method: 'post',
      url: '/v1/cp/upload/', // 上传图片地址
      data,
      headers: {
        'X-Requested-With': '*',
        'Csrf-Token': 'nocheck',
        'X-AUTH-TOKEN-UID': uid,
        t: t,
        nonce: nonce,
        s: s,
      },
    }
    axios(config)
      .then((res: any) => {
        const resData = res.data
        if (resData.code === 200) {
          insertFn(resData.url, '', resData.url) // 插入图片
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  },
}

const uploadVideo = {
  timeout: 5 * 1000, // 5s
  fieldName: 'custom-uploadVideo',
  maxFileSize: 10 * 1024 * 1024, // 10M
  maxNumberOfFiles: 1,
  onBeforeUpload(files: any) {
    return files // 返回哪些文件可以上传
  },
  onProgress(progress: any) {
    console.log('onProgress', progress)
  },
  onSuccess(file: any, res: any) {
    console.log('onSuccess', file, res)
  },
  onFailed(file: any, res: any) {
    console.log('onFailed', file, res)
  },
  onError(file: any, err: any, res: any) {
    console.error('onError', file, err, res)
  },
  customUpload(file: any, insertFn: any) {
    const uid = Session.getString('uid') || ''
    const token = Session.getString('token') || ''
    const t = Number(new Date(Date.parse(new Date().toString()))) / 100
    const nonce = uuidv4()
    const s = md5(token + md5(token + webSalt + t + nonce))
    const data = new FormData()
    data.append('file', file) // file 即选中的文件
    const config = {
      method: 'post',
      url: '/v1/cp/upload/', // 上传地址
      data,
      headers: {
        'X-Requested-With': '*',
        'Csrf-Token': 'nocheck',
        'X-AUTH-TOKEN-UID': uid,
        t: t,
        nonce: nonce,
        s: s,
      },
    }
    axios(config)
      .then((res: any) => {
        const resData = res.data
        if (resData.code === 200) {
          insertFn(resData.url, '') // 插入视频
        }
      })
      .catch((error: any) => {
        console.log(error)
      })
  },
}

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: { uploadImage, uploadVideo },
}

const emit = defineEmits(['update:modelValue'])

const valueHtml: any = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    const str = val.replace(/\bm.*?;/, 'max-width:100%') // 更改插入到富文本里图片的宽度
    emit('update:modelValue', str)
  },
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  editorRef.value = editor
}
</script>
<style lang="scss" scoped>
.editor-wrap {
  width: 100%;
  border: 1px solid #ebeff5;
  z-index: 1001;
}
</style>
