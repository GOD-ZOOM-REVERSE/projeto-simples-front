<template>
  <div class="container my-2">
    {{ getProdutos }}
    <div class="w-100 d-flex justify-content-end my-3">
      <b-button variant="primary" @click="showModal">Cadastrar</b-button>
    </div>

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
      <form ref="form" @submit.stop.prevent="handleSubmit" class="d-flex ajuste-gap">
        <b-form-group
          label="Nome do Produto"
          label-for="name-input"
          invalid-feedback="Name is required"
          class="w-50">

          <b-form-input
            id="name-input"
            v-model="nome"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Preço"
          label-for="name-input"
          invalid-feedback="Name is required"
          class="w-50">
          
          <b-form-input
            id="name-input"
            v-model="valorUnitario"
            required
          ></b-form-input>
        </b-form-group>
      </form>
      <template #modal-footer="{ cancel, ok }">
        <div class="w-100 d-flex justify-content-end ajuste-gap">
          <b-button @click="cancel">Cancelar</b-button>
          <b-button variant="success" @click="isEditar ? editar(ok) : salvar(ok)">Salvar</b-button>
        </div>
      </template>
    </b-modal>
    <h3>Ativos</h3>
    <b-table striped hover :items="getProdutos" :fields="fields">
      <template #cell(actions)="row">
        <div class="d-flex justify-content-evenly">
          <b-button size="sm" @click="showModal(row.item.codigo)" class="mr-2 border-0 bg-transparent text-dark">
            <b-icon icon="pencil-fill" font-scale="1"></b-icon>
          </b-button>
          <b-button size="sm" @click="desativarProduto(row.item.codigo)" class="mr-2 border-0 bg-transparent text-dark">
            <b-icon icon="trash-fill" font-scale="1"></b-icon>
          </b-button>
        </div>
      </template>
    </b-table>
    <br/>
    <h3>Inativos</h3>
    <b-table striped hover :items="getProdutosInativos" :fields="fields">
      <template #cell(actions)="row">
        <div class="d-flex justify-content-evenly">
          <b-button size="sm" @click="reativar(row.item.codigo)" variant="success" class="mr-2">
            Reativar
          </b-button>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import produtosServices from '@/assets/services/produtosServices'

export default {
  name: 'ProdutosView',
  data() {
    return {
      fields: [
        {
          key: 'codigo',
          sortable: true
        },
        {
          key: 'nome',
          sortable: true
        },
        {
          key: 'valorUnitario',
          label: 'Valor Unitário',
          sortable: true,
        },
        {
          key: 'actions',
          label: 'Ação',
        }
      ],
      produtos: [],
      show: false,
      nome: '',
      valorUnitario: null,
      isEditar: false,
      codigo: null
    }
  },
  computed: {
    getProdutos() {
      return this.produtos.filter(f => f.isInativo == false);
    },
    getProdutosInativos() {
      return this.produtos.filter(f => f.isInativo == true)
    }
  },
  created() {
    produtosServices.GetProtudos().then(res => {
      this.produtos = res;
    }).catch(err => {
      console.log("Erro: ", err)
    });
    console.log(this.produtos)
  },
  methods: {
    salvar(ok) {
      var obj = {
        Nome: this.nome,
        ValorUnitario: this.valorUnitario
      };
      produtosServices.Salvar(obj).then(() => {
        produtosServices.GetProtudos().then(res => {
          this.produtos = res;
        }).catch(err => {
          console.log("Erro: ", err)
        });
      }).catch(err => {
        console.log(err)
      });
      ok();
    },
    showModal(codigo = null) {
      if (codigo) {
        var produtos = this.produtos.find(f => f.codigo == codigo);
        this.codigo = codigo;
        this.nome = produtos.nome;
        this.valorUnitario = produtos.valorUnitario
        this.isEditar = true;
      }  else {
        this.isEditar = false;
      }
      this.show = true;
    },
    editar(ok) {
      var obj = {
        Codigo: this.codigo,
        Nome: this.nome,
        ValorUnitario: this.valorUnitario
      };
      produtosServices.Editar(obj).then(() => {
        produtosServices.GetProtudos().then(res => {
          this.produtos = res;
        }).catch(err => {
          console.log("Erro: ", err)
        });
      }).catch(err => {
        console.log(err)
      });
      ok();
    },
    desativarProduto(codigo) {
      produtosServices.DesativarProduto(codigo).then(() => {
        produtosServices.GetProtudos().then(res => {
          this.produtos = res;
        }).catch(err => {
          console.log("Erro: ", err)
        });
      }).catch(err => {
        console.log(err);
      })
    },
    reativar(codigo) {
      var produto = this.produtos.find(f => f.codigo == codigo);
      produto.isInativo = false;
      produtosServices.Editar(produto).then(() => {
        produtosServices.GetProtudos().then(res => {
          this.produtos = res;
        }).catch(err => {
          console.log("Erro: ", err)
        });
      }).catch(err => {
        console.log(err)
      });
    }
  }
}
</script>

<style scoped>
.ajuste-gap {
  gap: 10px;
}
</style>