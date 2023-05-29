import { defineAsyncComponent as dac } from "vue"
import type { App } from "vue"
export default {
    install(app: App) {
        app
            .component(
                "SReq",
                dac(() => import(/* webpackChunkName:'layout' */ "./SReq"))
            )
    }
}