import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import UI from './assets/index'
import router from './router'
const app = createApp(App)
app.use(UI).use(router).mount('#app')
