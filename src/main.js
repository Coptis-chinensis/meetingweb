import Vue from 'vue'
import ElementUI from 'element-ui'
import './style/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import {message} from './js/resetMessage'
import App from './App.vue'
import router from './router/router'
import './utils/directives' // 可拖动

Vue.use(ElementUI)

Vue.prototype.$echarts = echarts
Vue.prototype.$message = message

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
