<template>
  <b-card
    no-body
    tag="article"
    header-tag="header"
    footer-tag="footer"
    class="shadow-sm mx-auto mt-3 w-9"
  >
    <template #header>
      <div class="d-flex ml-n2">
        <b-img
          :src="coverImageProfil(user.picture)"
          width="43"
          height="43"
          rounded="circle"
          :alt="`Image de profil de ${user.firstname} ${user.lastname}`"
        />
        <div class="ml-2">
          <h6 class="mb-0">
            <b-link class="text-dark" :to="`/users/${userId}`"
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
      </div>
    </template>
    <b-card-body>
      <b-card-text class="content-message">{{ content }}</b-card-text>
      <b-card-text v-if="attachement" class="ml-n2 mr-n2 mb-n2 text-center">
        <b-img
          :src="coverImageMessage(attachement)"
          class="img-message"
          fluid
        />
      </b-card-text>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item class="footer">
        <div class="row gap-3 ml-n2 mr-n2">
          <b-button
            @click="like"
            ref="like"
            variant="light"
            aria-label="J'aime"
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
            variant="light"
            aria-label="Commenter"
            class="
              col
              d-inline-flex
              justify-content-center
              align-items-center
              line-height-3
            "
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
</style>
<style scoped>
.content-message {
  white-space: pre-line;
  line-height: 1.3rem;
}
.img-message {
  width: auto;
  height: auto;
  max-height: 48rem;
}
img {
  object-fit: cover;
}
.footer {
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
}
</style>

<script>
import { BIcon, BIconHandThumbsUp, BIconChatSquareText } from 'bootstrap-vue';
import { mapGetters } from 'vuex';
import { IMAGE_PROFILE_DEFAULT, IMAGE_MESSAGE_DEFAULT } from '../../constants';

export default {
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  components: {
    BIcon,
    BIconHandThumbsUp,
    BIconChatSquareText,
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
      commentsCounter: this.nbComments <= 0 ? null : this.nbComments,
      isComments: false,
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
    async like() {
      this.$refs.like.blur();
      if (this.isLike === true) {
        await this.$axios.post(`messages/${this.id}/dislike`).then(() => {
          this.isLike = false;
          this.likesCounter--;
        });
      } else {
        await this.$axios.post(`messages/${this.id}/like`).then(() => {
          this.isLike = true;
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
            console.log(res);
            this.comments = res;
            this.isComments = true;
          })
          .catch((error) => console.log(error));
      }
    },
    coverImageProfil(url) {
      if (url !== '') {
        try {
          url = require('@/assets/img/profiles/' + url);
        } catch (e) {
          url = IMAGE_PROFILE_DEFAULT; // Default image.
        }
      } else url = IMAGE_PROFILE_DEFAULT; // Default image.
      return url;
    },
    coverImageMessage(url) {
      if (url !== '') {
        try {
          url = require('@/assets/img/messages/' + url);
        } catch (e) {
          url = IMAGE_MESSAGE_DEFAULT; // Default image.
        }
      } else url = IMAGE_MESSAGE_DEFAULT; // Default image.
      return url;
    },
    newComment(data) {
      console.log(data);
      data.User = {
        firstname: this.loggedInUser.firstname,
        lastnbame: this.loggedInUser.lastname,
        picture: this.loggedInUser.picture,
      };
      console.log(data);
      this.comments.push(data);
      this.commentsCounter++;
    },
  },
  beforeMount() {
    this.isUserLike();
  },
};
</script>