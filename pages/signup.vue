<template>
  <section class="pb-3">
    <Notification :message="error" v-if="error" />
    <b-card tag="article" class="shadow mx-auto mt-3 w-8">
      <b-form @submit.prevent="signup" ref="form" novalidate>
        <b-form-group
          id="input-group-firstname"
          label="Prénom :"
          label-for="input-firstname"
          invalid-feedback="Saisissez au moins 4 caractères."
        >
          <b-form-input
            id="input-firstname"
            v-model="firstname"
            type="text"
            placeholder="Prénom"
            pattern="([A-Za-zÀ-ÖØ-öø-ÿ]{4,})"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-lastname"
          label="Nom :"
          label-for="input-lastname"
          invalid-feedback="Saisissez au moins 4 caractères."
        >
          <b-form-input
            id="input-lastname"
            v-model="lastname"
            type="text"
            placeholder="Nom"
            pattern="([A-Za-zÀ-ÖØ-öø-ÿ]{4,})"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-email"
          label="Addresse Email :"
          label-for="input-email"
          invalid-feedback="Adresse email invalide"
        >
          <b-form-input
            id="input-email"
            v-model="email"
            type="email"
            placeholder="Email"
            pattern="[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="input-group-password"
          label="Mot de passe :"
          label-for="input-password"
          invalid-feedback="8 caractères dont 1 majuscule et 1 chiffre"
        >
          <b-form-input
            id="input-password"
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          id="file-group-picture"
          label="Photo de profil :"
          label-for="file-picture"
          description=".jpeg, .jpg, .png, .gif"
        >
          <b-form-file
            id="input-picture"
            v-model="picture"
            placeholder="Choisissez un fichier..."
            browse-text="Parcourir"
            accept=".jpeg, .jpg, .png, .gif"
          ></b-form-file>
        </b-form-group>
        <div class="text-center">
          <b-button type="submit" variant="primary">S'inscrire</b-button>
        </div>
      </b-form>

      <div class="text-center mt-4">
        Vous avez déjà un compte ?<br />
        <b-link to="/login">Connectez-vous</b-link>
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
import Notification from '~/components/Notification';

export default {
  middleware: 'guest',

  components: {
    Notification,
  },
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      picture: null,
      error: null,
    };
  },
  methods: {
    async signup(event) {
      if (this.$refs.form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        try {
          await this.$axios.post('users/signup', {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password,
            picture: this.picture,
          });

          await this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password,
            },
          });

          this.$router.push('/');
        } catch (e) {
          if (e.response.data.error === 'user already exist')
            this.error = 'Cet utilisateur existe déjà.';
        }
      }
      this.$refs.form.classList.add('was-validated');
    },
  },
};
</script>