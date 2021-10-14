<template>
  <section class="container pb-3">
    <template v-if="!isAuthenticated">
      <h1 class="text-center mt-5">Bienvenue sur Groupomania</h1>
    </template>
    <template v-else>
      <MessageViewAll :viewPostMessage="true"></MessageViewAll>
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  middleware: 'auth',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
};
</script>
