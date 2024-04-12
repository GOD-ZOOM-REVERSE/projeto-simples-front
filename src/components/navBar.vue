<template>
  <div class="custom-navbar">
    <b-navbar toggleable="lg" type="dark" variant="info" class="px-5">
      <b-navbar-brand href="/">NavBar</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav class="justify-content-between">
        <b-navbar-nav>
          <b-nav-item href="#" @click="$router.push('/produtos')">produtos</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown id="my-nav-dropdown"
                              text="User"
                              toggle-class="nav-link-custom"
                              right>
            <b-dropdown-item href="#" @click="deslogar">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import accountServices from '@/assets/services/accountServices';

export default {
  name: "navBar",
  methods: {
    async deslogar() {
      accountServices.Deslogar().then(() => {
        this.$router.push("/login");
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  padding: 0;
}
</style>