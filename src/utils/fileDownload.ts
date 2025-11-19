// utils/fileDownload.js
import { ElMessage } from 'element-plus'

/**
 * 修复版PDF下载方法
 */
export const downloadPdfFromStream = async (response:any, filename = 'document.pdf') => {
  try {
    // 检查响应数据
    if (!response ) {
      throw new Error('响应数据为空')
    }
    
    // 检查是否是Blob类型
    if (!(response instanceof Blob)) {
      throw new Error('响应数据不是Blob格式')
    }
    
    // 检查文件大小
    if (response.size === 0) {
      throw new Error('文件大小为0，可能是空文件')
    }
    
    // 验证PDF文件头
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer.slice(0, 4))
    const fileHeader = Array.from(uint8Array).map(b => b.toString(16)).join('')
    
    // PDF文件头应该是 '%PDF' 的十六进制表示
    if (fileHeader !== '25504446' && fileHeader !== '255044462d') {
      console.warn('文件头不匹配，可能不是有效的PDF文件:', fileHeader)
      // 不抛出错误，因为有些PDF可能有不同的头
    }
    
    // 重新创建Blob确保完整性
    const blob = new Blob([arrayBuffer], { 
      type: 'application/pdf' 
    })
    
    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = downloadUrl
    link.download = filename
    link.style.display = 'none'
    
    // 添加到DOM并触发点击
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 释放URL对象
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl)
    }, 100)
    
    console.log('文件下载成功，大小:', blob.size, '字节')
    return true
    
  } catch (error:any) {
    console.error('文件下载失败:', error)
    ElMessage.error(`文件下载失败: ${error.message}`)
    return false
  }
}

