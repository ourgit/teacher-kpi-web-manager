declare global {
  interface Window {
    [index: string]: any
  }
}

type queryType = {
  [index: string]: any
}

export default function jsonp(
  url: string,
  query: queryType = {},
  callback: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    // 创建一个script
    const script = document.createElement('script')

    // 字符串拼接生成基本url
    let baseUrl = `${url}?callback=${callback}`

    // 遍历query对象拼接参数到url后
    for (const item in query) {
      baseUrl += `&${item}=${query[item]}`
    }

    // jsonp核心，通过script的跨域特性发出请求
    script.src = baseUrl

    // 给window添加属性，用于获取jsonp结果
    window[callback] = (res: any) => {
      if (res) {
        resolve(res)
      } else {
        reject('未查询到任何数据')
      }
      // 删除window下属性
      delete window[callback]
      // 得到结果后删除创建的script
      document.body.removeChild(script)
    }

    // 动态创建script标记，错误的监听
    script.addEventListener('error', () => {
      delete window[callback]
      document.body.removeChild(script)
      reject('请求失败！')
    })

    // 把创建的script挂载到DOM
    document.body.appendChild(script)
  })
}
