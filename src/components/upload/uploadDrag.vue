<template>
  <div class="upload-wrap" :class="{ maxHidden: isMaxHidden }">
    <draggable class="draggable-wrap" v-model="imgList" @start="drag = true" @end="drag = false" item-key="index">
      <template #item="{ element, index }">
        <div class="draggable-item" :style="{ width: width + 'px', height: height + 'px' }">
          <el-image :src="element" :preview-src-list="[element]" />
          <div class="shadow" @click="onRemoveHandler(index)">
            <SvgIcon name="ele-Delete" />
          </div>
        </div>
      </template>
    </draggable>
    <el-upload class="upload-box" :headers="headers" action="/v1/cp/upload/" :style="{ width: width + 'px', height: height + 'px' }" accept=".jpg,.jpeg,.png,.gif" :show-file-list="false" :multiple="true" :limit="limit" :on-success="handleSuccess" :before-upload="beforeUpload">
      <div class="plus" :style="{ width: width + 'px', height: height + 'px' }">
        <SvgIcon name="ele-Plus" />
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import draggable from 'vuedraggable'
import type { UploadProps } from 'element-plus'
import { Session } from '@/utils/storage'
import md5 from 'js-md5'
import { v4 as uuidv4 } from 'uuid'
import { webSalt } from '@/config'
import { validImgUpload, toStorage } from '@/utils/toolsValidate'
const props = defineProps({
  // 图片数据(图片url组成的数组) 通过v-model传递
  modelValue: {
    type: Array as any,
    default: Array,
  },
  // 限制上传的图片数量
  limit: {
    type: Number,
    default: 99,
  },
  // 限制上传图片的文件大小(kb)
  size: {
    type: Number,
    default: 1024,
  },
  // 图片显示的宽度(px)
  width: {
    type: Number,
    default: 150,
  },
  // 图片显示的高度(px)
  height: {
    type: Number,
    default: 150,
  },
})

const uid = Session.getString('uid') || ''
const token = Session.getString('token') || ''

const state = reactive({
  drag: false,
  headers: {},
})

const { drag, headers } = toRefs(state)

const emit = defineEmits(['update:modelValue'])

const imgList: any = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emit('update:modelValue', val)
  },
})

const isMaxHidden = computed(() => {
  return imgList.value.length >= props.limit
})

const handleSuccess: UploadProps['onSuccess'] = (response) => {
  if (response.code === 200) {
    imgList.value.push(response.url)
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

function onRemoveHandler(index: Number) {
  ElMessageBox.confirm('确定删除该图片?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      imgList.value.splice(index, 1)
    })
    .catch(() => { })
}
</script>
<style lang="scss" scoped>
.upload-wrap {
  width: 100%;
  overflow: hidden;

  .draggable-wrap {
    .draggable-item {
      float: left;
      border: 1px solid #ebeff5;
      margin-bottom: 10px;
      margin-right: 10px;
      position: relative;
      overflow: hidden;

      .el-image {
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
  }

  .upload-box {
    float: left;
    border: 1px solid #ebeff5;
    cursor: pointer;

    .plus {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &.maxHidden {
    .upload-box {
      display: none;
    }
  }
}
</style>
