import ProdutosView from "@/Views/ProdutosView.vue"

export default [
  { path: '/produtos', component: ProdutosView, meta: { isNavBar: true, requiresAuth: true } }
]