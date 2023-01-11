import Vue from 'vue'

import 'normalize.css/normalize.css' // 默认样式

import ElementUI from 'element-ui' // elementUI组件
import 'element-ui/lib/theme-chalk/index.css' // elementUI框架的css
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n语言包 默认引入英文

import '@/styles/index.scss' // global css全局的css文件

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon项目内的小图标
import '@/permission' // permission control

import components from './components'
Vue.use(components)

// set ElementUI lang to EN
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

import * as directiveObj from '@/directives'
for (const key in directiveObj) {
  Vue.directive(key, directiveObj[key])
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
