<template>
  <div class="configure-container">
    <!--当前kpi标题-->  
  <div class="kpi-title">
    <h2>{{ state.title }}</h2>
    <el-button size="small" type="primary" @click="drawerVisible = true">搜索定位</el-button>
  </div>
    
    <!-- 三栏布局 -->
    <div class="three-column-layout">
      <!-- 左侧：指标列表 -->
      <div class="left-panel">
        <div class="panel-header">
          <h3>指标</h3>
          <div class="panel-actions">
            <el-button size="small" type="primary" @click.stop="openIndicatorDialog('add')">新增</el-button>
          </div>
        </div>
        <div class="panel-content">
          <div 
            v-for="indicator in state.list" 
            :key="indicator.id" 
            class="indicator-item"
            :class="{ 'active': state.selectedIndicator?.id === indicator.id }"
            @click="selectIndicator(indicator)"
          >
            <div class="item-name">{{ indicator.indicatorName }}</div>
            <div class="item-meta">
              <span class="item-subname">{{ indicator.subName }}</span>
              <span class="item-score">{{ indicator.score }}分</span>
              <div class="item-actions">
                <el-button text size="small" @click.stop="openIndicatorDialog('edit', indicator)">编辑</el-button>
                <el-button text size="small" type="danger" @click.stop="handleDeleteIndicator(indicator)">删除</el-button>
              </div>
            </div>
          </div>
          <div v-if="!state.list || state.list.length === 0" class="empty-state">
            <el-empty description="暂无指标" :image-size="80" />
          </div>
        </div>
      </div>
      
      <!-- 中间：要素列表 -->
      <div class="middle-panel">
        <div class="panel-header">
          <h3>要素</h3>
          <span v-if="state.selectedIndicator" class="panel-subtitle">
            {{ state.selectedIndicator.indicatorName }}
          </span>
          <div class="panel-actions">
            <el-button size="small" type="primary" :disabled="!state.selectedIndicator" @click.stop="openElementDialog('add')">
              新增
            </el-button>
          </div>
        </div>
        <div class="panel-content">
          <div 
            v-for="element in currentElementList" 
            :key="element.id" 
            class="element-item"
            :class="{ 'active': state.selectedElement?.id === element.id }"
            @click="selectElement(element)"
          >
            <div class="item-name">{{ element.element }}</div>
            <!--回显的时候，1是上级评分，0是非上级评分-->
            <div>
              <el-tag v-if="element.type === 1" type="danger">上级评分</el-tag>
              <el-tag v-else="element.type === 0" type="primary">非上级评分</el-tag>
            </div>
            <div class="item-score">{{ element.score }}分</div>
            <div class="item-actions">
              <el-button text size="small" @click.stop="openElementDialog('edit', element)">编辑</el-button>
              <el-button text size="small" type="danger" @click.stop="handleDeleteElement(element)">删除</el-button>
            </div>
          </div>
          <div v-if="!state.selectedIndicator" class="empty-state">
            <el-empty description="请先选择指标" :image-size="80" />
          </div>
          <div v-else-if="currentElementList.length === 0" class="empty-state">
            <el-empty description="暂无要素" :image-size="80" />
          </div>
        </div>
      </div>
      
      <!-- 右侧：内容列表 -->
      <div class="right-panel">
        <div class="panel-header">
          <h3>内容</h3>
          <span v-if="state.selectedElement" class="panel-subtitle">
            {{ state.selectedElement.element }}
          </span>
          <div class="panel-actions">
            <el-button size="small" type="primary" :disabled="!state.selectedElement" @click.stop="openContentDialog('add')">
              新增
            </el-button>
          </div>
        </div>
        <div class="panel-content">
          <div 
            v-for="content in currentContentList" 
            :key="content.id" 
            class="content-item"
          >
            <div class="item-name">{{ content.content }}</div>
            <div>
              <el-tag v-if="content.type === 1" type="danger">要求材料</el-tag>
              <el-tag v-else="content.type === 0" type="primary">非要求材料</el-tag>
            </div>
            <div class="item-score" :class="{ 'negative': content.score < 0 }">
              {{ content.score > 0 ? '+' : '' }}{{ content.score }}分
            </div>
            <div class="item-actions">
              <el-button text size="small" @click.stop="openContentDialog('edit', content)">编辑</el-button>
              <el-button text size="small" type="danger" @click.stop="handleDeleteContent(content)">删除</el-button>
            </div>
          </div>
          <div v-if="!state.selectedElement" class="empty-state">
            <el-empty description="请先选择要素" :image-size="80" />
          </div>
          <div v-else-if="currentContentList.length === 0" class="empty-state">
            <el-empty description="暂无内容" :image-size="80" />
          </div>
        </div>
      </div>
    </div>

    <!-- 抽屉：测试页 -->
    <el-drawer
      v-model="drawerVisible"
      title="搜索定位页"
      direction="rtl"
      size="45%"
    >
      <div class="drawer-test-page">
        <h3>搜索测试</h3>
        <el-alert
          type="info"
          show-icon
          :closable="false"
          title="在这里输入关键字后搜索，点击结果即可让左侧配置页直接定位并高亮对应的指标 / 要素 / 内容。"
        />

        <div class="search-toolbar">
          <div class="search-toolbar__left">
            <el-tag type="success">总指标：{{ indicatorTotal }}</el-tag>
            <el-tag type="warning">要素数：{{ elementTotal }}</el-tag>
            <el-tag type="primary">内容数：{{ contentTotal }}</el-tag>
          </div>
          <div class="search-toolbar__actions">
            <el-button size="small" @click="clearSearch">清空</el-button>
          </div>
        </div>

        <p class="search-tip">提示：支持按回车键快速搜索；点击结果即可同步左侧的选择状态。</p>

        <div class="search-section">
          <div class="search-header">
            <span class="search-header-title">指标搜索</span>
            <div class="search-action">
              <el-input
                v-model="searchForm.indicator"
                placeholder="输入指标名称关键词"
                clearable
                size="small"
                @keyup.enter="triggerSearch"
              >
                <template #append>
                  <el-button size="small" type="primary" @click="triggerSearch">搜索</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="search-result" v-if="indicatorResults.length">
            <el-timeline>
              <el-timeline-item
                v-for="item in indicatorResults"
                :key="item.id"
                :timestamp="item.subName || '—'"
              >
                <el-link type="primary" @click="handleIndicatorPick(item)">{{ item.indicatorName }}</el-link>
              </el-timeline-item>
            </el-timeline>
          </div>
          <el-empty v-else description="暂无匹配的指标" :image-size="60" />
        </div>

        <el-divider />

        <div class="search-section">
          <div class="search-header">
            <span class="search-header-title">要素搜索</span>
            <div class="search-action">
              <el-input
                v-model="searchForm.element"
                placeholder="输入要素名称关键词"
                clearable
                size="small"
                @keyup.enter="triggerSearch"
              >
                <template #append>
                  <el-button size="small" type="primary" @click="triggerSearch">搜索</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="search-result" v-if="elementResults.length">
            <el-table :data="elementResults" size="small" border stripe>
              <el-table-column prop="element" label="要素" min-width="120">
                <template #default="{ row }">
                  <el-link type="primary" @click="handleElementPick(row)">{{ row.element }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="indicatorName" label="所属指标" min-width="120" />
              <el-table-column prop="score" label="分值" width="80" />
            </el-table>
          </div>
          <el-empty v-else description="暂无匹配的要素" :image-size="60" />
        </div>

        <el-divider />

        <div class="search-section">
          <div class="search-header">
            <span class="search-header-title">内容搜索</span>
            <div class="search-action">
              <el-input
                v-model="searchForm.content"
                placeholder="输入内容名称关键词"
                clearable
                size="small"
                @keyup.enter="triggerSearch"
              >
                <template #append>
                  <el-button size="small" type="primary" @click="triggerSearch">搜索</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div class="search-result" v-if="contentResults.length">
            <el-table :data="contentResults" size="small" border stripe>
              <el-table-column prop="content" label="内容" min-width="150">
                <template #default="{ row }">
                  <el-link type="primary" @click="handleContentPick(row)">{{ row.content }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="element" label="所属要素" min-width="120" />
              <el-table-column prop="indicatorName" label="所属指标" min-width="120" />
              <el-table-column prop="score" label="分值" width="80">
                <template #default="{ row }">
                  <span :class="{ negative: row.score < 0 }">
                    {{ row.score > 0 ? '+' : '' }}{{ row.score }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-empty v-else description="暂无匹配的内容" :image-size="60" />
        </div>
      </div>
    </el-drawer>
    <!-- 指标弹窗 -->
    <el-dialog
      :title="indicatorDialog.mode === 'add' ? '新增指标' : '编辑指标'"
      v-model="indicatorDialog.visible"
      width="520px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="indicatorFormRef" :model="indicatorDialog.form" :rules="indicatorDialog.rules" label-width="100px">
        <el-form-item label="指标名称" prop="indicatorName">
          <el-input v-model="indicatorDialog.form.indicatorName" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="附属名称" prop="subName">
          <el-input v-model="indicatorDialog.form.subName" placeholder="请输入附属名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="indicatorDialog.visible = false">取 消</el-button>
          <el-button type="primary" :loading="indicatorDialog.loading" @click="submitIndicator">保 存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 要素弹窗 -->
    <el-dialog
      :title="elementDialog.mode === 'add' ? '新增要素' : '编辑要素'"
      v-model="elementDialog.visible"
      width="560px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="elementFormRef" :model="elementDialog.form" :rules="elementDialog.rules" label-width="100px">
        <el-form-item label="评价要素" prop="element">
          <el-input v-model="elementDialog.form.element" placeholder="请输入评价要素" />
        </el-form-item>
        <el-form-item label="评价标准" prop="criteria">
          <el-input v-model="elementDialog.form.criteria" placeholder="请输入评价标准" />
        </el-form-item>
        <el-form-item label="模式" prop="typeId">
          <el-select v-model="elementDialog.form.type" placeholder="请选择模式">
            <el-option label="手动" :value="0" />
            <el-option label="机器评分" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否需要上级确认" prop="type">
          <el-select v-model="elementDialog.form.type" placeholder="请选择模式">
            <el-option label="需要" :value="0" />
            <el-option label="不需要" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input v-model="elementDialog.form.score" placeholder="请输入分值" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="elementDialog.visible = false">取 消</el-button>
          <el-button type="primary" :loading="elementDialog.loading" @click="submitElement">保 存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 内容弹窗 -->
    <el-dialog
      :title="contentDialog.mode === 'add' ? '新增内容' : '编辑内容'"
      v-model="contentDialog.visible"
      width="580px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="contentFormRef" :model="contentDialog.form" :rules="contentDialog.rules" label-width="110px">
        <el-form-item label="内容名称" prop="content">
          <el-input v-model="contentDialog.form.content" placeholder="请输入内容名称" />
        </el-form-item>
        <el-form-item label="分权" prop="score">
          <el-input-number
            v-model="contentDialog.form.score"
            :step="0.5"
            :precision="2"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="得分类型" prop="typeId">
          <el-select v-model="contentDialog.form.typeId" placeholder="请选择得分类型">
            <el-option label="请选择得分类型" :value="0" />
            <el-option
              v-for="item in scoreTypeList"
              :key="item.id"
              :label="item.description ? `${item.description}（ID:${item.id}）` : `类型ID：${item.id}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封顶" prop="topScore">
          <el-input v-model="contentDialog.form.topScore" placeholder="请输入封顶" />
        </el-form-item>
        <el-form-item label="封底" prop="bottomScore">
          <el-input v-model="contentDialog.form.bottomScore" placeholder="请输入封底" />
        </el-form-item>
        <el-form-item label="文件上传" prop="type">
          <el-radio-group v-model="contentDialog.form.type">
            <el-radio :label="0">无需文件</el-radio>
            <el-radio :label="1">需要文件</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="contentDialog.visible = false">取 消</el-button>
          <el-button type="primary" :loading="contentDialog.loading" @click="submitContent">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getKpiWithOtherList, deleteKpi } from '@/api/kpi/index'
import { addIndicator, updateIndicator } from '@/api/indicator/index'
import { addElement, updateElement } from '@/api/element/index'
import { addContent, updateContent } from '@/api/content/index'
import { getJsonList } from '@/api/tool/index'

const route = useRoute()
const router = useRouter()

const state = reactive({
  formData: {
    page: '',
    kpiId: '',
    indicatorName: '',
    elementName: '',
    contentName: '',
  },
  title: '',
  list: [] as any[],
  selectedIndicator: null as any,
  selectedElement: null as any,
  loading: false,
})

const scoreTypeList = ref<any[]>([])
const drawerVisible = ref(false)
const searchForm = reactive({
  indicator: '',
  element: '',
  content: '',
})
const indicatorFormRef = ref()
const elementFormRef = ref()
const contentFormRef = ref()

const indicatorDialog = reactive({
  visible: false,
  mode: 'add' as 'add' | 'edit',
  loading: false,
  form: {
    id: undefined as number | undefined,
    indicatorName: '',
    subName: '',
    kpiId: '',
  },
  rules: {
    indicatorName: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
    subName: [{ required: true, message: '请输入附属名称', trigger: 'blur' }],
  },
})

const elementDialog = reactive({
  visible: false,
  mode: 'add' as 'add' | 'edit',
  loading: false,
  form: {
    id: undefined as number | undefined,
    element: '',
    criteria: '',
    type: 0,
    score: '',
    indicatorId: '' as number | string,
  },
  rules: {
    element: [{ required: true, message: '请输入评价要素', trigger: 'blur' }],
    criteria: [{ required: true, message: '请输入评价标准', trigger: 'blur' }],
    type: [{ required: true, message: '请选择模式', trigger: 'change' }],
    score: [{ required: true, message: '请输入分值', trigger: 'blur' }],
  },
})

const contentDialog = reactive({
  visible: false,
  mode: 'add' as 'add' | 'edit',
  loading: false,
  form: {
    id: undefined as number | undefined,
    content: '',
    score: 0,
    elementId: 0,
    typeId: 0,
    topScore: '',
    bottomScore: '',
    type: 0,
  },
  rules: {
    content: [{ required: true, message: '请输入内容名称', trigger: 'blur' }],
    score: [{ required: true, message: '请输入分权', trigger: 'blur' }],
    elementId: [{ required: true, message: '请选择要素', trigger: 'change' }],
    typeId: [{ required: true, message: '请选择得分类型', trigger: 'change' }],
    type: [{ required: true, message: '请选择是否需要文件', trigger: 'change' }],
  },
})

const goBack = () => {
  router.back()
}

const selectIndicator = (indicator: any) => {
  state.selectedIndicator = indicator
  state.selectedElement = null
}

const selectElement = (element: any) => {
  state.selectedElement = element
}

const currentElementList = computed(() => {
  if (!state.selectedIndicator) return []
  return state.selectedIndicator.elementList || []
})

const currentContentList = computed(() => {
  if (!state.selectedElement) return []
  return state.selectedElement.contentList || []
})

const indicatorResults = computed(() => {
  const keyword = searchForm.indicator.trim().toLowerCase()
  if (!keyword) return []
  return state.list.filter((item: any) => {
    const name = (item.indicatorName || '').toLowerCase()
    const sub = (item.subName || '').toLowerCase()
    return name.includes(keyword) || sub.includes(keyword)
  })
})

const elementResults = computed(() => {
  const keyword = searchForm.element.trim().toLowerCase()
  if (!keyword) return []
  const list = state.list.flatMap((indicator: any) =>
    (indicator.elementList || []).map((el: any) => ({
      ...el,
      indicatorName: indicator.indicatorName,
      indicatorId: indicator.id,
    }))
  )
  return list.filter((el: any) => (el.element || '').toLowerCase().includes(keyword))
})

const contentResults = computed(() => {
  const keyword = searchForm.content.trim().toLowerCase()
  if (!keyword) return []
  const list = state.list.flatMap((indicator: any) =>
    (indicator.elementList || []).flatMap((el: any) =>
      (el.contentList || []).map((c: any) => ({
        ...c,
        element: el.element,
        elementId: el.id,
        indicatorName: indicator.indicatorName,
        indicatorId: indicator.id,
      }))
    )
  )
  return list.filter((c: any) => (c.content || '').toLowerCase().includes(keyword))
})

const indicatorTotal = computed(() => state.list.length)
const elementTotal = computed(() =>
  state.list.reduce((sum: number, it: any) => sum + (it.elementList?.length || 0), 0)
)
const contentTotal = computed(() =>
  state.list.reduce(
    (sum: number, it: any) =>
      sum +
      (it.elementList || []).reduce(
        (acc: number, el: any) => acc + (el.contentList?.length || 0),
        0
      ),
    0
  )
)

const triggerSearch = () => {
  // 计算属性自动根据关键字更新
}

const clearSearch = () => {
  searchForm.indicator = ''
  searchForm.element = ''
  searchForm.content = ''
}

const handleIndicatorPick = (indicator: any) => {
  selectIndicator(indicator)
}

const handleElementPick = (element: any) => {
  const indicator = state.list.find((item: any) => item.id === element.indicatorId)
  if (indicator) {
    selectIndicator(indicator)
    const target = (indicator.elementList || []).find((el: any) => el.id === element.id)
    if (target) selectElement(target)
  }
}

const handleContentPick = (content: any) => {
  const indicator = state.list.find((item: any) => item.id === content.indicatorId)
  if (!indicator) return
  selectIndicator(indicator)
  const element = (indicator.elementList || []).find((el: any) => el.id === content.elementId)
  if (element) {
    selectElement(element)
  }
}

const restoreSelection = (indicatorId?: number, elementId?: number) => {
  if (!indicatorId) {
    state.selectedIndicator = null
    state.selectedElement = null
    return
  }
  const indicator = state.list.find((item: any) => item.id === indicatorId)
  state.selectedIndicator = indicator || null
  if (!indicator || !elementId) {
    state.selectedElement = null
    return
  }
  const element = (indicator.elementList || []).find((item: any) => item.id === elementId)
  state.selectedElement = element || null
}

const loadScoreTypeList = () => {
  getJsonList({})
    .then((data: any) => {
      scoreTypeList.value = data.list || []
    })
    .catch(() => {})
}

const getDetail = () => {
  const id = route.query.id as string
  const name = route.query.name as string
  if (!id) {
    ElMessage.warning('缺少ID参数')
    goBack()
    return
  }
  state.loading = true
  state.formData.kpiId = id
  state.title = name
  getKpiWithOtherList(state.formData)
    .then((res: any) => {
      if (res.code === 200) {
        state.list = res.list || []
      } else {
        ElMessage.error(res.message || '获取数据失败')
      }
      state.loading = false
    })
    .catch(() => {
      state.loading = false
      ElMessage.error('获取数据失败')
    })
}

const refreshAndKeepSelection = () => {
  const indicatorId = state.selectedIndicator?.id
  const elementId = state.selectedElement?.id
  return getKpiWithOtherList(state.formData)
    .then((res: any) => {
      if (res.code === 200) {
        state.list = res.list || []
        restoreSelection(indicatorId, elementId)
      } else {
        ElMessage.error(res.message || '操作失败')
      }
    })
    .catch(() => {
      ElMessage.error('操作失败')
    })
}

const openIndicatorDialog = (mode: 'add' | 'edit', indicator?: any) => {
  indicatorDialog.mode = mode
  indicatorDialog.visible = true
  indicatorDialog.form = {
    id: indicator?.id,
    indicatorName: indicator?.indicatorName || '',
    subName: indicator?.subName || '',
    kpiId: state.formData.kpiId,
  }
  nextTick(() => indicatorFormRef.value?.clearValidate())
}

const submitIndicator = () => {
  indicatorFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    indicatorDialog.loading = true
    const payload = { ...indicatorDialog.form, kpiId: state.formData.kpiId }
    try {
      if (indicatorDialog.mode === 'add') {
        await addIndicator(payload)
        ElMessage.success('新增成功')
      } else {
        await updateIndicator([payload])
        ElMessage.success('更新成功')
      }
      indicatorDialog.visible = false
      await refreshAndKeepSelection()
    } finally {
      indicatorDialog.loading = false
    }
  })
}

