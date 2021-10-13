<template>
  <section class="container pb-3">
    <template v-if="!isAuthenticated">
      <h1 class="text-center mt-5">Bienvenue sur Groupomania</h1>
    </template>
    <template v-else>
      <ProfileView
        :id="user.id"
        :firstname="user.firstname"
        :lastname="user.lastname"
        :picture="user.picture"
        :bio="user.bio"
        :isMe="false"
      ></ProfileView>
      <MessageViewAll
        :profileUserId="this.$route.params.id"
        :viewPostMessage="false"
      ></MessageViewAll>
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
export default {
  middleware: 'auth',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  data() {
    return {
      user: [],
    };
  },
  async fetch() {
    await this.$axios
      .$get(`users/${this.$route.params.id}`)
      .then((res) => {
        this.user = res;
      })
      .catch((error) => (this.errored = true))
      .finally(() => (this.loading = false));
  },
};
</script>