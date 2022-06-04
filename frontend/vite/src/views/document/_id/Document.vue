<script setup lang="ts">
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { ref, onMounted, onBeforeUnmount, onUnmounted, computed, watch } from "vue";
import { EDIT_MARKDOWN_DOCUMENT } from "../../../graphql/markdown.mutations";
import { useDocumentStore } from "../../../stores";
import { useApiUtil } from "../../../composables";

const documentStore = useDocumentStore();
const { withClientMutation } = useApiUtil();

let timeout: any;
let dataSaved = ref(true);

let article = computed(() => documentStore.getDocument);

function editDocument(data: string): void {
  const payload = {
    content: data,
    name: article.value?.name,
    departmentUid: article.value?.departmentUid,
  };
  withClientMutation(
    EDIT_MARKDOWN_DOCUMENT,
    { uid: article.value?.uid, payload },
    "updateDocument"
  ).then((result) => {
    documentStore.updateDocument(result);
    dataSaved.value = true;
  });
}

watch(
  () => article.value,
  (incoming, prev) => {
    if (incoming?.content != prev?.content) {
      if (article.value?.content) {
        (window as any).editor?.setData(article.value?.content);
      }
    }
  }
);

function updateContent(): void {
  dataSaved.value = false;
  const data = (window as any).editor?.getData();
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    editDocument(data);
  }, 2000);
}

onMounted(() => {
  DecoupledEditor.create(document.querySelector(".document-editor__editable"), {})
    .then((editor) => {
      const toolbarContainer = document.querySelector(".document-editor__toolbar");
      toolbarContainer!.appendChild(editor.ui.view.toolbar.element);
      editor?.model?.document?.on("change:data", () => {
        console.log("docume data change");
        updateContent();
      });
      (window as any).editor = editor;
    })
    .catch((err) => {
      console.error(err);
    });
});

onBeforeUnmount(() => {
  if (!dataSaved.value) {
    const data = (window as any).editor?.getData();
    if (data?.length > 1) {
      editDocument((window as any).editor?.getData());
    }
  }
});

onUnmounted(() => (window as any).editor.destroy());
</script>

<style lang="css">
.document-editor {
  border: 1px solid var(--ck-color-base-border);
  border-radius: var(--ck-border-radius);
  max-height: 800px;
  display: flex;
  flex-flow: column nowrap;
}

.document-editor__toolbar {
  z-index: 1;
  box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.2);
  border-bottom: 1px solid var(--ck-color-toolbar-border);
}

.document-editor__toolbar .ck-toolbar {
  border: 0;
  border-radius: 0;
}

.document-editor__editable-container {
  padding: calc(2 * var(--ck-spacing-large));
  /* background: var(--ck-color-base-foreground); */
  overflow-y: scroll;
}

.document-editor__editable-container .ck-editor__editable {
  width: 15.8cm;
  min-height: 21cm;
  padding: 1cm 2cm 2cm;
  border: 1px hsl(0, 0%, 82.7%) solid;
  border-radius: var(--ck-border-radius);
  background: white;
  box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.1);
  margin: 0 auto;
}

.document-editor .ck-content,
.document-editor .ck-heading-dropdown .ck-list .ck-button__label {
  font: 16px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.document-editor .ck-heading-dropdown .ck-list .ck-button__label {
  line-height: calc(1.7 * var(--ck-line-height-base) * var(--ck-font-size-base));
  min-width: 6em;
}

.document-editor
  .ck-heading-dropdown
  .ck-list
  .ck-button:not(.ck-heading_paragraph)
  .ck-button__label {
  transform: scale(0.8);
  transform-origin: left;
}

.document-editor .ck-content h2,
.document-editor .ck-heading-dropdown .ck-heading_heading1 .ck-button__label {
  font-size: 2.18em;
  font-weight: normal;
}

.document-editor .ck-content h2 {
  line-height: 1.37em;
  padding-top: 0.342em;
  margin-bottom: 0.142em;
}

.document-editor .ck-content h3,
.document-editor .ck-heading-dropdown .ck-heading_heading2 .ck-button__label {
  font-size: 1.75em;
  font-weight: normal;
  color: hsl(203, 100%, 50%);
}

.document-editor .ck-heading-dropdown .ck-heading_heading2.ck-on .ck-button__label {
  color: var(--ck-color-list-button-on-text);
}

.document-editor .ck-content h3 {
  line-height: 1.86em;
  padding-top: 0.171em;
  margin-bottom: 0.357em;
}
.document-editor .ck-content h4,
.document-editor .ck-heading-dropdown .ck-heading_heading3 .ck-button__label {
  font-size: 1.31em;
  font-weight: bold;
}

.document-editor .ck-content h4 {
  line-height: 1.24em;
  padding-top: 0.286em;
  margin-bottom: 0.952em;
}

.document-editor .ck-content p {
  font-size: 1em;
  line-height: 1.63em;
  padding-top: 0.5em;
  margin-bottom: 1.13em;
}

.document-editor .ck-content blockquote {
  font-family: Georgia, serif;
  margin-left: calc(2 * var(--ck-spacing-large));
  margin-right: calc(2 * var(--ck-spacing-large));
}

/* for more visit 
    https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/ui/document-editor.html 
  */
</style>

<template>
  <div class="document-editor">
    <div class="document-editor__toolbar"></div>
    <div class="document-editor__editable-container bg-gray-200">
      <div
        class="document-editor__editable border-2 border-dotted border-orange-600"
      ></div>
      <div class="absolute top-96 right-72">
        <div
          v-if="!dataSaved"
          class="flex items-center justify-center space-x-2 animate-ping my-4"
        >
          <div class="w-2 h-2 bg-sky-800 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-sky-800 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
        </div>
        <div v-else>
          <font-awesome-icon icon="check-circle" class="text-sky-800" />
        </div>
      </div>
    </div>
  </div>
</template>
