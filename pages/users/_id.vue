<template>
  <div class="d-flex mt-3 flex-column">
    <b-card tag="section" class="align-self-center mb-3 w-20">
      <p>
        <strong>Prénom : </strong>
        {{ user.firstname }}
      </p>
      <p>
        <strong>Nom : </strong>
        {{ user.lastname }}
      </p>
      <p>
        <strong>Email : </strong>
        {{ user.email }}
      </p>
      <p>
        <strong>Description : </strong>
        {{ user.bio }}
      </p>
    </b-card>
  </div>
</template>

<style>
.w-20 {
  width: 20rem;
}
</style>

<script>
import { mapGetters } from 'vuex';
export default {
  middleware: 'auth',
  computed: {
    ...mapGetters(['loggedInUser']),
  },
  data() {
    return {
      user: [],
      loading: true,
      errored: false,
    };
  },
  async fetch() {
    await this.$axios
      .$get('users/' + this.$route.params.id)
      .then((res) => {
        this.user = res;
      })
      .catch((error) => (this.errored = true))
      .finally(() => (this.loading = false));
  },
  methods: {
    routerProfile() {
      if (parseInt(this.$route.params.id) === this.loggedInUser.id) {
        this.$router.push('profile');
      }
    },
  },
  beforeMount() {
    this.routerProfile();
  },
};
</script>