import axios from "axios"

import { getToken as _getToken } from "../../use/useStorage"

const baseConfig: { method: "post" | "get"; baseURL: string; timeout: number } =
  {
    method: "post",
    baseURL: "",
    timeout: 1000 * 60 * 10, //10分钟
  }

try {
  getToken().then(async (token) => {
    // if (!token && router.currentRoute.name !== "login") {
    //   goLogin();
    // }
  })
} catch (err) {
  console.error(err)
} finally {
}

const createInstance = (config = {}) => {
  const ins = axios.create({
    ...baseConfig,
    ...config,
  })

  return ins
}

export default createInstance

export async function getToken() {
  const token = await _getToken()
  if (token === undefined) {
    //TODO: 生产环境下顶级窗口返回登录页面；开发环境下，返回本小系统的登录
  }
  return token
}
export function goLogin() {
  // Vue.controller.login();
}
