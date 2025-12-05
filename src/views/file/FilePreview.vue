<!-- FilePreview.vue -->
<template>
    <div class="file-preview">
        <div class="preview-content">
            <!-- 图片预览 -->
            <div v-if="isImage" class="image-preview">
                <el-image
                    :src="previewUrl"
                    fit="contain"
                    style="max-height: 70vh;"
                >
                    <template #error>
                        <div class="preview-error">
                            <el-icon><Picture /></el-icon>
                            <p>图片加载失败</p>
                        </div>
                    </template>
                </el-image>
            </div>
            
            <!-- 文本预览 -->
            <div v-else-if="isText" class="text-preview">
                <pre>{{ fileContent }}</pre>
            </div>
            
            <!-- 不支持预览的文件类型 -->
            <div v-else class="unsupported-preview">
                <el-empty description="该文件类型不支持预览">
                    <el-button type="primary" @click="handleDownload">
                        下载文件
                    </el-button>
                </el-empty>
            </div>
        </div>
        
        <div class="preview-footer">
            <el-button @click="$emit('close')">关闭</el-button>
            <el-button type="primary" @click="handleDownload">下载</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
    file: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close'])

const fileContent = ref('')

const isImage = computed(() => {
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    return imageTypes.includes(props.file.extension)
})

const isText = computed(() => {
    const textTypes = ['txt', 'md', 'js', 'vue', 'css', 'html']
    return textTypes.includes(props.file.extension)
})

const previewUrl = computed(() => {
    // 这里应该是实际的文件预览URL
    return `/api/preview/${props.file.id}`
})

const handleDownload = () => {
    ElMessage.info(`开始下载: ${props.file.name}`)
    // 实际下载逻辑
}

onMounted(() => {
    // 模拟加载文件内容
    if (isText.value) {
        fileContent.value = '这是文件预览内容...\n实际项目中这里应该从服务器获取文件内容。'
    }
})
</script>

<style scoped>
.file-preview {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.preview-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.image-preview,
.text-preview,
.unsupported-preview {
    width: 100%;
    text-align: center;
}

.text-preview pre {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 4px;
    max-height: 60vh;
    overflow: auto;
    white-space: pre-wrap;
    text-align: left;
}

.preview-error {
    padding: 40px;
    color: #909399;
}

.preview-error .el-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.preview-footer {
    padding: 20px;
    text-align: center;
    border-top: 1px solid #f0f0f0;
}
</style>