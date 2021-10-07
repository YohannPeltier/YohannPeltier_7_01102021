<template>
  <div class="d-flex mt-3 flex-column">
    <Notification
      :message="error"
      v-if="error"
      class="align-self-center w-20"
    />
    <b-card tag="section" class="align-self-center mb-3 w-20">
      <b-form @submit.prevent="login">
        <b-form-group
          id="input-group-email"
          label="Addresse Email :"
          label-for="input-email"
        >
          <b-form-input
            id="input-email"
            v-model="email"
            type="email"
            placeholder="Email"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label="Mot de passe :"
          label-for="input-password"
        >
          <b-form-input
            id="input-password"
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            required
          ></b-form-input>
        </b-form-group>
        <div class="text-center">
          <b-button type="submit" variant="primary">Connexion</b-button>
        </div>
      </b-form>

      <div class="text-center mt-2">
        Vous n'avez pas de compte ?
        <nuxt-link to="/login">Inscrivez-vous</nuxt-link>
      </div>
    </b-card>
  </div>
</template>

<style>
.w-20 {
  width: 20rem;
}
</style>

<script>
import Notification from '~/components/Notification';

export default {
  middleware: 'guest',

  components: {
    Notification,
  },

  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },

  methods: {
    async login() {
      try {
        let response = await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        });
        console.log(response);

        this.$router.push('/');
      } catch (e) {
        this.error = e.response.data.error;
      }
    },
  },
};
</script>