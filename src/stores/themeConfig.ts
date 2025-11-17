import { defineStore } from 'pinia'

/**
 * 布局配置
 * 修改配置时：
 * 1、需要每次都清理 `window.localStorage` 浏览器永久缓存
 * 2、或者点击布局配置最底部 `一键恢复默认` 按钮即可看到效果
 */
export const useThemeConfig = defineStore('themeConfig', {
  state: (): ThemeConfigState => ({
    themeConfig: {
      isDrawer: false,
      primary: '#1577dc',
      isIsDark: false,
      topBar: '#ffffff',
      topBarColor: '#080808',
      isTopBarColorGradual: false,
      menuBar: '#FFFFFF',
      menuBarColor: '#212121',
      menuBarActiveColor: 'rgba(0, 0, 0, 0.2)',
      isMenuBarColorGradual: false,
      columnsMenuBar: '#1577dc',
      columnsMenuBarColor: '#ffffff',
      isColumnsMenuBarColorGradual: false,
      isColumnsMenuHoverPreload: false,
      isCollapse: false,
      isUniqueOpened: true,
      isFixedHeader: false,
      isFixedHeaderChange: false,
      isClassicSplitMenu: false,
      isLockScreen: false,
      lockScreenTime: 30,
      isShowLogo: true,
      isShowLogoChange: false,
      isBreadcrumb: true,
      isTagsview: true,
      isBreadcrumbIcon: false,
      isTagsviewIcon: false,
      isCacheTagsView: false,
      isSortableTagsView: true,
      isShareTagsView: false,
      isFooter: false,
      isGrayscale: false,
      isInvert: false,
      isWartermark: false,
      wartermarkText: 'bxnet',
      tagsStyle: 'tags-style-five',
      animation: 'slide-right',
      columnsAsideStyle: 'columns-round',
      columnsAsideLayout: 'columns-vertical',
      layout: 'columns',
      isRequestRoutes: false,
      globalTitle: '后台管理系统',
      globalViceTitle: '后台管理系统',
      globalViceTitleMsg: '后台管理系统',
      globalComponentSize: 'large',
    },
  }),
  actions: {
    setThemeConfig(data: ThemeConfigState) {
      this.themeConfig = data.themeConfig
    },
  },
})
