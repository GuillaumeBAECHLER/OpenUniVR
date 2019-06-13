import Vue from 'vue'
import VueRouter from 'vue-router'
import University from './scenes/University.vue'
import Home from './scenes/Home.vue'
import Login from './components/Login.vue'
import store from './store'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/login',
    name: 'login',
    component: Login
  },
  { 
    path: '/',
    name: 'app',
    component: University,
    meta: { requiresAuth: true }
  },
  { 
    path: '/home',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router