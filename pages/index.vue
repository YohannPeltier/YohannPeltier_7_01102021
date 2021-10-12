<template>
  <section class="container pb-3">
    <template v-if="!isAuthenticated">
      <h1 class="text-center mt-5">Bienvenue sur Groupomania</h1>
    </template>
    <template v-else>
      <MessageViewAll></MessageViewAll>
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
};
</script>
