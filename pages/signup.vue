<template>
  <section class="container pb-3">
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
          description=".jpeg, .jpg, .png (5Mo)"
        >
          <b-form-file
            id="input-picture"
            v-model="picture"
            :state="picture ? Boolean(picture.size < 5 * 1024 * 1024) : null"
            @change="onChangeImage"
            ref="picture"
            placeholder="Choisissez une image..."
            drop-placeholder="Déposez votre image ici..."
            browse-text="Parcourir"
            accept=".jpeg, .jpg, .png"
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
.was-validated .custom-file-input:invalid ~ .custom-file-label,
.custom-file-input.is-invalid ~ .custom-file-label {
  border-color: #dc3545 !important;
  box-shadow: none !important;
}
</style>

<script>
export default {
  middleware: 'guest',

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
    async signup() {
      if (
        this.$refs.picture.state === true ||
        this.$refs.picture.state === null
      ) {
        if (this.$refs.form.checkValidity() === true) {
          try {
            const formData = new FormData();
            formData.append('firstname', this.firstname);
            formData.append('lastname', this.lastname);
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('profilePicture', this.picture);

            await this.$axios.post('users/signup', formData);

            await this.$auth.loginWith('local', {
              data: {
                email: this.email,
                password: this.password,
              },
            });

            this.$router.push('/users/profile');
          } catch (e) {
            if (e.response.data.error === 'user already exist')
              this.error = 'Cet utilisateur existe déjà.';
          }
        }
      }
      this.$refs.form.classList.add('was-validated');
    },
    onChangeImage() {
      const file = this.$refs.picture.files[0];
      if (file) {
        if (file.size < 5 * 1024 * 1024) {
          this.$refs.picture.state = true;
        } else {
          this.$refs.picture.state = false;
        }
      }
    },
  },
};
</script>