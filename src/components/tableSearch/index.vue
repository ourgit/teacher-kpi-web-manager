<template>
  <div class="table-search-container" v-if="props.search.length > 0">
    <el-form ref="tableSearchRef" :model="state.form" size="default" label-width="100px" class="table-form">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20" v-for="(val, key) in search" :key="key" v-show="key === 0 || state.isToggle">
          <template v-if="val.type !== ''">
            <el-form-item :label="val.label" :prop="val.prop" :rules="[{ required: val.required, message: `${val.label}${state.name}`, trigger: val.type === 'input' ? 'blur' : 'change' }]">
              <el-input v-model="state.form[val.prop]" :placeholder="val.placeholder" clearable v-if="val.type === 'input'" style="width: 100%" />
              <el-date-picker v-model="state.form[val.prop]" type="date" :placeholder="val.placeholder" clearable v-else-if="val.type === 'date'" style="width: 100%" />
              <el-date-picker v-model="state.form[val.prop]" type="daterange" :start-placeholder="val.startPlaceholder" :end-placeholder="val.endPlaceholder" clearable v-else-if="val.type === 'daterange'" style="width: 100%" value-format="x" :disabled-date="disabledDate" />
              <el-select v-model="state.form[val.prop]" :placeholder="val.placeholder" clearable v-else-if="val.type === 'select'" style="width: 100%">
                <el-option v-for="item in val.options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
              <el-select v-model="state.form[val.prop]" :placeholder="val.placeholder" clearable v-else-if="val.type === 'selectItem'" style="width: 100%">
                <el-option v-for="(item, index) in val.options" :key="index" :label="item" :value="item"> </el-option>
              </el-select>
              <el-cascader :options="val.options" v-model="state.form[val.prop]" clearable style="width: 100%" v-else-if="val.type === 'cascader'">
              </el-cascader>
            </el-form-item>
          </template>
        </el-col>
        <el-col :xs="24" :sm="12" :md="10" :lg="8" :xl="6" class="mb20">
          <el-form-item class="table-form-btn" :label-width="search.length <= 1 ? '10px' : '100px'">
            <template #label v-if="search.length > 1">
              <div class="table-form-btn-toggle ml10" @click="state.isToggle = !state.isToggle">
                <span>{{ state.isToggle ? '收筛选' : '展筛选' }}</span>
                <SvgIcon :name="state.isToggle ? 'ele-ArrowUp' : 'ele-ArrowDown'" />
              </div>
            </template>
            <div>
              <el-button size="default" type="primary" @click="onSearch(tableSearchRef)">
                <el-icon>
                  <ele-Search />
                </el-icon>
                查询
              </el-button>
              <el-button size="default" class="ml10" v-if="isReset" @click="onReset(tableSearchRef)">
                <el-icon>
                  <ele-Refresh />
                </el-icon>
                重置
              </el-button>
              <el-button size="default" v-if="isExport" :loading="exportLoading" type="primary" class="ml10" @click="exportFile">
                <el-icon>
                  <ele-Download />
                </el-icon>
                导出
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRefs } from 'vue';
import type { FormInstance } from 'element-plus';

// 定义父组件传过来的值
const props = defineProps({
  // 搜索表单
  search: {
    type: Array as any,
    default: () => [],
  },
  isExport: {
    type: Boolean,
    default: false
  },
  isReset: {
    type: Boolean,
    default: true
  }
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['search', 'refresh', 'exportFile']);

// 定义变量内容
const tableSearchRef = ref<FormInstance>();
const state = reactive({
  form: {} as any,
  isToggle: false,
  name: '不能为空',
  exportLoading: false,
});
const { exportLoading } = toRefs(state);

// 查询
const onSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      emit('search', state.form);
    } else {
      return false;
    }
  });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  emit('refresh', state.form);
};
// 初始化 form 字段，取自父组件 search.prop
const initFormField = () => {
  if (props.search.length <= 0) return false;
  props.search.forEach((v: any) => (state.form[v.prop] = v.default || ''));
};
// 禁用时间
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
// 导出
const exportFile = () => {
  state.exportLoading = true
  emit('exportFile')
  setTimeout(() => {
    state.exportLoading = false
  }, 1000)
}
// 页面加载时
onMounted(() => {
  initFormField();
});
// 暴露变量
defineExpose({
  initFormField,
});
</script>

<style scoped lang="scss">
.table-search-container {
  display: flex;

  .table-form {
    flex: 1;

    .table-form-btn-toggle {
      white-space: nowrap;
      user-select: none;
      display: flex;
      align-items: center;
      color: var(--el-color-primary);
    }
  }
}
</style>
