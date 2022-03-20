<template>
    <!-- <ckeditor 
    :editor="editor" 
    v-model="editorData" 
    :config="editorConfig"
    @ready="onReady"
    @input="updateContent"></ckeditor> -->
    <div class="document-editor">
      <div class="document-editor__toolbar"></div>
        <div class="document-editor__editable-container">
            <div class="document-editor__editable">
                <p>The initial editor data.</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import CKEditor from '@ckeditor/ckeditor5-vue'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import { useMutation } from '@urql/vue';
import { useStore } from 'vuex';
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import { EDIT_MARKDOWN_DOCUMENT } from '../../../graphql/markdown.mutations';
import { ActionTypes } from '../../../store/modules/markdown';

export default defineComponent({
  name: "mark-down-docs",
  components: {
    ckeditor: CKEditor.component
  },
  data() {
    return {
      editor: DecoupledEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {}
    }
  },
  setup() {
    const store = useStore();
    
    let timeout: any;
    let loading = ref(true);
    let documentX = reactive({}) as any;
    let content = computed(() => store.getters.getDocument );
    const { executeMutation: udateDocument } = useMutation(EDIT_MARKDOWN_DOCUMENT);

    function editDocument(data: string): void {
      const payload = { content: data, name: documentX.name, departmentUid: documentX.departmentUid}
      udateDocument({ uid: documentX.uid, payload }).then((result) => {
        console.log(result)
        // store.dispatch(ActionTypes.SET_DOCUMENT, result);
      });
    }

    watch(() => content.value, (incoming, prev) => {
      Object.assign(document, { ...incoming })
      loading.value = false;
    });

    function updateContent(event: any): void {
        // store.dispatch(ActionTypes.UPDATE_DOCUMENT_CONTENT, event.target.value)
        // if (timeout) clearTimeout(timeout); 
        // timeout = setTimeout(() => {
        //   editDocument(event.target.value)
        // }, 2000); 
        console.log(event.target?.innerHTML)
    }

    onMounted(() => {
      DecoupledEditor
        .create( document.querySelector('.document-editor__editable'),{})
        .then( editor => {
            const toolbarContainer = document.querySelector('.document-editor__toolbar');
            toolbarContainer!.appendChild( editor.ui.view.toolbar.element );
            window.editor = editor;
        } )
        .catch( err => {
            console.error( err );
        } );
    })

    return { 
      loading, 
      document, 
      updateContent, 
      onReady: editor => {
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
      }
    }
  },
});
</script>


<style lang="css">
  .document-editor {
      border: 1px solid var(--ck-color-base-border);
      border-radius: var(--ck-border-radius);
      max-height: 700px;
      display: flex;
      flex-flow: column nowrap;
  }

  .document-editor__toolbar {
      z-index: 1;
      box-shadow: 0 0 5px hsla( 0,0%,0%,.2 );
      border-bottom: 1px solid var(--ck-color-toolbar-border);
  }

  .document-editor__toolbar .ck-toolbar {
      border: 0;
      border-radius: 0;
  }

  .document-editor__editable-container {
      padding: calc( 2 * var(--ck-spacing-large) );
      background: var(--ck-color-base-foreground);
      overflow-y: scroll;
  }

  .document-editor__editable-container .ck-editor__editable {
      width: 15.8cm;
      min-height: 21cm;
      padding: 1cm 2cm 2cm;
      border: 1px hsl( 0,0%,82.7% ) solid;
      border-radius: var(--ck-border-radius);
      background: white;
      box-shadow: 0 0 5px hsla( 0,0%,0%,.1 );
      margin: 0 auto;
  }

  .document-editor .ck-content,
  .document-editor .ck-heading-dropdown .ck-list .ck-button__label {
      font: 16px/1.6 "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .document-editor .ck-heading-dropdown .ck-list .ck-button__label {
      line-height: calc( 1.7 * var(--ck-line-height-base) * var(--ck-font-size-base) );
      min-width: 6em;
  }

  .document-editor .ck-heading-dropdown .ck-list .ck-button:not(.ck-heading_paragraph) .ck-button__label {
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
      padding-top: .342em;
      margin-bottom: .142em;
  }

  .document-editor .ck-content h3,
  .document-editor .ck-heading-dropdown .ck-heading_heading2 .ck-button__label {
      font-size: 1.75em;
      font-weight: normal;
      color: hsl( 203, 100%, 50% );
  }

  .document-editor .ck-heading-dropdown .ck-heading_heading2.ck-on .ck-button__label {
      color: var(--ck-color-list-button-on-text);
  }

  .document-editor .ck-content h3 {
      line-height: 1.86em;
      padding-top: .171em;
      margin-bottom: .357em;
  }
  .document-editor .ck-content h4,
  .document-editor .ck-heading-dropdown .ck-heading_heading3 .ck-button__label {
      font-size: 1.31em;
      font-weight: bold;
  }

  .document-editor .ck-content h4 {
      line-height: 1.24em;
      padding-top: .286em;
      margin-bottom: .952em;
  }

  .document-editor .ck-content p {
      font-size: 1em;
      line-height: 1.63em;
      padding-top: .5em;
      margin-bottom: 1.13em;
  }

  .document-editor .ck-content blockquote {
      font-family: Georgia, serif;
      margin-left: calc( 2 * var(--ck-spacing-large) );
      margin-right: calc( 2 * var(--ck-spacing-large) );
  }

  /* for more visit 
    https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/ui/document-editor.html 
  */
</style>  