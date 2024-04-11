const routes = [
  ...require("@/routers/Home").default,
  ...require("@/routers/Login/Login").default
]

export default routes