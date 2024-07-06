/* eslint-disable  */
// import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import '@styles/styles.scss'
import axios from 'axios'
import { createPinia } from 'pinia'
import createPersistedState from 'pinia-plugin-persistedstate'
import ToastPlugin from "vue-toast-notification";
//import Form from 'vform'

import { createApp, markRaw } from 'vue'

window.axios = axios
window.axios.defaults.baseURL = 'https://api-manguangua-dev.premierpluss.com/api';//"http://192.168.0.20:8080/api";
window.axios.defaults.headers.common['Accept'] = 'application/json'
window.axios.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8'
window.axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
window.axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
//window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
//window.axios.defaults.withCredentials = true

const pinia = createPinia()
pinia.use((store) => {
    store.router = markRaw(router)
})
pinia.use(createPersistedState)

loadFonts()


// Create vue app
const app = createApp(App)

app.config.globalProperties.$filters = {
    estatusName(statusId){
        if(statusId == 0) return ''
        if(statusId == 1) return 'Activo'
        if(statusId == 2) return 'Inactivo'
        if(statusId == 3) return 'Bloquedo'
    }
}

// Use plugins
app.use(vuetify)
app.use(pinia)//use(createPinia())
app.use(router)
app.use(ToastPlugin);

// Mount vue app
app.mount('#app')
