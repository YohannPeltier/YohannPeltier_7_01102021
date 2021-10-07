<template>
  <b-alert show variant="danger">{{ message }}</b-alert>
</template>

<script>
export default {
  name: 'Notification',
  props: ['message'],
};
</script>