<template>
  <div class="page-container layout-pd">
    <el-card shadow="hover">
      <el-form class="query" :inline="true">
        <el-form-item>
          <el-button size="default" type="success" class="ml10" @click="syncMenu">
            <el-icon>
              <ele-Plus />
            </el-icon>
            同步菜单
          </el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" v-loading="loading" style="width: 100%" row-key="path">
        <el-table-column label="菜单名称" show-overflow-tooltip>
          <template #default="scope">
            <SvgIcon :name="scope.row.meta.icon" />
            <span class="ml10">{{ scope.row.meta.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序" show-overflow-tooltip width="80">
          <template #default="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import { reactive, toRefs, onMounted } from 'vue'
import { localRoutes } from '@/router/localRoute'
import { ElMessageBox } from 'element-plus'
import {
  getMenuList,
  addMenu,
  updateMenu,
  delMenu,
} from '@/api/system/menu/index'
import { setMenuForRole } from '@/api/system/role/index'

// 定义变量内容
const state = reactive({
  list: [],
  loading: false,
})

const { list, loading } = toRefs(state)

// 获取列表
const getListData = () => {
  state.loading = true
  getMenuList().then((data: any) => {
    state.loading = false
    state.list = data.list
  })
}

const syncMenu = () => {
  const localRoutesList = localRoutes[0].children
  const menuList = JSON.parse(JSON.stringify(state.list))

  function findItem(arr: any, current: any, parent: any) {
    let list = [] as any
    let res
    if (parent) {
      arr.some((item: any) => {
        if (parent.name === item.name) {
          list = item.children
          return true
        }
      })
      if (list) {
        list.some((item: any) => {
          if (current.name === item.name) {
            res = item
            return true
          }
        })
      }
    } else {
      arr.some((item: any) => {
        if (current.name === item.name) {
          res = item
          return true
        }
      })
    }
    return res
  }

  function recursionDel(arr: any, index: any, resolve: any, parent: any) {
    const item = arr[index]
    if (!item) {
      resolve()
      return
    }
    if (item.children) {
      new Promise((resolve) => {
        recursionDel(item.children, 0, resolve, item)
      }).then(() => {
        if (findItem(dynamicRoutes[0].children, item, parent)) {
          if (arr[index + 1]) {
            recursionDel(arr, index + 1, resolve, parent)
          } else {
            resolve()
          }
        } else {
          delMenu(item)
            .then(() => {
              if (arr[index + 1]) {
                recursionDel(arr, index + 1, resolve, parent)
              } else {
                resolve()
              }
            })
            .catch(() => {
              if (arr[index + 1]) {
                recursionDel(arr, index + 1, resolve, parent)
              } else {
                resolve()
              }
            })
        }
      })
    } else {
      if (findItem(dynamicRoutes[0].children, item, parent)) {
        if (arr[index + 1]) {
          recursionDel(arr, index + 1, resolve, parent)
        } else {
          resolve()
        }
      } else {
        delMenu(item)
          .then(() => {
            if (arr[index + 1]) {
              recursionDel(arr, index + 1, resolve, parent)
            } else {
              resolve()
            }
          })
          .catch(() => {
            if (arr[index + 1]) {
              recursionDel(arr, index + 1, resolve, parent)
            } else {
              resolve()
            }
          })
      }
    }
  }

  function recursionAdd(arr: any, index: any, resolve: any, parent: any) {
    const item = arr[index]
    if (!item) {
      resolve()
      return
    }
    const data = {
      parentId: parent ? parent.id : undefined,
      redirect: item.redirect || '',
      path: item.path || '',
      name: item.name || '',
      component: item.meta.page,
      title: item.meta.title || '',
      icon: item.meta.icon || '',
      isLink: item.meta.isLink || '',
      isHide: item.meta.isHide || false,
      isKeepAlive: item.meta.isKeepAlive || false,
      isAffix: item.meta.isAffix || false,
      isIframe: item.meta.isIframe || false,
      sort: 100 - index,
    } as any
    const res = findItem(menuList, data, parent) as any
    let type = 'add'
    if (res) {
      if (
        data.redirect === res.redirect &&
        data.path === res.path &&
        data.name === res.name &&
        data.component === res.component &&
        data.title === res.title &&
        data.icon === res.icon &&
        data.isLink === res.isLink &&
        data.isHide === res.isHide &&
        data.isKeepAlive === res.isKeepAlive &&
        data.isAffix === res.isAffix &&
        data.isIframe === res.isIframe &&
        data.sort === res.sort
      ) {
        if (item.children) {
          new Promise((resolve) => {
            recursionAdd(item.children, 0, resolve, res)
          }).then(() => {
            if (arr[index + 1]) {
              recursionAdd(arr, index + 1, resolve, null)
            } else {
              resolve()
            }
          })
          return
        } else {
          if (arr[index + 1]) {
            recursionAdd(arr, index + 1, resolve, parent)
          } else {
            resolve()
          }
          return
        }
      } else {
        data.id = res.id
        type = 'mod'
      }
    }
    if (type === 'add') {
      addMenu(data)
        .then(() => {
          if (item.children) {
            getMenuList().then(({ list }) => {
              list.some((item: any) => {
                if (data.name === item.name) {
                  parent = item
                  return true
                }
              })
              new Promise((resolve) => {
                recursionAdd(item.children, 0, resolve, parent)
              }).then(() => {
                if (arr[index + 1]) {
                  recursionAdd(arr, index + 1, resolve, null)
                } else {
                  resolve()
                }
              })
            })
          } else {
            if (arr[index + 1]) {
              recursionAdd(arr, index + 1, resolve, parent)
            } else {
              resolve()
            }
          }
        })
        .catch(() => {
          if (arr[index + 1]) {
            recursionAdd(arr, index + 1, resolve, parent)
          } else {
            resolve()
          }
        })
    } else {
      updateMenu(data)
        .then(() => {
          if (item.children) {
            new Promise((resolve) => {
              recursionAdd(item.children, 0, resolve, data)
            }).then(() => {
              if (arr[index + 1]) {
                recursionAdd(arr, index + 1, resolve, null)
              } else {
                resolve()
              }
            })
          } else {
            if (arr[index + 1]) {
              recursionAdd(arr, index + 1, resolve, parent)
            } else {
              resolve()
            }
          }
        })
        .catch(() => {
          if (arr[index + 1]) {
            recursionAdd(arr, index + 1, resolve, parent)
          } else {
            resolve()
          }
        })
    }
  }

  ElMessageBox.confirm('此操作将比对并更新菜单, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    state.loading = true
    new Promise((resolve) => {
      recursionDel(menuList, 0, resolve, null)
    }).then(() => {
      new Promise((resolve) => {
        recursionAdd(routesList.value, 0, resolve, null)
      }).then(() => {
        getMenuList().then((data) => {
          state.list = data.list
          const list = [] as any
          data.list.forEach((item: any) => {
            list.push(item.id)
            if (item.children) {
              item.children.forEach((item: any) => {
                list.push(item.id)
              })
            }
          })
          setMenuForRole({
            id: 1,
            list,
          }).then(() => {
            state.loading = false
            // location.reload()
          })
        })
      })
    })
  })
}

// 页面加载时
onMounted(() => {
  getListData()
})
</script>
