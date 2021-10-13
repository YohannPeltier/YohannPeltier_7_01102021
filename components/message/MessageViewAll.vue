<template>
  <div>
    <MessagePost v-if="viewPostMessage"></MessagePost>
    <MessageView
      v-for="message in messages"
      :key="message.id"
      :id="message.id"
      :userId="message.UserId"
      :user="message.User"
      :content="message.content"
      :attachement="message.attachement"
      :likes="message.likes"
      :nbComments="message.comments"
      :usersLikes="message.Likes"
      :createdAt="message.createdAt"
    ></MessageView>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['profileUserId', 'viewPostMessage'],
  data() {
    return {
      messages: [],
      key: 0,
      loading: true,
      errored: false,
    };
  },
  async fetch() {
    await this.$axios
      .$get(
        `messages${
          this.profileUserId ? '/?where=userId:' + this.profileUserId : ''
        }`
      )
      .then((res) => {
        this.messages = res;
      })
      .catch((error) => (this.errored = true))
      .finally(() => (this.loading = false));
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  methods: {
    newMessage(data) {
      data.User = {
        firstname: this.loggedInUser.firstname,
        lastname: this.loggedInUser.lastname,
        picture: this.loggedInUser.picture,
      };
      data.Likes = [];
      this.messages.unshift(data);
    },
    deleteMessage(data) {
      const index = this.messages
        .map(function (message) {
          return message.id;
        })
        .indexOf(data.id);
      if (index > -1) {
        this.messages.splice(index, 1);
      }
    },
  },
};
</script>
