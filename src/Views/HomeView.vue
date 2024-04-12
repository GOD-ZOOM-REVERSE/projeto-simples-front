<template>
  <div class="container">
    <div class="my-2 w-100 d-flex justify-content-end">
      <b-button variant="success" @click="showModal(null)">Fazer Pedido</b-button>
    </div>
    <b-table :items="pedidosCompras" :fields="fields" striped responsive="sm">
      <template #cell(show_details)="row">
        <b-button size="sm" @click="row.toggleDetails" class="border-0 bg-transparent text-dark p-0">
          <b-icon icon="chevron-down"></b-icon>
        </b-button>
      </template>

      <template #row-details="row">
        <b-table striped responsive="sm" :items="row.item.produtosPedidos" :fields="subFields"></b-table>
      </template>

      <template #cell(actions)="row">
        <div class="d-flex justify-content-center ajuste-gap w-100" v-if="row.item.status == 'Ativo'">
          <b-button size="sm" @click="showModal(row.item.id, row.item.produtosPedidos)" class="mr-2 border-0 bg-transparent text-dark">
            <b-icon icon="pencil-fill" font-scale="1"></b-icon>
          </b-button>
          <b-button size="sm" @click="desativarProduto(row.item.id)" variant="success" class="mr-2">
            Finalizar Pagamento
          </b-button>
        </div>
      </template>
    </b-table>

    <b-modal
      v-model="show"
      id="modal-prevent-closing"
      ref="modal"
      title="Submit Your Name"
      class="modal"
    >
      <template #modal-header="{ close }">
        <div class="d-flex w-100 justify-content-between">
          <h5>Modal Header</h5>

          <b-button size="sm" class="border-0 bg-transparent text-dark" @click="close()">
            X
          </b-button>
        </div>
      </template>
      <form ref="form" @submit.stop.prevent="handleSubmit" class="d-flex ajuste-gap justify-content-between my-2" v-for="produto in produtosPedidos" :key="produto.value">
        <b-form-checkbox
          id="checkbox-1"
          v-model="produto.status"
          name="checkbox-1"
          disabled
        >
          <span class="mx-2 w-75">{{ produto.text }}</span>
        </b-form-checkbox>
        <b-form-input :id="`type-number`" :type="'number'" class="w-25" v-model="produto.quantidades" @input="produto.status = isEditar ? true : produto.quantidades > 0 ? true : false"></b-form-input>
      </form>
      <template #modal-footer="{ cancel, ok }">
        <div class="w-100 d-flex justify-content-end ajuste-gap">
          <b-button @click="cancel">Cancelar</b-button>
          <b-button variant="success" @click="isEditar ? editar(ok) : salvar(ok)">Salvar</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import produtosServices from '@/assets/services/produtosServices';
import pedidosComprasServices from '@/assets/services/pedidosComprasServices'

export default {
  name: "HomeView",
  data() {
    return {
      fields: [
        {
          key: 'show_details',
          label: '',
        },
        {
          key: 'valorTotal',
          label: 'Valor Total'
        },
        {
          key: 'status',
        },
        {
          key: 'fornecedor'
        },
        {
          key: 'actions'
        },
      ],
      subFields: [
        {
          key: 'produtoCodigo',
          label: 'Código'
        },
        {
          key: 'produto.nome',
          label: 'Nome'
        },
        {
          key: 'produto.valorUnitario',
          label: 'Valor Unitário'
        },
        {
          key: 'quantidade'
        },
      ],
      pedidosCompras: null,
      isEditar: false,
      show: false,
      selected: null,
      produtosPedidos: null,
      idPedidoCompras: null
    }
  },
  created() {
    pedidosComprasServices.GetProtudos().then(res => {
      this.pedidosCompras = res.map(value => {
        value.valorTotal = value.valorTotal.toFixed(2);
        if(value.status == 1) {
          value.status = "Ativo";
          return { ...value };
        } else {
          value.status = "Finalizado";
          return { ...value };
        }
      })
      produtosServices.GetProtudos().then(res => {
        this.produtosPedidos = res.map(value => {
          return { text: value.nome, value: value.codigo, preco: value.valorUnitario, quantidades: 0, status: false }
        });
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err);
    })
    
  },
  methods: {
    showModal(id, produtosPedidos = null) {
      if (id) {
        this.produtosPedidos = produtosPedidos.map(value => {
          return { id: value.id, text: value.produto.nome, value: value.produto.codigo, preco: value.produto.valorUnitario, quantidades: value.quantidade, status: id != null ? true : value.quantidade > 0 ? true : false }
        });
        this.isEditar = true;
        this.idPedidoCompras = id;
      }  else {
        produtosServices.GetProtudos().then(res => {
          this.produtosPedidos = res.map(value => {
            return { text: value.nome, value: value.codigo, preco: value.valorUnitario, quantidades: 0, status: false }
          });
        }).catch(err => {
          console.log(err)
        })
        this.idPedidoCompras = null;
        this.isEditar = false;
      }
      this.show = true;
    },
    async salvar(ok) {
      var obj = {
        ProdutosPedidos: this.produtosPedidos.filter(f => f.status == true).map(value => {
          return { 
            Produto: { 
              Codigo: value.value,
              Nome: value.text,
              ValorUnitario: value.preco
            },
            Quantidade: value.quantidades,
            ProdutoCodigo: value.value
          }
        }),
        Status: 1
      };
      await pedidosComprasServices.Salvar(obj);
      pedidosComprasServices.GetProtudos().then(res => {
        this.pedidosCompras = res.map(value => {
          value.valorTotal = value.valorTotal.toFixed(2);
          if(value.status == 1) {
            value.status = "Ativo";
            return { ...value };
          } else {
            value.status = "Finalizado";
            return { ...value };
          }
        })
      }).catch(err => {
        console.log(err);
      });
      ok();
    },
    async editar(ok) {
      var obj = {
        Id: this.idPedidoCompras,
        ProdutosPedidos: this.produtosPedidos.filter(f => f.status == true).map(value => {
          return {
            Id: value.id,
            Produto: { 
              Codigo: value.value,
              Nome: value.text,
              ValorUnitario: value.preco
            },
            Quantidade: value.quantidades,
            ProdutoCodigo: value.value
          }
        }),
        Status: 1
      };
      await pedidosComprasServices.Editar(obj);
      await this.updatePedidosCompras();
      ok();
    },
    async desativarProduto(id) {
      await pedidosComprasServices.DesativarProduto(id);
      await this.updatePedidosCompras();
    },
    async updatePedidosCompras() {
      pedidosComprasServices.GetProtudos().then(res => {
        this.pedidosCompras = res.map(value => {
          value.valorTotal = value.valorTotal.toFixed(2);
          if(value.status == 1) {
            value.status = "Ativo";
            return { ...value };
          } else {
            value.status = "Finalizado";
            return { ...value };
          }
        })
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style scoped>
.ajuste-gap {
  gap: 10px;
}
</style>