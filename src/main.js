import Vue from 'vue'
import App from './App.vue'
import axios from './http'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.axios = axios;

new Vue({
  el: "#app",
  axios,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
