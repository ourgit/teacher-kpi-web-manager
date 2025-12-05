<template>
    <div class="page-container layout-padding">
        <!-- 搜索栏 -->
        <div class="search-container">
            <el-input 
                v-model="searchPath" 
                placeholder="请输入路径" 
                class="search-input"
                @keyup.enter="handleSearch"
            />
            <el-button 
                type="primary"
                class="search-button"
                @click="handleSearch"
            >
                <el-icon><Search /></el-icon>
                <span>搜索</span>
            </el-button>
            <el-button 
                type="danger"
                class="search-button"
                @click="handleBack"
            >
                <el-icon><ArrowLeft /></el-icon>
                <span>后退</span>
            </el-button>
        </div>

        <!-- 存储空间信息 -->
        <el-card class="storage-info-card">
            <div class="storage-stats">
                <div class="storage-item">
                    <span class="label">总空间:</span>
                    <span class="value">{{ formatBytes(totalSpace) }}</span>
                </div>
                <div class="storage-item">
                    <span class="label">可用空间:</span>
                    <span class="value">{{ formatBytes(usableSpace) }}</span>
                </div>
                <div class="storage-item">
                    <span class="label">空闲空间:</span>
                    <span class="value">{{ formatBytes(freeSpace) }}</span>
                </div>
                <div class="storage-progress">
                    <el-progress 
                        :percentage="storagePercentage" 
                        :stroke-width="8"
                        :show-text="false"
                    />
                    <span class="usage-text">已使用: {{ usedSpacePercentage }}%</span>
                </div>
            </div>
        </el-card>

        <!-- 文件列表 -->
        <div class="file-list">
            <div 
                v-for="item in filteredList" 
                :key="item.fileName"
                class="file-item"
                :class="{ 
                    'directory': item.isDirectory,
                    'file': item.isFile,
                    'hidden': item.isHidden
                }"
                @click="handleItemClick(item)"
                @dblclick="handleItemDoubleClick(item)"
            >
                <div class="item-icon">
                    <el-icon 
                        :size="24" 
                        :color="getItemColor(item)"
                    >
                        <component :is="getItemIcon(item)" />
                    </el-icon>
                    <el-tag 
                        v-if="item.isHidden" 
                        size="small" 
                        effect="plain"
                        class="hidden-tag"
                    >
                        隐藏
                    </el-tag>
                </div>
                
                <div class="item-info">
                    <div class="item-name">
                        {{ item.fileName }}
                        <el-tag 
                            v-if="item.canRead" 
                            size="small" 
                            type="warning"
                            plain
                        >
                            可读
                        </el-tag>
                        <el-tag 
                            v-if="item.canWrite" 
                            size="small" 
                            type="danger"
                            plain
                        >
                            可写
                        </el-tag>
                        <el-tag 
                            v-if="item.canExecute" 
                            size="small" 
                            type="primary"
                            plain
                        >
                            可执行
                        </el-tag>
                    </div>
                    <div class="item-details">
                        <span class="size">{{ formatSize(item.size) }}</span>
                        <span class="separator">•</span>
                        <span class="time">{{ item.lastModified }}</span>
                        <span class="separator">•</span>
                        <span class="path" :title="item.parentFileName">
                            位置: {{ getShortPath(item.parentFileName) }}
                        </span>
                    </div>
                </div>
                
                <div class="item-actions">
                    <el-button 
                        v-if="item.isFile && item.canRead" 
                        type="primary" 
                        link 
                        size="small"
                        @click.stop="handleDownload(item)"
                    >
                        <el-icon><Download /></el-icon>
                        下载
                    </el-button>
                    
                    <el-button 
                        type="danger" 
                        link 
                        size="small"
                        @click.stop="handleDelete(item)"
                    >
                        <el-icon><Delete /></el-icon>
                        删除
                    </el-button>
                </div>
            </div>
            <div class="page-bottom">
                <el-pagination v-model:currentPage="currentPage" background layout="prev, pager, next, jumper" :page-count="totalPage" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </div>
        <!-- 空状态 -->
        <div v-if="filteredList.length === 0" class="empty-state">
            <el-empty description="暂无文件或文件夹" />
        </div>
        <el-upload 
        v-model:file-list="uploadFileList"
        ref="upload" 
        action="" 
        :on-change="onImport" drag :auto-upload="false" :on-success="handleSuccess" :show-file-list="false">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖入文件于此或 <em>点击上传</em>
            </div>
            <template #tip>
                <div class="file-tags-container">
                <div v-if="uploadFileList.length > 0" class="selected-files">
                    <h4>已选择文件 ({{ uploadFileList.length }}):</h4>
                    <div class="file-tags">
                    <el-tag 
                        v-for="(file, index) in uploadFileList" 
                        :key="index"
                        class="file-tag"
                        closable
                        @close="removeFile(index)"
                        :type="getFileTagType(file)"
                    >
                    <el-icon class="file-icon">
                    <component :is="getFileIcon(file)" />
                    </el-icon>
                    {{ file.name }}
                    </el-tag>
            </div>
          </div>
          <div v-else class="empty-tip">
            没有上传的文件
          </div>
        </div>
            </template>
        </el-upload>
        <div class="action-buttons" v-if="uploadFileList.length > 0">
            <el-button type="primary" @click="handleUpload" :loading="uploading">
                <el-icon><UploadFilled /></el-icon>
                {{ uploading ? '添加中...' : '开始添加' }}
            </el-button>
            <el-button @click="clearFiles">
                <el-icon><Delete /></el-icon>
                清空列表
            </el-button>
        </div>
        
    </div>
