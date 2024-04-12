import axios from 'axios'

export default {
  async checkAuth() {
    var { data } = await axios.get(`/account/Authorized`)
    return data
  },
  async Login(dados) {
    try {
      await axios.post(`/account/login`, dados)
    } catch(err) {
      throw err.response.data
    }
  },

  async Register(dados) {
    try {
      await axios.post(`/account/register`, dados);
    } catch(err) {
      throw err.response.data
    }
  },
  async Deslogar() {
    await axios.post(`/account/deslogar`);
  }
}