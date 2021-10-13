<template>
  <section class="container pb-3">
    <Notification :message="error" v-if="error" />
    <b-card tag="article" class="shadow mx-auto mt-3 w-8">
      <b-form @submit.prevent="login" ref="form" novalidate>
        <b-form-group
          id="input-group-email"
          label="Addresse Email :"
          label-for="input-email"
          invalid-feedback="Champ obligatoire."
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
          invalid-feedback="Champ obligatoire."
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

      <div class="text-center mt-4">
        Vous n'avez pas de compte ?<br />
        <b-link to="/signup">Inscrivez-vous</b-link>
      </div>
    </b-card>
  </section>
</template>

<style>
.w-8 {
  max-width: 24rem;
}
</style>

<script>
export default {
  middleware: 'guest',

  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },

  methods: {
    async login() {
      if (this.$refs.form.checkValidity() === true) {
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
          if (
            e.response.data.error === 'user not exist in DB' ||
            e.response.data.error === 'invalid password'
          ) {
            this.error = 'Adresse email ou mot de passe incorrect.';
          }
        }
      }
      this.$refs.form.classList.add('was-validated');
    },
  },
};
</script>