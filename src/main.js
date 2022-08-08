import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './element'                                // element-ui组件库
import 'font-awesome/css/font-awesome.min.css'    // font-awesome 字体图标库
import axios from 'axios';                        // 异步数据交互
import './echarts'                                // 图表工具库
import './common'                                 // 通用逻辑
import VueQuillEditor from 'vue-quill-editor';     // 富文本框
// import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

Vue.config.productionTip = false
// 将 axios挂载在 Vue原型链上
Vue.prototype.$axios = axios;
// 配置 axios基本请求路径 （全局配置）
axios.defaults.baseURL = 'http://127.0.0.1:8089/';
Vue.use(VueQuillEditor);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