</template>

<script setup>
import { ref, computed, onMounted,reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getFileList,addFile,deleteFile} from '@/api/file/index'

import { 
    Search, 
    Folder, 
    Document, 
    Download, 
    Delete, 
    VideoPlay,
    UploadFilled,
    ArrowLeft
} from '@element-plus/icons-vue'

const locate = ref("http://120.48.81.209")

// 响应式数据
const upload = ref()
const uploading = ref(false)
const searchPath = ref('')
const uploadFileList=ref([])
const currentPage=ref(1)
const totalPage=ref(1)
const fileData = ref({
    list: [],
    totalSpace: '0 bytes',
    usableSpace: '0 bytes',
    freeSpace: '0 bytes'
})

const fileList = ref([])
const folderPath = ref('')

const onImport = (file) => {
  // 过滤重复文件
  const isDuplicate = uploadFileList.value.some(
    existingFile => existingFile.name === file.name && existingFile.size === file.size
  )
  
  if (!isDuplicate) {
    uploadFileList.value.push(file.row)
  } else {
    ElMessage.warning(`文件 ${file.name} 已存在`)
  }
}

// 移除文件
const removeFile = (index) => {
  uploadFileList.value.splice(index, 1)
}
const getFileIcon = (file) => {
  const name = file.name.toLowerCase()
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || 
      name.endsWith('.png') || name.endsWith('.gif')) {
    return Picture
  }
  if (name.endsWith('.mp4') || name.endsWith('.avi') || name.endsWith('.mov')) {
    return VideoCamera
  }
  if (name.endsWith('.mp3') || name.endsWith('.wav')) {
    return Music
  }
  return Document
}
const getFileTagType = (file) => {
  const name = file.name.toLowerCase()
  if (name.endsWith('.jpg') || name.endsWith('.jpeg') || 
      name.endsWith('.png') || name.endsWith('.gif')) {
    return 'success' // 图片用绿色
  }
  if (name.endsWith('.pdf')) {
    return 'danger' // PDF用红色
  }
  if (name.endsWith('.doc') || name.endsWith('.docx')) {
    return 'primary' // Word用蓝色
  }
  return 'info' // 其他用灰色
}

const handleSuccess = (response) => {
  if (response.code === 200) {
     ElMessage({
      message: "上传成功",
      type: 'success',
    })
  } else {
    ElMessage({
      message: response.reason,
      type: 'error',
    })
  }
}
const handleBack=()=>{
    //ElMessage.info(`回退到上一个文件夹`)
    const parts = searchPath.value.split('/').filter(Boolean);
    if (parts.length > 1) {
        parts.pop(); // 移除最后一级
        searchPath.value='/' + parts.join('/') + '/';
    }else{
        searchPath.value='/';
    }
    loadFolderContent()
}

// 计算属性
const filteredList = computed(() => {
        return fileData.value.list
})

