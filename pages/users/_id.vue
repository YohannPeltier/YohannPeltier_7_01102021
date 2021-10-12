<template>
  <section class="container pb-3">
    <template v-if="!isAuthenticated">
      <h1 class="text-center mt-5">Bienvenue sur Groupomania</h1>
    </template>
    <template v-else>
      <ProfileView></ProfileView>
      <MessageViewAll></MessageViewAll>
    </template>
  </section>
</template>

<style>
.w-20 {
  width: 20rem;
}
</style>

<script>
import { mapGetters } from 'vuex';
import MessageViewAll from '~/components/message/MessageViewAll.vue';
export default {
  components: { MessageViewAll },
  middleware: 'auth',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
};
</script>