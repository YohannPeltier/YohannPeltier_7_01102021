<template>
  <b-card
    tag="article"
    header-tag="header"
    footer-tag="footer"
    class="shadow-sm mx-auto mt-3 w-9"
  >
    <template #header>
      <h6 class="mb-0">
        <b-link class="text-dark" :to="'/users/' + userId"
          >{{ user.firstname }} {{ user.lastname }}</b-link
        >
      </h6>
      <b-link :id="`message-tooltip-${id}`" class="text-muted">
        <small>{{ date }}</small>
      </b-link>
      <b-tooltip
        :target="`message-tooltip-${id}`"
        triggers="hover"
        placement="bottom"
      >
        le {{ dateLong }} à {{ time }}
      </b-tooltip>
    </template>
    <b-card-text>{{ content }}</b-card-text>
    <template #footer>
      <div class="row gap-3 ml-n2 mr-n2">
        <b-button
          @click="like"
          variant="light"
          class="
            col
            d-inline-flex
            justify-content-center
            align-items-center
            line-height-3
          "
          :class="{ 'text-primary': isLike }"
        >
          <b-icon icon="hand-thumbs-up" aria-label="J'aime"></b-icon>
          <span v-if="likesCounter" class="ml-2">
            {{ likesCounter }}
          </span>
        </b-button>
        <b-button
          variant="light"
          class="
            col
            d-inline-flex
            justify-content-center
            align-items-center
            line-height-3
          "
        >
          <b-icon icon="chat-square-text" aria-label="Commenter"></b-icon>
          <span v-if="commentsCounter" class="ml-3">{{ commentsCounter }}</span>
        </b-button>
      </div>
    </template>
  </b-card>
</template>

<style>
.w-9 {
  max-width: 48rem;
}
.gap-3 {
  gap: 1rem;
}
.tooltip-inner {
  max-width: none;
}
.line-height-3 {
  line-height: 1rem;
}
</style>

<script>
import { BIcon, BIconHandThumbsUp, BIconChatSquareText } from 'bootstrap-vue';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  components: {
    BIcon,
    BIconHandThumbsUp,
    BIconChatSquareText,
  },
  name: 'Notification',
  props: [
    'id',
    'userId',
    'user',
    'content',
    'attachement',
    'likes',
    'createdAt',
    'usersLikes',
  ],

  data: function () {
    return {
      date: new Date(this.createdAt).toLocaleString('fr-FR', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      dateLong: new Date(this.createdAt).toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: new Date(this.createdAt).toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      likesCounter: this.likes <= 0 ? null : this.likes,
      isLike: false,
      commentsCounter: null,
    };
  },
  methods: {
    isUserLike() {
      this.usersLikes.forEach((user) => {
        if (user.UserId === this.loggedInUser.id && user.isLike == 1) {
          this.isLike = true;
        }
      });
    },
    like(event) {
      console.log(event.target.attributes);
      if (this.isLike === true) {
        this.$axios.post(`messages/${this.id}/dislike`).then(() => {
          this.isLike = false;
          this.likesCounter--;
        });
      } else {
        this.$axios.post(`messages/${this.id}/like`).then(() => {
          this.isLike = true;
          this.likesCounter++;
        });
      }
    },
  },
  beforeMount() {
    this.isUserLike();
  },
};
</script>