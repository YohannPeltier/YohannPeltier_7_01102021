<template>
  <section class="container pb-3">
    <template v-if="!isAuthenticated">
      <h1 class="text-center mt-5">Bienvenue sur Groupomania</h1>
    </template>
    <template v-else>
      <ProfileView></ProfileView>
    </template>
  </section>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex';

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
};
</script>