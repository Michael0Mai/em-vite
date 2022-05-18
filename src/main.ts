import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import './styles/index.scss'
// eslint-disable-next-line quotes
import elementPlus from "./plugins/element-plus"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import components from './components/index' // 自动注册全局组件

const app = createApp(App)

for (const name in ElementPlusIconsVue) {
  app.component(name, (ElementPlusIconsVue as any)[name])
}

// 自动注册全局组件
// const modules = import.meta.globEager('./components/**/index.ts')
// for (const path in modules) {
//   app.use(modules[path].default)
//   console.log(modules)
// }

app.use(router)
app.use(store, key)
  .use(elementPlus)
  .use(components)
  .mount('#app')
