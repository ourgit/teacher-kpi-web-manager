<template>
  <div class="layout-padding-auto">
    <div class="template-top">
      <el-space>
        <el-select v-model="orgId" size="default" placeholder="选择机构" filterable>
          <el-option v-for="item in orgList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-input v-model="templateName" size="default" placeholder="模板名称" />
        <el-button-group>
          <el-button v-for="(item, index) in paperTypes" size="default" :key="index" :type="currentPaper.type === item.type ? 'primary' : ''" @click="setPaper(item)">
            {{ item.type }}
          </el-button>
          <el-popover :visible="popoverVisible" placement="bottom" width="300" title="设置纸张宽高(mm)" trigger="click">
            <template #reference>
              <el-button size="default" :type="currentPaper.type === 'other' ? 'primary' : ''" @click="popoverVisible = !popoverVisible">
                自定义
              </el-button>
            </template>
            <template #default>
              <el-space>
                <el-input type="number" v-model="paperWidth" placeholder="宽(mm)" />
                ~
                <el-input type="number" v-model="paperHeight" placeholder="高(mm)" />
              </el-space>
              <el-button type="primary" style="width: 100%;margin-top: 10px;" @click="onSetOtherPaper">确定</el-button>
            </template>
          </el-popover>
        </el-button-group>
      </el-space>
      <div class="btn">
        <el-space>
          <el-button size="default" type="primary" @click="onPreview">
            <el-icon>
              <ele-View />
            </el-icon>
            预览
          </el-button>
          <el-button size="default" type="primary" @click="onSave">
            <el-icon>
              <ele-Plus />
            </el-icon>
            保存
          </el-button>
          <el-button size="default" type="danger">
            <el-icon>
              <ele-Close />
            </el-icon>
            清空
          </el-button>
        </el-space>
      </div>
    </div>
    <div class="template-main">
      <el-scrollbar class="module-box">
        <div class="rect-printElement-types hiprintEpContainer">
        </div>
      </el-scrollbar>
      <el-scrollbar class="design-box">
        <div style="padding: 20px;">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </div>
      </el-scrollbar>
      <el-scrollbar class="attribute-box">
        <div id="PrintElementOptionSetting"></div>
      </el-scrollbar>
    </div>
    <printPreview ref="printPreviewRef" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getPrintTemplateDetail,
  addPrintTemplate,
  updatePrintTemplate,
} from '@/api/printTemplate/index'
import { getOrganList } from '@/api/organ/index'
import { hiprint } from 'vue-plugin-hiprint'
import providers from './providers.js'
import printData from './print-data.js'
import mittBus from '@/utils/mitt'

const printPreview = defineAsyncComponent(() => import('./preview.vue'))

let hiprintTemplate: any;

const props = defineProps({
  isEidt: {
    type: Boolean,
    default: false,
  },
})

// 定义变量内容
const popoverVisible = ref(false)
const printPreviewRef = ref()
const route = useRoute()
const router = useRouter()
const state = reactive({
  id: 0,
  orgId: '',
  orgList: [] as any,
  templateName: '',
  currentPaper: {
    type: 'A4',
    width: 210,
    height: 296.6
  },
  // 纸张类型
  paperTypes: [{
    type: 'A3',
    width: 420,
    height: 296.6
  }, {
    type: 'A4',
    width: 210,
    height: 296.6
  }, {
    type: 'A5',
    width: 210,
    height: 147.6
  }, {
    type: 'B3',
    width: 500,
    height: 352.6
  }, {
    type: 'B4',
    width: 250,
    height: 352.6
  }, {
    type: 'B5',
    width: 250,
    height: 175.6
  }],
  paperWidth: 220,
  paperHeight: 80,
  type: '',
  isCopy: false
})

const { orgId, orgList, templateName, currentPaper, paperTypes, paperWidth, paperHeight } = toRefs(state)

// 获取详情
const getDetailData = () => {
  if (props.isEidt) {
    state.type = 'edit'
    const templateId = router.currentRoute.value.query.templateId
    state.isCopy = router.currentRoute.value.query.copy === '1' ? true : false
    getPrintTemplateDetail({
      id: templateId,
    }).then((res) => {
      state.id = res.id
      state.orgId = res.orgId
      state.templateName = res.title
      const template = JSON.parse(res.template)
      state.currentPaper = template.paperConfig
      state.paperWidth = template.paperConfig.width
      state.paperHeight = template.paperConfig.height
      $('#hiprint-printTemplate').empty()
      hiprintTemplate = new hiprint.PrintTemplate({
        template: template.content,
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination'
      });
      hiprintTemplate.design('#hiprint-printTemplate');
    })
    changeMode()
  } else {
    state.type = 'add'
    state.orgId = ''
    state.templateName = ''
    changeMode()
    $('#hiprint-printTemplate').empty()
    hiprintTemplate = new hiprint.PrintTemplate({
      template: {},
      settingContainer: '#PrintElementOptionSetting',
      paginationContainer: '.hiprint-printPagination'
    });
    hiprintTemplate.design('#hiprint-printTemplate');
  }
}

// 获取机构列表
const getOrganListData = () => {
  getOrganList({
    page: 0
  }).then((data: any) => {
    state.orgList = data.list
  })
}

// 设置纸张类型
const setPaper = (val: any) => {
  state.currentPaper = val
  hiprintTemplate.setPaper(val.width, val.height)
}

// 设置其它纸张类型
const onSetOtherPaper = () => {
  state.currentPaper = {
    type: 'other',
    width: state.paperWidth,
    height: state.paperHeight
  }
  hiprintTemplate.setPaper(state.paperWidth, state.paperHeight)
  popoverVisible.value = false
}

// 预览
const onPreview = () => {
  printPreviewRef.value.openDialog(hiprintTemplate, printData, state.currentPaper.width)
}

const changeMode = () => {
  let provider = providers[0]
  hiprint.init({
    providers: [provider.f]
  });
  $('.hiprintEpContainer').empty()
  hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
}



// 提交
const onSave = () => {
  const template = {
    paperConfig: state.currentPaper,
    content: hiprintTemplate.getJson()
  }
  if (state.type === 'add' || state.isCopy) {
    addPrintTemplate({
      orgId: state.orgId,
      title: state.templateName,
      template: JSON.stringify(template)
    })
      .then(() => {
        router.push('/printTemplate')
        closeCurrentTagsView()
      })
  } else {
    updatePrintTemplate({
      id: state.id,
      orgId: state.orgId,
      title: state.templateName,
      template: JSON.stringify(template)
    })
      .then(() => {
        router.push('/printTemplate')
        closeCurrentTagsView()
      })
  }
}

// 关闭当前 tagsView
const closeCurrentTagsView = () => {
  mittBus.emit(
    "onCurrentContextmenuClick",
    Object.assign({}, { contextMenuClickId: 1, ...route })
  )
}

// 页面加载时
onMounted(() => {
  getOrganListData()
  getDetailData()
})
</script>
<style lang="scss" scoped>
.template-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--el-card-padding);
  border-bottom: 1px solid var(--next-border-color-light);

  .btn {
    display: flex;
    justify-content: flex-end;
  }
}

.template-main {
  flex: 1 1 auto;
  height: 0;
  display: flex;

  :deep(.hiprint-printElement-type) {
    padding: 20px;
  }

  :deep(.ep-draggable-item) {
    height: 50px;
  }

  .module-box {
    height: 100%;
    width: 300px;

    .title {
      font-weight: 700;
    }
  }

  .design-box {
    flex: 1;
    display: flex;
    justify-content: center;
  }


  .attribute-box {
    width: 400px;
    height: 100%;
  }

}
</style>