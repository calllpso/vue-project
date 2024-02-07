import './assets/main.sass'
import Antd from 'ant-design-vue'
import vuetify from './plugins/vuetify'


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'




const pinia = createPinia()
const app = createApp(App)


// app.use(router).mount('#app')

app.use(router).use(Antd).use(vuetify).use(pinia)
app.mount('#app')
