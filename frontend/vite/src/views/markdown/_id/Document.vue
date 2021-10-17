<template>
  <div class="split border-4 border-gray-300 rounded-md border-double bg-white">
      <section id="sourceSection" class="m-2">
        <span v-if="loading"> loading .... </span>
        <textarea v-else class="w-full h-full outline-none border-2 border-gray-500 rounded-md border-dotted p-2" :value='document.content' @input="updateContent($event)" placeholder="hey" name="tt"></textarea>
      </section>
      <section id="previewSection"  class="m-2 overflow-auto">
        <span v-if="loading"> loading .... </span>
        <Preview v-else/>
      </section>
  </div>
</template>

<script lang="ts">
import Split from 'split.js'
import MarkdownIt from 'markdown-it';
import Preview from './Preview.vue'
import VueMarkdownIt from 'vue3-markdown-it';
import { useMutation } from '@urql/vue';
import { useStore } from 'vuex';
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue';
import { EDIT_MARKDOWN_DOCUMENT } from '../../../graphql/markdown.mutations';
import { ActionTypes } from '../../../store/modules/markdown';
import { isCompositeType } from 'graphql';
export default defineComponent({
  name: "mark-down-docs",
  components: {
    VueMarkdownIt,
    Preview
  },
  setup() {
    const store = useStore();
    const md = new MarkdownIt();
    let timeout: any;
    let loading = ref(true);
    let document = reactive({ ...new Object });
    let content = computed(() => store.getters.getDocument );
    const { executeMutation: udateDocument } = useMutation(EDIT_MARKDOWN_DOCUMENT);

    function editDocument(payload: string): void {
      udateDocument({ uid: document.uid, content: payload }).then((result) => {
        console.log(result)
        // store.dispatch(ActionTypes.SET_DOCUMENT, result);
      });
    }

    watch(() => content.value, (incoming, prev) => {
      Object.assign(document, { ...incoming })
      loading.value = false;
    });

    let result = md.render(document?.content || "");

    function updateContent(event: any): void {
        store.dispatch(ActionTypes.UPDATE_DOCUMENT_CONTENT, event.target.value)
        if (timeout) clearTimeout(timeout); 
        timeout = setTimeout(() => {
          editDocument(event.target.value)
        }, 2000); 
        result = md.render(event.target.value);
    }

    onMounted(() => {
      Split(['#sourceSection', '#previewSection']);
    })

    return { 
      loading, 
      document, 
      result, 
      updateContent 
    }
  },
  data() {
    return {}
  },
});
</script>


<style lang="css">
html,
body,
#split {
    margin: 0;
    height: 100%;
    font-family: "Helvetica Neue", Arial, sans-serif;
    color: rgb(51, 51, 51);
}

textarea {
    resize: none;
    font-size: 14px;
    font-family: "Monaco", courier, monospace;
}

.split {
    display: flex;
    flex-direction: row;
    height: 85vh;
}

.gutter {
    background-color: rgb(218, 216, 216);
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}

</style>  