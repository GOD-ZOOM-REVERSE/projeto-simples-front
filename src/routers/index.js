const routes = [
  ...require("@/routers/Home").default,
  ...require("@/routers/Login/Login").default,
  ...require('@/routers/Produtos/Produtos').default
]

export default routes