const totalSpace = computed(() => parseBytes(fileData.value.totalSpace))
const usableSpace = computed(() => parseBytes(fileData.value.usableSpace))
const freeSpace = computed(() => parseBytes(fileData.value.freeSpace))

const storagePercentage = computed(() => {
    if (totalSpace.value === 0) return 0
    return Math.round(((totalSpace.value - usableSpace.value) / totalSpace.value) * 100)
})

const usedSpacePercentage = computed(() => {
    return storagePercentage.value
})

const currentPath = computed(() => {
    return fileData.value.list.length > 0 ? fileData.value.list[0].parentFileName : ''
})

// 工具函数
const parseBytes = (sizeStr) => {
    const match = sizeStr.match(/(\d+(\.\d+)?)\s*bytes?/i)
    return match ? parseInt(match[1]) : 0
}

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatSize = (sizeStr) => {
    const bytes = parseBytes(sizeStr)
    return formatBytes(bytes)
}

const getItemIcon = (item) => {
    if (item.isDirectory) return Folder
    return Document
}

const getItemColor = (item) => {
    if (item.isDirectory) return '#e6a23c' // 文件夹橙色
    if (item.isHidden) return '#909399'   // 隐藏文件灰色
    return '#409eff'                      // 普通文件蓝色
}

const getShortPath = (path) => {
    if (path.length > 30) {
        return path.substring(0, 15) + '...' + path.substring(path.length - 15)
    }
    return path
}

// 事件处理
const handleSearch = () => {
    // 这里可以调用API搜索特定路径
    //ElMessage.info(`搜索路径: ${searchPath.value}`)
    loadFolderContent()
}

const handleItemClick = (item) => {
    if (item.isDirectory) {
        //ElMessage.info(`点击文件夹: ${item.fileName}`)
        // 实际应该加载该文件夹内容
    } else {
        //ElMessage.info(`点击文件: ${item.fileName}`)
    }
}

const handleItemDoubleClick = (item) => {
    if (item.isDirectory) {
        //ElMessage.info(`进入文件夹: ${item.fileName}`)
        // 加载文件夹内容
        searchPath.value=searchPath.value +item.fileName+"/"
        loadFolderContent()
    } else if (item.isFile && item.canExecute) {
        handleExecute(item)
    }
}

const handleDownload = (item) => {
    if (!item.canRead) {
        //ElMessage.warning('没有读取权限')
        return
    }
    //ElMessage.success(`开始下载: ${item.fileName}`)
    // 实际下载逻辑
    const link = document.createElement('a')
    const url=locate.value+searchPath.value+item.fileName
    link.href = url
    link.download = item.fileName
    link.target = '_blank' // 新窗口打开
  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  
    ElMessage.success(`正在下载: ${item.fileName}`)
}

const handleExecute = (item) => {
    if (!item.canExecute) {
        //ElMessage.warning('没有执行权限')
        return
    }
    //ElMessage.info(`执行文件: ${item.fileName}`)
    // 实际执行逻辑
}

const handleDelete = async (item) => {
    
    try {
        await ElMessageBox.confirm(
            `确定要删除 "${item.fileName}" 吗？`,
            '删除确认',
            {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }
        )
        deleteFile({
            filePath:searchPath.value+"/"+item.fileName
        }).then(data=>{
            // 从列表中移除
            fileData.value.list = fileData.value.list.filter(i => i.fileName !== item.fileName)
            ElMessage.success('删除成功')
        }).catch(e=>{
            console.error(e)
        })
    } catch {

    }
}

const handleUpload =async () =>{
    if (uploadFileList.value.length === 0) {
        ElMessage.warning('请先选择文件')
        return
    }

    uploading.value = true
  
    try {
        for (const file of uploadFileList.value) {
            const formData = new FormData()
            formData.append('file', file.raw)
            formData.append('folderPath', searchPath.value) // 根据您的后端接口添加

            await addFile(formData) 
                .then(data=>{
                    filteredList.value.push(...data.list)
                    ElMessage.success(file.raw.name+` 上传成功`)
                }).catch(e=>{
                    ElMessage.error(file.raw.name+` 上传失败: `+e)
                })
        }
        ElMessage.success(`成功上传 ${uploadFileList.value.length} 个文件`)
        clearFiles()
    } catch (error) {
        ElMessage.error(error.message)
    } finally {
        uploading.value = false
    }
}
const clearFiles = () => {
  uploadFileList.value = []
  if (upload.value) {
    upload.value.clearFiles()
  }
}

