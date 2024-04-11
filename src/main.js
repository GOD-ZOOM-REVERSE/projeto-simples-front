import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import routes from './routers'
import Router from 'vue-router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

axios.defaults.baseURL = 'https://localhost:44364'
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401 || error.response.status === 403) {
      // Redireciona para a página de login
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

const router = new Router({
  mode: 'history',
  routes
})


Vue.use(BootstrapVue).use(IconsPlugin).use(Router)

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const response = await axios.get('/account/Authorized');

      if (response.status === 200) {
        next();
      } else {
        next('/login');
      }
    } catch (error) {
      next('/login');
    }
  } else {
    next();
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})

