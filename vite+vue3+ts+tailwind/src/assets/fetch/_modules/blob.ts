import type { AxiosResponse } from "axios"

/**
 * 下载Excel文件
 * @param res Axios响应对象
 * @param filename 文件名
 */
export default function downloadExcelFile(
  res: AxiosResponse<any, any>,
  filename?: string
) {
  try {
    // 如果未提供文件名，则使用默认文件名
    if (!filename) {
      filename = "file"
    }

    // 检查是否有数据可供下载
    if (!res.data) {
      throw new Error("Response data is empty.")
    }

    // 创建Blob对象
    const blob = new Blob([res.data])
    console.log(blob, res)

    // 创建下载链接
    const downloadElement = document.createElement("a")
    const href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = `${filename}.xlsx`

    // 将下载链接添加到DOM中并触发下载
    document.body.appendChild(downloadElement)
    downloadElement.click()

    // 下载完成后移除下载链接并释放Blob对象
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
  } catch (error) {
    console.log(error)
  }
}
