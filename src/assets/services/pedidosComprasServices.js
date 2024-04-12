import axios from 'axios'

export default {
  async GetProtudos() {
    const { data } = await axios.get('/api/pedidosCompras');
    return data;
  },

  async Salvar(obj) {
    const response = await axios.post('/api/pedidosCompras', obj);
    return response;
  },

  async Editar(obj) {
    const response = await axios.put('/api/pedidosCompras', obj);
    return response;
  },

  async DesativarProduto(id) {
    const response = await axios.delete(`/api/pedidosCompras/${id}`);
    return response;
  }
}