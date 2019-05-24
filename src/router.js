import University from './scenes/University.vue'
import Home from './scenes/Home.vue'
import Login from './components/Login.vue'

const routes = [
  { path: '/app', name: 'app', component: University },
  { path: '/home', name: 'home', component: Home },
  { path: '/login', component: Login }
]

export default routes