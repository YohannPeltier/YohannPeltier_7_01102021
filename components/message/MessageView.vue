<template>
  <b-card
    no-body
    @mouseover="isOveredMessage = true"
    @mouseleave="isOveredMessage = false"
    tag="article"
    header-tag="header"
    class="shadow-sm mx-auto mt-3 w-9"
  >
    <template #header>
      <div class="d-flex ml-n2">
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
        <div class="ml-2">
          <h6 class="mb-0">
            <b-link
              class="text-dark"
              :to="`/users/${userId === loggedInUser.id ? 'Profile' : userId}`"
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
        </div>
        <b-link
          v-if="
            isOveredMessage === true &&
            (userId === loggedInUser.id || loggedInUser.isAdmin)
          "
          @click="deleteMessage"
          aria-label="Supprimer"
          class="text-danger ml-auto"
        >
          <b-icon icon="trash" aria-hidden="true"></b-icon>
        </b-link>
      </div>
    </template>
    <b-card-body>
      <b-card-text v-if="content" class="pre pb-2">{{ content }}</b-card-text>
      <b-card-text
        v-if="attachement !== '' && isLoadedMessageImage === true"
        class="m-n2 text-center"
      >
        <nuxt-img
          @error.native="isLoadedMessageImage = false"
          :src="`${attachement}`"
          sizes="sm:100vw md:100vw lg:742px"
          preset="message"
          class="img-message"
        ></nuxt-img>
      </b-card-text>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item class="footer" aria-label="footer">
        <div class="row gap-3 ml-n2 mr-n2">
          <b-button
            @click="like"
            ref="like"
            :aria-label="likeAria"
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
            <b-icon icon="hand-thumbs-up" aria-hidden="true"></b-icon>
            <span v-if="likesCounter" class="ml-2">
              {{ likesCounter }}
            </span>
          </b-button>
          <b-button
            @click="comment"
            ref="comment"
            :aria-label="
              isComments
                ? 'Masquer les commentaires'
                : 'Afficher les commentaires et commenter'
            "
            variant="light"
            class="
              col
              d-inline-flex
              justify-content-center
              align-items-center
              line-height-3
            "
            :class="{ 'text-primary': commentsCounter }"
          >
            <b-icon icon="chat-square-text" aria-hidden="true"></b-icon>
            <span v-if="commentsCounter" class="ml-3">
              {{ commentsCounter }}
            </span>
          </b-button>
        </div>
      </b-list-group-item>
      <template v-if="isComments">
        <MessageCommentView
          v-for="comment in comments"
          :key="comment.id"
          :id="comment.id"
          :userId="comment.UserId"
          :messageId="comment.messageId"
          :user="comment.User"
          :content="comment.content"
          :createdAt="comment.createdAt"
        ></MessageCommentView>
        <MessageCommentPost :id="id"></MessageCommentPost>
      </template>
    </b-list-group>
  </b-card>
</template>

<style>
.w-9 {
  max-width: 48rem;
}
.tooltip-inner {
  max-width: none;
}
.gap-3 {
  gap: 1rem;
}
.line-height-3 {
  line-height: 1rem;
}
.pre {
  white-space: pre-line;
  line-height: 1.3rem;
}
</style>
<style scoped>
.img-message {
  max-height: 48rem;
  max-width: 100%;
}
.footer {
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
}
</style>

<script>
import {
  BIcon,
  BIconHandThumbsUp,
  BIconChatSquareText,
  BIconTrash,
} from 'bootstrap-vue';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  components: {
    BIcon,
    BIconHandThumbsUp,
    BIconChatSquareText,
    BIconTrash,
  },
  props: [
    'id',
    'userId',
    'user',
    'content',
    'attachement',
    'likes',
    'nbComments',
    'createdAt',
    'usersLikes',
  ],

  data: function () {
    return {
      comments: [],
      isOveredMessage: false,
      isLoadedProfilePicture: true,
      isLoadedMessageImage: true,
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
      likeAria: "J'aime",
      commentsCounter: this.nbComments <= 0 ? null : this.nbComments,
      isComments: false,
    };
  },
  methods: {
    async deleteMessage() {
      await this.$axios.delete(`messages/${this.id}`).then((res) => {
        this.$parent.deleteMessage(res.data);
      });
    },
    isUserLike() {
      this.usersLikes.forEach((user) => {
        if (user.UserId === this.loggedInUser.id && user.isLike == 1) {
          this.isLike = true;
        }
      });
    },
    async like() {
      this.$refs.like.blur();
      if (this.isLike === true) {
        await this.$axios.post(`messages/${this.id}/dislike`).then(() => {
          this.isLike = false;
          this.likeAria = "J'aime";
          this.likesCounter--;
        });
      } else {
        await this.$axios.post(`messages/${this.id}/like`).then(() => {
          this.isLike = true;
          this.likeAria = "Je n'aime plus";
          this.likesCounter++;
        });
      }
    },
    async comment() {
      this.$refs.comment.blur();
      if (this.isComments === true) {
        this.isComments = false;
      } else {
        await this.$axios
          .$get(`messages/${this.id}/comments`)
          .then((res) => {
            this.comments = res;
            this.isComments = true;
          })
          .catch((error) => {
            if (error !== '') console.log(error);
          });
      }
    },
    newComment(data) {
      data.User = {
        firstname: this.loggedInUser.firstname,
        lastnbame: this.loggedInUser.lastname,
        picture: this.loggedInUser.picture,
      };
      this.comments.push(data);
      this.commentsCounter++;
    },
    deleteComment(data) {
      const index = this.comments
        .map(function (comment) {
          return comment.id;
        })
        .indexOf(data.id);
      if (index > -1) {
        this.comments.splice(index, 1);
        this.commentsCounter--;
      }
    },
  },
  beforeMount() {
    this.isUserLike();
  },
};
</script>