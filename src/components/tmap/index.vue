<template>
  <div class="dialog-container">
    <el-dialog title="地图定位" v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="formRef" size="default" label-width="80px">
        <el-row :gutter="35">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="详细地址">
              <el-input v-model="dataMap.address" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="经度">
              <el-input v-model="dataMap.latitude" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb20">
            <el-form-item label="纬度">
              <el-input v-model="dataMap.lngitude" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <el-form-item label="地址搜索">
              <el-autocomplete v-model="address" :fetch-suggestions="querySearch" placeholder="请输入地址关键字" :trigger-on-focus="false" @input="querySearch" class="w100" @select="handleSelect" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
            <div ref="mapRef" style="width: 750px;height:600px" />
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onConfirm" size="default">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { keywordSearch, getDetailByLocation } from '@/api/system/map/index'
const emit = defineEmits(['onChange'])

const isShowDialog = ref(false)

var map: any = null
var markerLayer: any = null

const mapRef = ref()
const dataMap = reactive({
  address: '',
  latitude: '', //纬度
  lngitude: '', //经度
})
const TMap = (window as any).TMap

// 打开弹窗
const openDialog = (latitude: any, lngitude: any, address: any) => {
  dataMap.address = address
  dataMap.latitude = latitude
  dataMap.lngitude = lngitude
  isShowDialog.value = true
  nextTick(() => {
    let center = new TMap.LatLng(latitude, lngitude)
    map = new TMap.Map(mapRef.value, {
      center: center, //设置地图中心点坐标
      zoom: 17, //设置地图缩放级别
      viewMode: '2D',
    });
    map.on('click', clickHandler) // 绑定点击地图获取地理位置的事件
    onMarkerLayer() // 标记地图
  })
}

// 取消
const onCancel = () => {
  map.destroy()
  isShowDialog.value = false
}



const onConfirm = () => {
  emit('onChange', dataMap)
  onCancel()
}



// 点击获取经纬度
const clickHandler = (evt: any) => {
  dataMap.latitude = evt.latLng.getLat().toFixed(6)
  dataMap.lngitude = evt.latLng.getLng().toFixed(6)
  map.setCenter(new TMap.LatLng(dataMap.latitude, dataMap.lngitude))
  getAddressByLocation()
  updateMarkerLayer()
}

//标记地图
const onMarkerLayer = () => {
  markerLayer = new TMap.MultiMarker({
    map: map, //指定地图容器
    //样式定义
    styles: {
      myStyle: new TMap.MarkerStyle({
        width: 25, // 点标记样式宽度（像素）
        height: 35, // 点标记样式高度（像素）
        background: 'pink',
        anchor: { x: 16, y: 32 },
      }),
    },
    //点标记数据数组
    geometries: [
      {
        id: '1', //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
        styleId: 'myStyle', //指定样式id
        position: new TMap.LatLng(dataMap.latitude, dataMap.lngitude), //点标记坐标位置
      },
    ],
  })
}


//更新标记
const updateMarkerLayer = () => {
  markerLayer.updateGeometries([
    {
      "styleId": "myStyle",
      "id": "1",
      "position": new TMap.LatLng(dataMap.latitude, dataMap.lngitude),
    }
  ])
}




const address = ref('')

//查询关键字
const querySearch = async (queryString: string, callback: any) => {
  try {
    let params = {
      keyword: queryString,
    }
    let { data } = await keywordSearch(params)
    const results = data.map((item: any) => {
      let obj = {
        value: item.address,
        address: item.address,
        location: item.location,
      }
      return obj
    })
    if (callback) {
      callback(results)
    }
  } catch (e) {
    console.log(e)
  }
}

//点击选择关键字
const handleSelect = (val: any) => {
  dataMap.latitude = val.location.lat.toFixed(6)
  dataMap.lngitude = val.location.lng.toFixed(6)
  map.setCenter(new TMap.LatLng(dataMap.latitude, dataMap.lngitude))
  dataMap.address = val.address
  updateMarkerLayer()
}

//根据经纬度获取地址
const getAddressByLocation = async () => {
  try {
    let params = {
      location: dataMap.latitude + ',' + dataMap.lngitude,
    }
    let { result } = await getDetailByLocation(params)
    if (result.address) {
      dataMap.address = result.address + result.formatted_addresses.recommend
    }
  } catch (e) {
    console.log(e)
  }
}


// 暴露变量
defineExpose({
  openDialog,
})
</script>
