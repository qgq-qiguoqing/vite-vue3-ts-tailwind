import createInstance from "./createFetch"
import { getToken } from "./createFetch"
import handleResponse from "./handleResponse"
import md5 from "md5"
// import config from "../../config/apiConfig"
import { type IParaOptions } from "../types"
import controller from "../../plugin/controller"
import { error } from "../../components/notice"
import download from "./blob"
const SIGN = "LinkDuoo.Sign"

interface IRes {
  data: any
  status: number
  msg: string
}
interface IErr {
  message: string
}

declare global {
  interface Window {
    useCooLink: any
    __CONFIG__: {
      url: string
      wx3rd_url: string
      alpay3rd_url: string
      microshop_url: string
      member_url: string
      log_url: string
      serviceCustomerFlag: number
    }
  }
}

export default function erp_fetch<T>(
  {
    baseUrl,
    api,
    para,
    loading,
    loadingText,
    type,
    isSuccessTip,
    onUploadProgress,
    isBlob,
    filename,
  }: IParaOptions = {
    api: "",
    type: "json",
    filename: "",
  }
) {
  return new Promise<T>(async (resolve, reject) => {
    // const token = await Promise.resolve(getToken())
    const token = await getToken().then((d) => d)

    const timestamp = parseInt(String(new Date().getTime() / 1000))

    const ins = createInstance({
      baseURL: baseUrl || window.__CONFIG__.url,
      headers: {
        "Content-Type": "application/json",
        token,
        timestamp,
        signature: md5(SIGN + timestamp),
        responseType: isBlob ? "blob" : "",
      },
    })

    ins.interceptors.response.use((res) => {
      return res
    })
    ins.interceptors.request.use((_res) => {
      if (isBlob) {
        _res.responseType = "blob"
      }
      return _res
    })
    try {
      const res = await ins.request({
        url: api,
        data: para,
        onUploadProgress: onUploadProgress,
      })

      if (isBlob) {
        download(res, filename)

        resolve("" as T)
      } else {
        const _res: any = await handleResponse(res, { isSuccessTip })
        resolve(_res as T)
      }
    } catch (err) {
      const _e = err as IErr & IRes
      if (_e && _e.message) {
        error(_e.message)
      }
      if (_e.status === 1) {
        setTimeout(() => {
          controller.login()
        })
      }
      reject(err)
    } finally {
      // loading && Vue.loading().hide()
    }
  })
}
