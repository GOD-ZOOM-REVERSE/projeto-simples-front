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
      return err.response.data
    }
  },

  async Register(dados) {
    try {
      await axios.post(`/account/register`, dados);
    } catch(err) {
      console.log(err)
    }
  }
}