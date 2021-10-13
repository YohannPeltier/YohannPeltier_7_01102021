<template>
  <div>
    <Notification :message="error" v-if="error"></Notification>
    <b-card
      @mouseover="isOveredProfile = true"
      @mouseleave="isOveredProfile = false"
      no-body
      tag="article"
      header-tag="header"
      class="shadow-sm mx-auto mb-4 mt-3 w-9"
    >
      <template #header>
        <div class="text-center position-relative">
          <nuxt-img
            v-if="picture !== '' && isLoadedProfilePicture === true"
            @error.native="isLoadedProfilePicture = false"
            :src="`${picture}`"
            height="150"
            width="150"
            preset="profile"
            class="rounded-circle"
            :alt="`Image de profil de ${firstname} ${lastname}`"
          ></nuxt-img>
          <nuxt-img
            v-else
            :src="`static/defaults/default_profile.jpeg`"
            preset="profile"
            class="rounded-circle"
            :alt="`Image de profil de ${firstname} ${lastname}`"
          ></nuxt-img>
          <h3>{{ firstname }} {{ lastname }}</h3>
          <b-link
            v-if="isOveredProfile === true && isMe"
            @click="deleteProfile"
            :aria-label="`Supprimer`"
            class="text-danger position-absolute mt-2 top-0 right-0 h4"
          >
            <b-icon icon="trash" aria-hidden="true"></b-icon>
          </b-link>
        </div>
      </template>
      <b-list-group flush>
        <b-list-group-item v-if="isMe">
          <b-form @submit.prevent="modifyEmailEvent" class="was-validated">
            <div
              class="
                d-flex
                flex-wrap
                gap-3
                justify-content-between
                align-items-center
              "
            >
              <div class="flex-grow-1 mr-md-5">
                <div class="pb-2">
                  <strong>Email : </strong>
                </div>
                <b-form-input
                  v-if="modifyEmail.state"
                  v-model="modifyEmail.content"
                  size="255"
                  pattern="[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})"
                >
                </b-form-input>
                <p v-else class="mb-0 text-break">{{ modifyEmail.content }}</p>
              </div>
              <b-button
                @click="modifyEmailEvent"
                :variant="modifyEmail.variant"
                :aria-label="modifyEmail.aria"
                size="sm"
                class="ml-auto"
              >
                <b-icon :icon="modifyEmail.icon"></b-icon>
              </b-button>
            </div>
          </b-form>
        </b-list-group-item>
        <b-list-group-item>
          <div
            class="
              d-flex
              flex-wrap
              gap-3
              justify-content-between
              align-items-center
            "
          >
            <div class="flex-grow-1 mr-md-5">
              <div class="pb-2">
                <strong>Description : </strong>
              </div>
              <b-form-textarea
                v-if="modifyBio.state"
                v-model="modifyBio.content"
                rows="5"
                size="255"
                no-resize
              >
              </b-form-textarea>
              <p v-else class="mb-0 pre text-break">
                {{
                  modifyBio.content ? modifyBio.content : 'Aucune description'
                }}
              </p>
            </div>
            <b-button
              @click="modifyBioEvent"
              :variant="modifyBio.variant"
              v-if="isMe"
              :aria-label="modifyBio.aria"
              size="sm"
              class="ml-auto"
            >
              <b-icon :icon="modifyBio.icon"></b-icon>
            </b-button>
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<style>
.w-9 {
  max-width: 48rem;
}
.pre {
  white-space: pre-line;
  line-height: 1.3rem;
}
.gap-3 {
  gap: 1rem;
}
.top-0 {
  top: 0;
}
.right-0 {
  right: 0;
}
</style>

<script>
import {
  BIcon,
  BIconPencil,
  BIconCheckCircle,
  BIconTrash,
} from 'bootstrap-vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    BIcon,
    BIconPencil,
    BIconCheckCircle,
    BIconTrash,
  },
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  props: ['id', 'firstname', 'lastname', 'email', 'picture', 'bio', 'isMe'],
  data() {
    return {
      error: null,
      isOveredProfile: false,
      isLoadedProfilePicture: true,
      modifyBio: {
        state: false,
        icon: 'pencil',
        aria: 'Modifier la description',
        variant: 'outline-danger',
        content: this.bio,
      },
      modifyEmail: {
        state: false,
        icon: 'pencil',
        aria: "Modifier l'adresse email",
        variant: 'outline-danger',
        content: this.email,
      },
    };
  },
  methods: {
    async modifyBioEvent() {
      if (this.modifyBio.state) {
        await this.$axios
          .put(`users/me`, {
            bio: this.modifyBio.content,
          })
          .then((res) => {
            this.modifyBio.state = false;
            this.modifyBio.icon = 'pencil';
            this.modifyBio.aria = 'Modifier la description';
            this.modifyBio.variant = 'outline-danger';
            this.modifyBio.content = res.data.bio;
          })
          .catch((error) => {
            this.modifyBio.content = this.bio;
            this.error = 'Erreur lors de la mise à jour de la description.';
          });
      } else {
        this.modifyBio.state = true;
        this.modifyBio.icon = 'check-circle';
        this.modifyBio.aria = 'Enregister la description';
        this.modifyBio.variant = 'outline-success';
      }
    },
    async modifyEmailEvent() {
      if (this.modifyEmail.state) {
        await this.$axios
          .put(`users/me`, {
            email: this.modifyEmail.content,
          })
          .then((res) => {
            this.modifyEmail.state = false;
            this.modifyEmail.icon = 'pencil';
            this.modifyEmail.aria = "Modifier l'adresse email";
            this.modifyEmail.variant = 'outline-danger';
            this.modifyEmail.content = res.data.email;
          })
          .catch((error) => {
            this.modifyEmail.content = this.email;
            this.error = "Erreur lors de la mise à jour de l'adresse email.";
          });
      } else {
        this.modifyEmail.state = true;
        this.modifyEmail.icon = 'check-circle';
        this.modifyEmail.aria = "Enregister l'adresse email";
        this.modifyEmail.variant = 'outline-success';
      }
    },
    async deleteProfile() {
      await this.$axios.delete(`users/${this.id}`).then(async (res) => {
        await this.$router.push('/');
        await this.$auth.logout();
      });
    },
  },
};
</script>