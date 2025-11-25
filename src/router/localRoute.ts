import { RouteRecordRaw } from 'vue-router'

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module 'vue-router' {
  interface RouteMeta {
    page?: string
    title?: string
    isLink?: string
    isHide?: boolean
    isKeepAlive?: boolean
    isAffix?: boolean
    isIframe?: boolean
    roles?: string[]
    icon?: string
  }
}

/**
 * 定义动态路由
 */
export const localRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    meta: {
      isKeepAlive: true,
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          page: 'home/index',
          title: '首页',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: true,
          isIframe: false,
          roles: ['admin'],
          icon: 'iconfont icon-zhuye',
        },
      },
      //kpi
      {
        path: '/kpi',
        name: 'kpi',
        component: () => import('@/layout/routerView/parent.vue'),
        redirect: '/kpi/index',
        meta: {
          title: 'KPI',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'ele-Notebook',
        },
        children: [
          {
            path: '/kpi/index',
            name: 'kpiIndex',
            component: () => import('@/views/kpi/index.vue'),
            meta: {
              title: 'KPI管理',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-Notebook',
            }
          },
          {
            path: '/kpi/dispatch',
            name: 'kpidDispatch',
            component: () => import('@/views/kpi/dispatch/index.vue'),
            meta: {
              title: '下发管理',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-Notebook',
            }
          },{
            path: '/kpi/task',
            name: 'kpiTask',
            component: () => import('@/views/kpi/task/index.vue'),
            meta: {
              title: '评分任务列表',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-User',
            },
          },
        ],
      },
       //indicator
      {
        path: '/indicator',
        name: 'indicator',
        component: () => import('@/layout/routerView/parent.vue'),
        redirect: '/indicator/index',
        meta: {
          title: '指标',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'ele-Switch',
        },
        children: [
          {
            path: '/indicator/index',
            name: 'indicatorIndex',
            component: () => import('@/views/indicator/index.vue'),
            meta: {
              title: '指标管理',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-Switch',
            }
          }
        ],
      },
       //element
      {
        path: '/element',
        name: 'element',
        component: () => import('@/layout/routerView/parent.vue'),
        redirect: '/element/index',
        meta: {
          title: '要素',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'ele-Orange',
        },
        children: [
          {
            path: '/element/index',
            name: 'elementIndex',
            component: () => import('@/views/element/index.vue'),
            meta: {
              title: '要素管理',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-Orange',
            }
          },
        ],
      },
       //content
      {
        path: '/content',
        name: 'content',
        component: () => import('@/layout/routerView/parent.vue'),
        redirect: '/content/index',
        meta: {
          title: '内容',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'ele-Van',
        },
        children: [
          {
            path: '/content/index',
            name: 'contentIndex',
            component: () => import('@/views/content/index.vue'),
            meta: {
              title: '内容管理',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-Van',
            }
          },
        ],
      },
      {
        path: '/member',
        name: 'member',
        component: () => import('@/layout/routerView/parent.vue'),
        redirect: '/member/index',
        meta: {
          title: '用户',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'ele-User',
        },
        children: [
          {
            path: '/member/index',
            name: 'memberIndex',
            component: () => import('@/views/member/index.vue'),
            meta: {
              title: '用户列表',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-User',
            },
          },{
            path: '/member/department',
            name: 'memberDepartment',
            component: () => import('@/views/member/department/index.vue'),
            meta: {
              title: '部门管理',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-User',
            },
          },{
            path: '/member/campus',
            name: 'memberCampus',
            component: () => import('@/views/member/campus/index.vue'),
            meta: {
              title: '校区管理',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-User',
            },
          }
        ],
      },
      {
        path: '/tool',
        name: 'tool',
        component: () => import('@/layout/routerView/tool.vue'),
        redirect: '/tool/json',
        meta: {
          title: '工具',
          isLink: '',
          isHide: false,
          isKeepAlive: true,
          isAffix: false,
          isIframe: false,
          roles: ['admin'],
          icon: 'ele-Setting',
        },
        children: [
          {
            path: '/tool/json',
            name: 'JsonIndex',
            component: () => import('@/views/tool/json/index.vue'),
            meta: {
              title: '考核等级json配置',
              isLink: '',
              isHide: false,
              isKeepAlive: true,
              isAffix: false,
              isIframe: false,
              roles: ['admin'],
              icon: 'ele-Setting',
            },
          }
        ],
      }
      //待删除
      // {
      //   path: '/system',
      //   name: 'system',
      //   component: () => import('@/layout/routerView/parent.vue'),
      //   redirect: '/system/menu',
      //   meta: {
      //     page: 'layout/routerView/parent',
      //     title: '设置',
      //     isLink: '',
      //     isHide: false,
      //     isKeepAlive: true,
      //     isAffix: false,
      //     isIframe: false,
      //     roles: ['admin'],
      //     icon: 'iconfont icon-xitongshezhi',
      //   },
      //   children: [
      //     {
      //       path: '/system/menu',
      //       name: 'systemMenu',
      //       component: () => import('@/views/system/menu/index.vue'),
      //       meta: {
      //         page: 'system/menu/index',
      //         title: '菜单管理',
      //         isLink: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: false,
      //         isIframe: false,
      //         roles: ['admin'],
      //         icon: 'iconfont icon-caidan',
      //       },
      //     },
      //     {
      //       path: '/system/action',
      //       name: 'systemActionIndex',
      //       component: () => import('@/views/system/action/index.vue'),
      //       meta: {
      //         page: 'system/action/index',
      //         title: '权限管理',
      //         isLink: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: false,
      //         isIframe: false,
      //         roles: ['admin'],
      //         icon: 'ele-SetUp',
      //       },
      //     },
      //     {
      //       path: '/system/role',
      //       name: 'systemRole',
      //       component: () => import('@/views/system/role/index.vue'),
      //       meta: {
      //         page: 'system/role/index',
      //         title: '角色管理',
      //         isLink: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: false,
      //         isIframe: false,
      //         roles: ['admin'],
      //         icon: 'iconfont icon-jiaoseguanli',
      //       },
      //     },
      //     {
      //       path: '/system/user',
      //       name: 'systemUser',
      //       component: () => import('@/views/system/user/index.vue'),
      //       meta: {
      //         page: 'system/user/index',
      //         title: '用户管理',
      //         isLink: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: false,
      //         isIframe: false,
      //         roles: ['admin'],
      //         icon: 'iconfont icon-user',
      //       },
      //     },
      //     {
      //       path: '/system/config',
      //       name: 'systemConfig',
      //       component: () => import('@/views/system/config/index.vue'),
      //       meta: {
      //         page: 'system/config/index',
      //         title: '参数配置',
      //         isLink: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: false,
      //         isIframe: false,
      //         roles: ['admin'],
      //         icon: 'iconfont icon-xitongshezhi',
      //       },
      //     },
      //     {
      //       path: '/system/log',
      //       name: 'systemLog',
      //       component: () => import('@/views/system/log/index.vue'),
      //       meta: {
      //         page: 'system/log/index',
      //         title: '操作日志',
      //         isLink: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: false,
      //         isIframe: false,
      //         roles: ['admin'],
      //         icon: 'ele-Memo',
      //       },
      //     },
      //     {
      //       path: '/system/password',
      //       name: 'systemPassword',
      //       component: () => import('@/views/system/password/index.vue'),
      //       meta: {
      //         page: 'system/password/index',
      //         title: '修改密码',
      //         isLink: '',
      //         isHide: false,
      //         isKeepAlive: true,
      //         isAffix: false,
      //         isIframe: false,
      //         roles: ['admin'],
      //         icon: 'ele-Lock',
      //       },
      //     },
      //   ],
      // },
    ],
  },
]
