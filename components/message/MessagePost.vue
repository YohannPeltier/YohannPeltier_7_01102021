<template>
  <b-form
    @submit.prevent="postMessage"
    ref="form"
    enctype="multipart/form-data"
  >
    <b-overlay :show="loader" rounded="sm">
      <b-card
        tag="article"
        footer-tag="footer"
        class="shadow-sm mx-auto mt-3 mb-4 w-9"
      >
        <b-card-text class="p-0">
          <b-form-textarea
            v-model="content"
            @input="onChangeContent"
            placeholder="Exprimez-vous"
            rows="3"
            maxlength="255"
            no-resize
          ></b-form-textarea>
        </b-card-text>
        <template #footer>
          <div class="d-flex justify-content-between ml-n2 mr-n2">
            <input
              @change="onChangeImage"
              id="file-upload"
              ref="inputImage"
              type="file"
              accept=".jpeg, .jpg, .png, .gif"
            />
            <label
              for="file-upload"
              class="d-flex align-items-center btn btn-light mr-3"
            >
              <b-icon icon="image" aria-hidden="true"></b-icon>
              <span class="ml-2 text-break">{{ labelInputImage }}</span>
            </label>
            <b-button
              ref="buttonPostMessage"
              type="submit"
              variant="primary"
              class="pl-4 pr-4"
            >
              Publier
            </b-button>
          </div>
        </template>
      </b-card>
    </b-overlay>
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
  border: 0;
  clip: rect(0);
  height: 0;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 0;
}
label {
  margin: 0;
}
textarea {
  border: none;
}
button:focus:not(.focus-visible) {
  outline: 0;
}
input[type='file']:focus ~ label {
  box-shadow: 0 0 0 0.2rem rgb(38 143 255 / 50%);
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
      labelInputImage: 'Ajouter une image...',
      loader: false,
    };
  },
  methods: {
    async postMessage() {
      this.loader = true;
      this.$refs.buttonPostMessage.disabled = true;
      const formData = new FormData();
      formData.append('content', this.content);
      formData.append('messageImage', this.image);

      await this.$axios
        .post('messages/create', formData)
        .then((res) => {
          this.content = '';
          this.image = null;
          this.$refs.inputImage.value = '';
          this.labelInputImage = 'Ajouter une images...';
          console.log(res.data);
          this.$parent.newMessage(res.data);
          this.loader = false;
        })
        .catch((error) => {
          if (error !== '') console.log(error);
        });
    },
    onChangeImage() {
      const file = this.$refs.inputImage.files[0];
      if (file) {
        this.labelInputImage = file.name;
        this.image = file;
        this.$refs.buttonPostMessage.disabled = false;
      } else {
        if (!this.content) {
          this.$refs.buttonPostMessage.disabled = true;
        }
        this.labelInputImage = 'Ajouter une images...';
      }
    },
    onChangeContent() {
      if (this.content) {
        this.$refs.buttonPostMessage.disabled = false;
      } else {
        if (!this.image) {
          this.$refs.buttonPostMessage.disabled = true;
        }
      }
    },
  },
  mounted() {
    this.$refs.buttonPostMessage.disabled = true;
  },
};
</script>