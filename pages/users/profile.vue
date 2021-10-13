<template>
  <section class="container pb-3">
    <template v-if="!isAuthenticated">
      <h1 class="text-center mt-5">Bienvenue sur Groupomania</h1>
    </template>
    <template v-else>
      <ProfileView
        :id="loggedInUser.id"
        :firstname="loggedInUser.firstname"
        :lastname="loggedInUser.lastname"
        :picture="loggedInUser.picture"
        :email="loggedInUser.email"
        :bio="loggedInUser.bio"
        :isMe="true"
      ></ProfileView>
      <MessageViewAll
        :profileUserId="loggedInUser.id"
        :viewPostMessage="true"
      ></MessageViewAll>
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
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
};
</script>