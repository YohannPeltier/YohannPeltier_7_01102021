<template>
  <b-list-group-item>
    <b-form
      @submit.prevent="postComment"
      ref="form"
      class="d-inline-flex justify-content-between"
    >
      <b-form-input
        v-model="content"
        placeholder="Écrivez un commentaire..."
        maxlength="255"
        required
      ></b-form-input>
      <b-button type="submit" variant="primary" size="sm" class="px-4">
        Envoyer
      </b-button>
    </b-form>
  </b-list-group-item>
</template>

<style scoped>
form {
  width: 100%;
}
input {
  border: none;
}
.list-group-item {
  padding: 0;
}
</style>

<script>
export default {
  props: ['id'],
  data: function () {
    return {
      content: '',
    };
  },
  methods: {
    async postComment() {
      await this.$axios
        .post(`messages/${this.id}/comments/create`, { content: this.content })
        .then((res) => {
          this.content = '';
          this.$parent.newComment(res.data);
        })
        .catch((error) => {
          if (error !== '') console.log(error);
        });
    },
  },
};
</script>