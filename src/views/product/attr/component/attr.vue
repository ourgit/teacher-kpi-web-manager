<template>
  <div class="section-wrap">
    <div v-for="(item,attrIndex) in attrList" :key="attrIndex" class="section-item">
      <div class="name">
        {{item.name}}
        <el-icon style="margin-left: 10px;" color="#F56C6C" @click="onDelAttr(attrIndex)">
          <ele-Delete />
        </el-icon>
      </div>
      <div class="list">
        <draggable v-model="item.list" @start="drag = true" @end="drag = false" item-key="index">
          <template #item="{ element, index }">
            <el-tag class="item" size="large" closable @close="onDelAttrValue(attrIndex,index)">{{element}}</el-tag>
          </template>
        </draggable>
        <el-input v-model="item.newAttrValue" placeholder="规格值" class="input100" style="margin-right: 5px;" />
        <el-button size="default" type="primary" @click="onAddSingleAttr(attrIndex)">
          确定
        </el-button>
      </div>
    </div>
    <div class="add-wrap">
      <el-button v-if="!isAddAttr" size="default" type="primary" @click="isAddAttr=true">
        <el-icon>
          <ele-Plus />
        </el-icon>
        新增新规格
      </el-button>
      <div v-else class="add-form">
        <el-form-item label="规格名称">
          <el-input v-model="newAttrName" placeholder="规格名称" class="input100"></el-input>
        </el-form-item>
        <el-form-item label="规格值">
          <el-input v-model="newAttrList" placeholder="规格值,多个规格用“|”隔开"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onAddAttr">新增</el-button>
          <el-button @click="isAddAttr=false">取消</el-button>
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, computed } from 'vue'
import draggable from 'vuedraggable'
import { ElMessage } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: Array as any,
    default: Array,
  },
})

const emit = defineEmits(['update:modelValue'])

const attrList: any = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emit('update:modelValue', val)
  },
})

// 定义变量内容
const state = reactive({
  drag: false,
  isAddAttr: false, //是否新增规格
  newAttrName: '',
  newAttrList: '',
})

const { drag, isAddAttr, newAttrName, newAttrList } = toRefs(state)

// 新增规格
const onAddAttr = () => {
  if (!state.newAttrName) {
    return ElMessage({
      message: '请输入规格名称',
      type: 'error',
    })
  }
  const isExist = attrList.value.findIndex((item: any) => {
    return item.name === state.newAttrName
  })
  if (isExist !== -1) {
    return ElMessage({
      message: '规格名称已存在',
      type: 'error',
    })
  }
  if (!state.newAttrList) {
    return ElMessage({
      message: '请输入规格值',
      type: 'error',
    })
  }
  attrList.value.push({
    name: state.newAttrName,
    list: state.newAttrList.split('|'),
  })
  state.newAttrName = ''
  state.newAttrList = ''
  state.isAddAttr = false
}

// 删除规格
const onDelAttr = (index: number) => {
  attrList.value.splice(index, 1)
}

// 删除规格值
const onDelAttrValue = (attrIndex: number, index: number) => {
  attrList.value[attrIndex].list.splice(index, 1)
}

// 新增单项规格
const onAddSingleAttr = (index: number) => {
  const newAttrValue = attrList.value[index].newAttrValue
  if (!newAttrValue) {
    return ElMessage({
      message: '请输入规格值',
      type: 'error',
    })
  }
  const isExist = attrList.value[index].list.findIndex((item: any) => {
    return item === newAttrValue
  })
  if (isExist !== -1) {
    return ElMessage({
      message: '规格值已存在',
      type: 'error',
    })
  }
  attrList.value[index].list.push(newAttrValue)
  attrList.value[index].newAttrValue = ''
}
</script>
<style lang="scss" scoped>
.section-wrap {
  width: 100%;
  .section-item {
    margin-bottom: 10px;
    .name {
      display: flex;
      align-items: center;
    }
    .list {
      margin-top: 5px;
      display: flex;
      flex-wrap: wrap;
      .item {
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }

  .add-wrap {
    .add-form {
      display: flex;
    }
  }
}
</style>
