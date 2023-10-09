import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css'; // Choose a theme
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/sass/common.scss'
import Routes from './routes/routes';
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(PrimeVue);
Vue.use(VueRouter)

const  router = new VueRouter({
  routes: Routes,
  mode: 'history'
})

new Vue({
  router: router,
  store: store,
  render: h => h(App),
}).$mount('#app')
