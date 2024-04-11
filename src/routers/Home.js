import HomeView from '@/Views/HomeView'

export default [
  { path: '/', component: HomeView, meta: { isNavBar: true, requiresAuth: true } },
]