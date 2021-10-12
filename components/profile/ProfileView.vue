<template>
  <b-card
    no-body
    tag="article"
    header-tag="header"
    class="shadow-sm mx-auto mt-3 w-9"
  >
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
</template>

<style>
.w-9 {
  max-width: 48rem;
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['loggedInUser']),
  },
};
</script>