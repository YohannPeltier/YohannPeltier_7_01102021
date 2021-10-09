<template>
  <section class="container pb-3">
    <template v-if="!isAuthenticated">
      <h1 class="text-center mt-5">Bienvenue sur Groupomania</h1>
    </template>
    <template v-else>
      <Message
        v-for="(message, index) in messages"
        :key="index"
        :id="message.id"
        :userId="message.UserId"
        :user="message.User"
        :content="message.content"
        :attachement="message.attachement"
        :likes="message.likes"
        :usersLikes="message.Likes"
        :createdAt="message.createdAt"
      />
    </template>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      messages: [],
      loading: true,
      errored: false,
    };
  },
  async fetch() {
    await this.$axios
      .$get('messages')
      .then((res) => {
        this.messages = res;
      })
      .catch((error) => (this.errored = true))
      .finally(() => (this.loading = false));
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
};
</script>
