import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import './assets/theme.css'

if (localStorage.getItem('tema') === 'escuro') {
  document.documentElement.dataset.tema = 'escuro'
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
