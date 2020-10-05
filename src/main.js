import Vue from 'vue'

import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VuePaycard from 'vue-paycard'


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
Vue.use(VuePaycard)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')


