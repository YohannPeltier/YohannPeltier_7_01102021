<template>
  <b-list-group-item class="p-3">
    <div class="d-flex align-items-start">
      <nuxt-img
        v-if="user.picture !== '' && isLoadedProfilePicture === true"
        @error.native="isLoadedProfilePicture = false"
        :src="`${user.picture}`"
        preset="profileMessage"
        class="rounded-circle"
        :alt="`Image de profil de ${user.firstname} ${user.lastname}`"
      ></nuxt-img>
      <nuxt-img
        v-else
        :src="`static/defaults/default_profile.jpeg`"
        preset="profileMessage"
        class="rounded-circle"
        :alt="`Image de profil de ${user.firstname} ${user.lastname}`"
      ></nuxt-img>
      <div
        @mouseover="isOveredComment = true"
        @mouseleave="isOveredComment = false"
        class="ml-2 flex-grow-1 py-2 px-3 rounded comment"
      >
        <div class="d-flex align-items-baseline">
          <h6 class="mb-0 font-size-n1">
            <b-link class="text-dark" :to="`/users/${userId}`"
              >{{ user.firstname }} {{ user.lastname }}</b-link
            >
          </h6>
          <div class="line-height-3 d-inline-flex mr-2">
            <b-link :id="`message-tooltip-${id}`" class="text-muted">
              <small class="ml-3 text-truncate">{{ date }}</small>
            </b-link>
          </div>
          <b-tooltip
            :target="`message-tooltip-${id}`"
            triggers="hover"
            placement="bottom"
          >
            le {{ dateLong }} à {{ time }}
          </b-tooltip>
          <b-link
            v-if="
              isOveredComment === true &&
              (userId === loggedInUser.id || loggedInUser.isAdmin)
            "
            @click="deleteComment"
            aria-label="Supprimer"
            class="text-danger ml-auto my-n1 font-size-n1"
          >
            <b-icon icon="trash" aria-hidden="true"></b-icon>
          </b-link>
        </div>
        <div class="font-weight-light">
          {{ content }}
        </div>
      </div>
    </div>
  </b-list-group-item>
</template>

<style>
.tooltip-inner {
  max-width: none;
}
.line-height-3 {
  line-height: 1rem;
}
.font-size-n1 {
  font-size: 0.88rem;
}
</style>
<style scoped>
.comment {
  background-color: #e2e6ea;
}
</style>

<script>
import { BIcon, BIconTrash } from 'bootstrap-vue';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  components: {
    BIcon,
    BIconTrash,
  },
  props: ['id', 'userId', 'messageId', 'user', 'content', 'createdAt'],

  data: function () {
    return {
      isOveredComment: false,
      isLoadedProfilePicture: true,
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
    async deleteComment() {
      await this.$axios
        .delete(`messages/${this.messageId}/comments/${this.id}`)
        .then((res) => {
          this.$parent.deleteComment(res.data);
        });
    },
  },
};
</script>