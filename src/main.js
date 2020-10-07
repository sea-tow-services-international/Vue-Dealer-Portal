import Vue from 'vue'
import App from './App.vue'
import Vuelidate from 'vuelidate'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuelidate)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
}).$mount('#app')
