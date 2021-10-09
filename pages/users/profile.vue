<template>
  <div class="d-flex mt-3 flex-column">
    <b-card tag="section" class="align-self-center mb-3 w-20">
      <h4>Mon Profile</h4>
      <p>
        <strong>Prénom : </strong>
        {{ loggedInUser.firstname }}
      </p>
      <p>
        <strong>Nom : </strong>
        {{ loggedInUser.lastname }}
      </p>
      <p>
        <strong>Email : </strong>
        {{ loggedInUser.email }}
      </p>
      <p>
        <strong>Description : </strong>
        {{ loggedInUser.bio }}
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
};
</script>