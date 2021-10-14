
<template>
  <b-navbar toggleable type="dark" variant="primary">
    <b-navbar-brand href="#">
      <nuxt-img
        :src="`static/img/logo.svg`"
        alt="Logo Groupomania"
        class="img-fluid mw-100"
      />
    </b-navbar-brand>

    <b-navbar-toggle target="navbar-toggle-collapse" class="ml-auto">
      <template #default="{ expanded }">
        <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
        <b-icon v-else icon="chevron-bar-down"></b-icon>
      </template>
    </b-navbar-toggle>
    <b-collapse id="navbar-toggle-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <template v-if="isAuthenticated">
          <b-nav-item to="/users/profile">
            {{ loggedInUser.firstname }}
            {{ loggedInUser.lastname }}
          </b-nav-item>
          <b-nav-item @click="logout">Déconnexion</b-nav-item>
        </template>
        <template v-else>
          <b-nav-item to="/signup">Inscription</b-nav-item>
          <b-nav-item to="/login">Connexion</b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { BIcon, BIconChevronBarUp, BIconChevronBarDown } from 'bootstrap-vue';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  components: {
    BIcon,
    BIconChevronBarUp,
    BIconChevronBarDown,
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>