const handleDeleteIndicator = (indicator: any) => {
  ElMessageBox.confirm('删除该指标会同时删除其要素和内容，确认继续？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteKpi([{ indicatorIds: indicator.id }])
      ElMessage.success('删除成功')
      if (state.selectedIndicator?.id === indicator.id) {
        state.selectedIndicator = null
        state.selectedElement = null
      }
      await refreshAndKeepSelection()
    })
    .catch(() => {})
}

const openElementDialog = (mode: 'add' | 'edit', element?: any) => {
  if (!state.selectedIndicator) {
    ElMessage.warning('请先选择指标')
    return
  }
  elementDialog.mode = mode
  elementDialog.visible = true
  elementDialog.form = {
    id: element?.id,
    element: element?.element || '',
    criteria: element?.criteria || '',
    type: element?.type ?? 0,
    score: element?.score ?? '',
    indicatorId: state.selectedIndicator.id,
  }
  nextTick(() => elementFormRef.value?.clearValidate())
}

const submitElement = () => {
  elementFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    elementDialog.loading = true
    const payload = { ...elementDialog.form, indicatorId: state.selectedIndicator?.id }
    try {
      if (elementDialog.mode === 'add') {
        await addElement(payload)
        ElMessage.success('新增成功')
      } else {
        await updateElement(payload)
        ElMessage.success('更新成功')
      }
      elementDialog.visible = false
      await refreshAndKeepSelection()
    } finally {
      elementDialog.loading = false
    }
  })
}

