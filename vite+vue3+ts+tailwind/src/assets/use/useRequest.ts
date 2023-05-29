import type { Ref, ComputedRef } from "vue"
import { ref, computed, unref, reactive } from "vue"
import { erp_fetch, microShop_fetch, member_fetch, log_fetch } from "../fetch"
import controller from "../plugin/controller"
export interface RequestOptions<T> {
  api: string | Ref<string>
  app?: "microShop" | "member" | "log"
  para?: Record<string, any>
  manual?: boolean
  pageSize?: number | Ref<number>
  hasPager?: boolean
  //有分页的情况下，field用来指定数据字段名
  field?: {
    data?: string
    total?: string
  }
  afterGetData?: (res?: T) => void
  beforeReq?: (opts: Record<string, any>) => Record<string, any>
  preprocess?: (opts: T) => T
  isBlob?: boolean
  filename?: string
}
export default function useRequest<T>(
  options: RequestOptions<T> = {
    api: "",
    para: {},
    isBlob: false,
    filename: undefined,
  }
) {
  let fetch_app = erp_fetch
  if (options.app?.toLowerCase() === "microshop") {
    fetch_app = microShop_fetch
  } else if (options.app === "member") {
    fetch_app = member_fetch
  } else if (options.app === "log") {
    fetch_app = log_fetch
  }
  const loading = ref(false)
  const data = ref<T>()
  const total = ref(0)
  const pager = reactive({
    pageIndex: 1,
    pageSize: options.pageSize || 20,
  })
  const _para = computed(() => {
    const obj = { ...options.para }
    if (options.hasPager) {
      return Object.assign(obj, pager)
    }
    return obj
  })
  const _field = computed(() => {
    if (options.hasPager) {
      return {
        data: options.field?.data || "data",
        total: options.field?.total || "total",
      }
    }
  })

  async function getData(opts?: Record<string, any>) {
    try {
      if (loading.value) {
        return
      }
      let setting = opts || { ..._para.value }
      if (options.beforeReq) {
        setting = await options.beforeReq(setting)
      }
      loading.value = true
      // console.log(options.isBlob, options.filename)
      const res_original = await fetch_app<T>({
        api: unref(options.api),
        para: setting,
        isBlob: options.isBlob,
        filename: options.filename,
      })
      // console.log(res_original)
      const res = (options.preprocess?.(res_original) ||
        res_original) as Awaited<T>

      if (options.hasPager) {
        if (_field.value) {
          //这里的类型怎么定义？
          const _res = res as any
          data.value = _res[_field.value.data]
          total.value = _res[_field.value.total]
          options.afterGetData?.(data.value)
        }
      } else {
        data.value = res
        options.afterGetData?.(res)
      }
      return res
    } catch (err) {
      const _e = err as { status: number; msg: string }
      throw new Error(_e.msg)
      // if (_e.status === 1) {
      //   setTimeout(() => {
      //     controller.login()
      //   })
      // }
    } finally {
      loading.value = false
    }
  }

  function changePageIndex(p: number, isForce = false) {
    if (p !== pager.pageIndex) {
      pager.pageIndex = p
      getData()
    } else if (isForce) {
      getData()
    }
  }

  function changePageSize(s: number) {
    if (s !== pager.pageSize) {
      pager.pageSize = s
      changePageIndex(1, true)
    }
  }

  function setLoading(b: boolean) {
    loading.value = b
  }

  if (!options.manual) {
    getData()
  }

  return {
    loading,
    data,
    total,
    pager,
    getData,
    setLoading,
    changePageIndex,
    changePageSize,
  }
}
