import PageTools from './PageTools'
// 插件是一个对象，必须提供install方法
// 1、在Vue.use后，会自动调用插件的install方法
// 2、indtall方法中，可以提供组件全局注册的代码
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
  }
}