const handleDeleteElement = (element: any) => {
  ElMessageBox.confirm('删除该要素会同时删除其内容，确认继续？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteKpi([{ elementIds: element.id }])
      ElMessage.success('删除成功')
      if (state.selectedElement?.id === element.id) {
        state.selectedElement = null
      }
      await refreshAndKeepSelection()
    })
    .catch(() => {})
}

const openContentDialog = (mode: 'add' | 'edit', content?: any) => {
  if (!state.selectedElement) {
    ElMessage.warning('请先选择要素')
    return
  }
  contentDialog.mode = mode
  contentDialog.visible = true
  contentDialog.form = {
    id: content?.id,
    content: content?.content || '',
    score: content?.score ?? 0,
    elementId: state.selectedElement.id,
    typeId: content?.typeId ?? 0,
    topScore: content?.topScore ?? '',
    bottomScore: content?.bottomScore ?? '',
    type: content?.type ?? 0,
  }
  loadScoreTypeList()
  nextTick(() => contentFormRef.value?.clearValidate())
}

const submitContent = () => {
  contentFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    contentDialog.loading = true
    const payload = { ...contentDialog.form, elementId: state.selectedElement?.id }
    try {
      if (contentDialog.mode === 'add') {
        await addContent(payload)
        ElMessage.success('新增成功')
      } else {
        await updateContent(payload)
        ElMessage.success('更新成功')
      }
      contentDialog.visible = false
      await refreshAndKeepSelection()
    } finally {
      contentDialog.loading = false
    }
  })
}

