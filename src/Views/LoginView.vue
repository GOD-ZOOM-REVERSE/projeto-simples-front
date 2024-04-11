<template>
  <div class="h-100 align-content-center justify-content-center">
    <div class="custom-todo">
      <div class="custom-layout position-relative">
        <b-icon icon="person-fill" class="size-icon position-absolute"></b-icon>
        <div class="custom-forms">
          <div class="row">
            <b-form-input v-model="name" placeholder="Entre com seu nome"></b-form-input>
          </div>
          <div class="row">
            <b-form-input type="password" v-model="password" placeholder="Entre com sua senha"></b-form-input>
          </div>
          <div class="row" v-if="isCadastro">
            <b-form-input type="password" v-model="redefinicaoPassword" placeholder="Entre com sua senha novamente"></b-form-input>
          </div>
          <b-link class="bg-transparent border-0 text-primary" @click="isCadastro = !isCadastro">{{ isCadastro ? 'Logar' : 'Cadastrar' }}</b-link>
          <b-button variant="success" class="w-50" @click="action">{{ isCadastro ? 'Cadastrar' : 'Entrar' }}</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountServices from '@/assets/services/accountServices.js'

export default {
  name: 'LoginView',
  data() {
    return {
      name: null,
      password: null,
      redefinicaoPassword: null,
      isCadastro: false
    }
  },
  methods: {
    action() {
      this.isCadastro ? this.cadastrar() : this.logar();
    },
    async logar() {
      accountServices.Login({
        Name: this.name,
        Password: this.password
      }).then(() => {
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
      })
    },
    async cadastrar() {
      accountServices.Register({
        Name: this.name,
        Password: this.password
      })
    }
  }
}
</script>

<style scoped>
.custom-todo {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('https://wallpapercave.com/wp/wp9764093.jpg') no-repeat center center fixed;
  background-size: cover;
}

.custom-layout {
  width: 50%;
  height: 75%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 25px 3px #000;
  color: #fff;
}

.custom-layout svg {
  top: 0;
}

.custom-forms {
  display: grid;
  justify-items: center;
  gap: 1.5em;
}

.custom-forms input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0;
  color: #fff;
  text-decoration: #fff;
}

.custom-forms input::placeholder {
  color: #fff;
  opacity: .4;
}

.custom-forms input:focus {
  box-shadow: 0 3px 0 0 rgba(13, 110, 253, 0.9);
}

.size-icon {
  width: 100%;
  height: 25%;
}
</style>