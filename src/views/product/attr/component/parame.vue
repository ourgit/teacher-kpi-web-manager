<template>
  <div class="section-wrap">
    <div v-for="(item,parameIndex) in parameList" :key="parameIndex" class="section-item">
      <div class="name">
        {{item.name}}({{ item.type === 'text' ? '输入' : '选择' }})
        <el-icon style="margin-left: 10px;" color="#F56C6C" @click="onDelParame(parameIndex)">
          <ele-Delete />
        </el-icon>
      </div>
      <div class="list">
        <template v-if="item.type === 'select'">
          <draggable v-model="item.list" @start="drag = true" @end="drag = false" item-key="index">
            <template #item="{ element, index }">
              <el-tag class="item" size="large" closable @close="onDelParameValue(parameIndex,index)">{{element}}</el-tag>
            </template>
          </draggable>
          <el-input v-model="item.newParameValue" placeholder="参数值" class="input100" style="margin-right: 5px;" />
          <el-button size="default" type="primary" @click="onAddSingleParame(parameIndex)">
            确定
          </el-button>
        </template>
        <el-input v-else v-model="item.list" placeholder="参数值" class="input200" />
      </div>
    </div>
    <div class="add-wrap">
      <el-button v-if="!isAddParame" size="default" type="primary" @click="isAddParame=true">
        <el-icon>
          <ele-Plus />
        </el-icon>
        新增新参数
      </el-button>
      <div v-else class="add-form">
        <el-form-item label="参数名称">
          <el-input v-model="newParameName" placeholder="参数名称" class="input100"></el-input>
        </el-form-item>
        <el-form-item label="参数类型">
          <el-radio-group v-model="newParameType">
            <el-radio-button label="text">输入</el-radio-button>
            <el-radio-button label="select">选择</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数值">
          <el-input v-model="newParameList" placeholder="参数值,多个参数用“|”隔开"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="onAddParame">新增</el-button>
          <el-button @click="isAddParame=false">取消</el-button>
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

const parameList: any = computed({
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
  isAddParame: false, //是否新增参数
  newParameName: '',
  newParameType: 'text',
  newParameList: '',
})

const { drag, isAddParame, newParameName, newParameType, newParameList } =
  toRefs(state)

// 新增参数
const onAddParame = () => {
  if (!state.newParameName) {
    return ElMessage({
      message: '请输入参数名称',
      type: 'error',
    })
  }
  const isExist = parameList.value.findIndex((item: any) => {
    return item.name === state.newParameName
  })
  if (isExist !== -1) {
    return ElMessage({
      message: '参数名称已存在',
      type: 'error',
    })
  }
  parameList.value.push({
    name: state.newParameName,
    type: state.newParameType,
    list:
      state.newParameType === 'select'
        ? state.newParameList.split('|')
        : state.newParameList,
  })
  state.newParameName = ''
  state.newParameList = ''
  state.isAddParame = false
}

// 删除参数
const onDelParame = (index: number) => {
  parameList.value.splice(index, 1)
}

// 删除参数值
const onDelParameValue = (parameIndex: number, index: number) => {
  parameList.value[parameIndex].list.splice(index, 1)
}

// 新增单项参数
const onAddSingleParame = (index: number) => {
  const newParameValue = parameList.value[index].newParameValue
  if (!newParameValue) {
    return ElMessage({
      message: '请输入参数值',
      type: 'error',
    })
  }
  const isExist = parameList.value[index].list.findIndex((item: any) => {
    return item === newParameValue
  })
  if (isExist !== -1) {
    return ElMessage({
      message: '参数值已存在',
      type: 'error',
    })
  }
  parameList.value[index].list.push(newParameValue)
  parameList.value[index].newParameValue = ''
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