const handleDeleteContent = (content: any) => {
  ElMessageBox.confirm('确认删除该内容？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteKpi([{ contentIds: content.id }])
      ElMessage.success('删除成功')
      await refreshAndKeepSelection()
    })
    .catch(() => {})
}

onMounted(() => {
  getDetail()
})
</script>

<style scoped lang="scss">
.configure-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  
  .kpi-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--el-border-color);
    
    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  
  .drawer-test-page {
    padding: 20px;
    
    h3 {
      margin: 0 0 16px;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
    
    .el-alert {
      margin-bottom: 20px;
    }
    
    .search-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin: 20px 0;
      padding: 12px 16px;
      background: var(--el-bg-color-page);
      border-radius: 6px;

      &__left {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }

      &__actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    }

    .search-tip {
      margin: 0 0 20px;
      padding: 8px 12px;
      background: var(--el-color-info-light-9);
      border-left: 3px solid var(--el-color-info);
      border-radius: 4px;
      color: var(--el-text-color-regular);
      font-size: 13px;
      line-height: 1.6;
    }

    .search-section {
      margin-bottom: 24px;
      padding: 16px;
      background: var(--el-bg-color);
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);
    }
    
    .search-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .search-action {
      flex: 0 0 clamp(220px, 40vw, 360px);
    }
    
    .search-result {
      background: var(--el-bg-color-page);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: 6px;
      padding: 16px;
      margin-top: 12px;
      min-height: 100px;
    }
    
    .el-divider {
      margin: 24px 0;
    }
    
    .el-empty {
      padding: 40px 20px;
    }
  }
  
  .three-column-layout {
    flex: 1;
    display: flex;
    gap: 16px;
    min-height: calc(100vh - 200px);
    //min-height: 500px;
    
    .left-panel,
    .middle-panel,
    .right-panel {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--el-border-color);
      border-radius: 8px;
      background: var(--el-bg-color);
      overflow: hidden;
      
      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        padding: 16px 20px;
        background: var(--el-color-primary-light-9);
        border-bottom: 1px solid var(--el-border-color);
        
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
        
        .panel-subtitle {
          display: block;
          margin-top: 8px;
          font-size: 14px;
          color: var(--el-text-color-regular);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .panel-actions {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }
      }
      
      .panel-content {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        
        // 自定义滚动条
        &::-webkit-scrollbar {
          width: 6px;
        }
        
        &::-webkit-scrollbar-track {
          background: var(--el-bg-color-page);
          border-radius: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
          background: var(--el-border-color);
          border-radius: 3px;
          
          &:hover {
            background: var(--el-border-color-darker);
          }
        }
      }
    }
    
    .left-panel {
      width: 20%;
      //min-width: 300px;
      
      .indicator-item {
        padding: 12px 16px;
        margin-bottom: 8px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
        background: var(--el-bg-color-page);
        
        &:hover {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
        }
        
        &.active {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
        }
        
        .item-name {
          font-size: 15px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 8px;
          word-break: break-word;
        }
        
        .item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          gap: 8px;
          
          .item-subname {
            color: var(--el-text-color-regular);
          }
          
          .item-score {
            color: var(--el-color-primary);
            font-weight: 600;
          }

          .item-actions {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
          }
        }
      }
    }
    
    .middle-panel {
      flex: 1;
      width: 30%;
      //min-width: 300px;
      
      .element-item {
        padding: 12px 16px;
        margin-bottom: 8px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
        background: var(--el-bg-color-page);
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        &:hover {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
        }
        
        &.active {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
        }
        
        .item-name {
          font-size: 14px;
          color: var(--el-text-color-primary);
          flex: 1;
          word-break: break-word;
        }
        
        .item-score {
          font-size: 14px;
          color: var(--el-color-primary);
          font-weight: 600;
          margin-left: 12px;
          flex-shrink: 0;
        }

        .item-actions {
          display: flex;
          gap: 6px;
          margin-left: 12px;
          flex-shrink: 0;
        }
      }
    }
    
    .right-panel {
      flex: 1;
      width: 50%;
      //min-width: 300px;
      
      .content-item {
        padding: 12px 16px;
        margin-bottom: 8px;
        border: 1px solid var(--el-border-color-lighter);
        border-radius: 6px;
        background: var(--el-bg-color-page);
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .item-name {
          font-size: 14px;
          color: var(--el-text-color-regular);
          flex: 1;
          word-break: break-word;
        }
        
        .item-score {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-color-success);
          margin-left: 12px;
          flex-shrink: 0;
          
          &.negative {
            color: var(--el-color-danger);
          }
        }

        .item-actions {
          display: flex;
          gap: 6px;
          margin-left: 12px;
          flex-shrink: 0;
        }
      }
    }
    
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      min-height: 200px;
    }
  }
}

.search-header-title {
  /* 基础样式 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: clamp(14px, 2vw, 18px); /* 响应式字体大小 */
  font-weight: 600;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  
  /* 优化显示 */
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  letter-spacing: 0.3px;
}
</style>