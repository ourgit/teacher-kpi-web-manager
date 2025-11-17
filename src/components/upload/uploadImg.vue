<template>
  <el-upload class="upload-box" action="/v1/cp/upload/" :headers="headers" :style="{ width: width + 'px', height: height + 'px' }" accept=".jpg,.jpeg,.png,.gif" :show-file-list="false" :multiple="false" :on-success="handleSuccess" :before-upload="beforeUpload">
    <div v-if="imageUrl" class="image-box" :style="{ width: width + 'px', height: height + 'px' }">
      <img :src="imageUrl" class="image" />
      <div class="shadow" @click.stop="onRemoveHandler">
        <SvgIcon name="ele-Delete" />
      </div>
    </div>
    <div v-else class="plus" :style="{ width: width + 'px', height: height + 'px' }">
      <SvgIcon name="ele-Plus" />
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { Session } from '@/utils/storage'
import md5 from 'js-md5'
import { v4 as uuidv4 } from 'uuid'
import { webSalt } from '@/config'
import { validImgUpload, toStorage } from '@/utils/toolsValidate'
const props = defineProps({
  // 图片数据通过v-model传递
  modelValue: {
    type: String,
    default: '',
  },
  // 限制上传图片的文件大小(kb)
  size: {
    type: Number,
    default: 1024,
  },
  // 图片显示的宽度(px)
  width: {
    type: Number,
    default: 100,
  },
  // 图片显示的高度(px)
  height: {
    type: Number,
    default: 100,
  },
})

const emit = defineEmits(['update:modelValue'])

const uid = Session.getString('uid') || ''
const token = Session.getString('token') || ''

const state = reactive({
  headers: {},
})

const { headers } = toRefs(state)

const imageUrl = computed(() => {
  return props.modelValue
})

const handleSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    emit('update:modelValue', response.url)
  } else {
    ElMessage({
      message: response.reason,
      type: 'error',
    })
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (validImgUpload(rawFile, props.size)) {
    const t = Number(new Date(Date.parse(new Date().toString()))) / 100
    const nonce = uuidv4()
    const s = md5(token + md5(token + webSalt + t + nonce))
    state.headers = {
      'X-Requested-With': '*',
      'Csrf-Token': 'nocheck',
      'X-AUTH-ADMIN-TOKEN': uid,
      t: t,
      nonce: nonce,
      s: s,
    }
    return true
  } else {
    ElMessage({
      message: '上传图片大小不能超过' + toStorage(props.size * 1024),
      type: 'error',
    })
    return false
  }
}

function onRemoveHandler() {
  ElMessageBox.confirm('确定删除该图片?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      emit('update:modelValue', '')
    })
    .catch(() => { })
}
</script>
<style lang="scss" scoped>
.upload-box {
  border: 1px solid #ebeff5;
  cursor: pointer;

  .image-box {
    position: relative;

    .image {
      width: 100%;
      height: 100%;
    }

    .shadow {
      position: absolute;
      top: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      color: #fff;
      font-size: 20px;
      line-height: 20px;
      cursor: pointer;
    }

    &:hover {
      .shadow {
        opacity: 1;
      }
    }
  }

  .plus {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
