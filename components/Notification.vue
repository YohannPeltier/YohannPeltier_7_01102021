<template>
  <b-alert show variant="danger" class="shadow-sm mx-auto mt-3 w-8">
    {{ message }}
  </b-alert>
</template>

<style>
.w-8 {
  max-width: 24rem;
}
</style>

<script>
export default {
  name: 'Notification',
  props: ['message'],
};
</script>