const handleSizeChange = () => {
  loadFolderContent()
}

const handleCurrentChange = () => {
  loadFolderContent()
}

// 模拟API调用
const loadFolderContent = () => {
        // 使用您提供的模拟数据
        getFileList({
            folderPath:searchPath.value,
            start:currentPage.value,
            size:5
        }).then(data=>{
            if(data.code==200){
                fileData.value={
                    "code":data.code,
                    "list":data.list,
                    "totalSpace":data.totalSpace,
                    "usableSpace":data.usableSpace,
                    "freeSpace":data.freeSpace
                }
                totalPage.value=data.pages
            }else{
                fileData.value = {
                    "code": 200,
                    "list": [
                    {
                        "fileName": "123.txt",
                        "canExecute": true,
                        "isFile": true,
                        "size": "0 bytes",
                        "parentFileName": path || "E:\\teacher_test",
                        "canRead": true,
                        "canWrite": true,
                        "lastModified": "2025-12-04 15:05:35",
                        "isDirectory": false,
                        "isHidden": false
                    },
                    {
                        "fileName": "teacher_file",
                        "canExecute": true,
                        "isFile": false,
                        "size": "4096 bytes",
                        "parentFileName": path || "E:\\teacher_test",
                        "canRead": true,
                        "canWrite": true,
                        "lastModified": "2025-11-27 10:52:04",
                        "isDirectory": true,
                        "isHidden": false
                    },
                    {
                        "fileName": "config.ini",
                        "canExecute": false,
                        "isFile": true,
                        "size": "1024 bytes",
                        "parentFileName": path || "E:\\teacher_test",
                        "canRead": true,
                        "canWrite": false,
                        "lastModified": "2025-11-20 09:15:22",
                        "isDirectory": false,
                        "isHidden": true
                    }
                    ],
                    "totalSpace": "240055742464 bytes",
                    "usableSpace": "232521670656 bytes",
                    "freeSpace": "232521670656 bytes"
                }
            }
            console.log(fileData.value)
        }).catch(error=>{
            ElMessage.error('加载文件列表失败')
            console.error('API错误:', error)
        })
}

// 生命周期
onMounted(() => {
    searchPath.value='/'
    loadFolderContent()
})
</script>

<style scoped>
.search-container {
    display: flex;
    width: 100%;
    margin-bottom: 20px;
    gap: 0;
}

.search-input {
    flex: 1;
}

.search-button {
    width: auto;
    min-width: 100px;
    white-space: nowrap;
}

.storage-info-card {
    margin-bottom: 20px;
}

.storage-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.storage-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.storage-item .label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
}

.storage-item .value {
    font-weight: 600;
    color: #409eff;
}

.storage-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    max-width: 200px;
}

.usage-text {
    font-size: 12px;
    color: #606266;
    min-width: 80px;
}

.file-list {
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    margin-bottom: 20px;
}

.file-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.3s;
}

.file-item:hover {
    background-color: #f5f7fa;
}

.file-item:last-child {
    border-bottom: none;
}

.file-item.directory {
    background-color: #f8f9fa;
}

.file-item.hidden {
    opacity: 0.7;
}

.item-icon {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-right: 12px;
    flex-shrink: 0;
}

.hidden-tag {
    font-size: 10px;
}

.item-info {
    flex: 1;
    min-width: 0;
}

.item-name {
    font-weight: 600;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.item-details {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #909399;
    flex-wrap: wrap;
}

.separator {
    color: #dcdfe6;
}

.path {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-actions {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
}

.empty-state {
    padding: 40px 0;
    text-align: center;
}

.current-path {
    text-align: center;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
    margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .page-container {
        padding: 10px;
    }
    
    .storage-stats {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .storage-progress {
        max-width: 100%;
        width: 100%;
    }
    
    .file-item {
        padding: 8px 12px;
        flex-direction: column;
        align-items: flex-start;
    }
    
    .item-icon {
        margin-right: 0;
        margin-bottom: 8px;
    }
    
    .item-actions {
        margin-top: 8px;
        width: 100%;
        justify-content: flex-end;
    }
    
    .item-details {
        gap: 4px;
    }
}
</style>