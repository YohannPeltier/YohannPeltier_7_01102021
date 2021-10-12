<template>
  <b-form
    @submit.prevent="postMessage"
    ref="form"
    enctype="multipart/form-data"
  >
    <b-card
      tag="article"
      footer-tag="footer"
      class="shadow-sm mx-auto mt-3 mb-4 w-9"
    >
      <b-card-text class="p-0">
        <b-form-textarea
          v-model="content"
          placeholder="Exprimez-vous"
          rows="3"
          max-rows="8"
          maxlength="255"
          required
        ></b-form-textarea>
      </b-card-text>
      <template #footer>
        <div class="d-flex justify-content-between ml-n2 mr-n2">
          <label for="file-upload" class="btn btn-light">
            <b-icon icon="image" aria-hidden="true"></b-icon>
            <span class="ml-2"> Ajouter une image </span>
          </label>
          <input
            @change="onChangeImage"
            id="file-upload"
            ref="image"
            type="file"
            accept=".jpeg, .jpg, .png"
          />
          <b-button type="submit" variant="primary" class="pl-4 pr-4">
            Publier
          </b-button>
        </div>
      </template>
    </b-card>
  </b-form>
</template>

<style>
.w-9 {
  max-width: 48rem;
}
.line-height-3 {
  line-height: 1rem;
}
</style>
<style scoped>
input[type='file'] {
  display: none;
}
label {
  margin: 0;
}
textarea {
  border: none;
}
.card-body {
  padding: 0;
}
.btn-light {
  color: #6c757d;
  border-color: #6c757d;
}
.btn-light:hover,
.btn-light:focus,
.btn-light:active {
  color: #212529;
  background-color: #e2e6ea;
  border-color: #212529 !important;
}
</style>

<script>
import { BIcon, BIconImage } from 'bootstrap-vue';

export default {
  components: {
    BIcon,
    BIconImage,
  },
  name: 'PostMessage',
  data: function () {
    return {
      content: '',
      image: null,
    };
  },
  methods: {
    async postMessage() {
      const formData = new FormData();
      formData.append('content', this.content);
      formData.append('messageImage', this.image);

      await this.$axios
        .post('messages/create', formData)
        .then((res) => {
          this.content = '';
          this.image = null;
          this.$parent.newMessage(res.data);
        })
        .catch((error) => {
          if (error.response.data.error !== '') console.log(error);
        });
    },
    onChangeImage() {
      const file = this.$refs.image.files[0];
      if (file) {
        this.image = file;
      }
    },
  },
};
</script>