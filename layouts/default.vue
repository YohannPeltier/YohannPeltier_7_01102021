<template>
  <div>
    <Navbar />
    <nuxt />
  </div>
</template>

<style>
body {
  background-color: #f8f9fa;
}
</style>

<script>
import Navbar from '~/components/Navbar';

export default {
  components: {
    Navbar,
  },
};
</script>