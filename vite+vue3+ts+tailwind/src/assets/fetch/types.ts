export interface IParaOptions {
  api: string
  baseUrl?: string
  para?: Record<any, any>
  loading?: boolean
  loadingText?: string
  isSuccessTip?: boolean
  isBlob?: boolean
  filename?: string
  onUploadProgress?: any
  type?: 'formdata' | 'json'
}
