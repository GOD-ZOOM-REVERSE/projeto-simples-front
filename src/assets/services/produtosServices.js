import axios from 'axios'

export default {
  async GetProtudos() {
    const { data } = await axios.get('/api/produtos');
    return data;
  },

  async Salvar(obj) {
    const response = await axios.post('/api/produtos', obj);
    return response;
  },

  async Editar(obj) {
    const response = await axios.put('/api/produtos', obj);
    return response;
  },

  async DesativarProduto(codigo) {
    const response = await axios.delete(`/api/produtos/${codigo}`);
    return response;
  }
}