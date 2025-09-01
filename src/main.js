import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '../public/root.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.config.devtools = false
app.config.performance = false



app.mount('#app')
