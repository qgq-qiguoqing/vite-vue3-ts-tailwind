import { type PropType, defineComponent, ref, watch, unref } from 'vue'
import useRequest from './use/useRequest'
import * as dictionary from './dictionary/index'

export default defineComponent({
  name: 'Req',
  inheritAttrs: false,
  props: {
    app: { type: String as PropType<'microShop' | 'member' | 'log'> }, //指明子系统，没有时，默认是erp
    api: { type: String },
    para: { type: Object, default: () => ({}) },
    manual: Boolean,
    pageSize: { type: Number, default: 20 },
    hasPager: Boolean,
    afterGetData: { type: Function as PropType<(res: unknown) => void> },
    field: {
      type: Object as PropType<{
        data?: string
        total?: string
      }>,
      default: () => ({ data: 'list', total: 'total' }),
    },
    beforeReq: {
      type: Function as PropType<
        (obj: Record<string, any>) => Record<string, any>
      >,
    },
    preprocess: {
      type: Function as PropType<
        (obj: Record<string, any>) => Record<string, any>
      >,
    },
    refresh: {
      type: Number,
      default: 1,
    },
  },
  setup(props, { emit, slots }) {
    const _api = ref(props.api ?? '')
    const all = useRequest({
      ...props,
      api: _api,
    })

    watch(
      () => props.api,
      (a) => {
        _api.value = a ?? ''
      }
    )
    watch(
      () => props.refresh,
      (v) => {
        all.changePageIndex(1, true)
      }
    )

    return () => {
      const unrefs = {
        loading: unref(all.loading),
        data: unref(all.data),
        total: unref(all.total),
      }
      const options = {
        ...all,
        ...unrefs,
        dictionary,
      }
      return <>{slots.default?.(options)}</>
    }
  },
})
