import { error, warning, success } from "../../components/notice"

const time = 3000
export default function (
  res: any,
  { isSuccessTip, isFd = false }: { isSuccessTip?: boolean; isFd?: boolean }
) {
  return new Promise((resolve, reject) => {
    const status = res.data.status

    switch (status) {
      case 0:
        if (isSuccessTip && res.data.msg) {
          success(res.data.msg)
        }
        if (isFd) {
          resolve(res.data)
        } else {
          resolve(res.data.data)
        }
        break
      case 1:
        if (res.data.msg) {
          error(res.data.msg)
        }
        reject(res.data)
        break

      case -1:
        error(res.data.msg)
        reject(res)
        break
      case 2:
        if (res.data.msg) {
          error(res.data.msg || res.msg)
        } else if (res.data.data && res.data.data.length) {
          // main.manualTip(res.data.data)
        }
        reject(res.data)
        break
      case 3:
        error(res.data.msg)
        reject(res.data)
        break
      //4是需要后台验证状态，
      //返回的Data，如果有数据，则展示出来
      case 4:
        resolve({
          data: res.data.data,
          status: res.data.status,
        })
        break
      default:
        // Vue.tips({
        //   content:res.data.Message,
        //   type: 'error'
        // }).hide(3000)
        reject(res.data.msg || res.msg)
    }
  })
}
