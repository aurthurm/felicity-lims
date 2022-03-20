<template>
  <div class="content-preview markdown w-full h-full outline-none border-2 border-gray-500 rounded-md border-dotted p-2">
    <vue3-markdown-it :source="content" class="markdown-wrapper" />
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'FilePreview',
  setup (props, context) {
    const store = useStore();

    return { 
      content:  computed(() => {
        let document = store.getters.getDocument;
        return document.content.toString();
      }),
    }
  }
});
</script>

<style>
/* .markdown p > code,
.markdown li > code {
  box-shadow: 2px 0 0 #eceff4, -2px 0 0 #eceff4;
}

.markdown h1 {
  @apply my-4 font-serif text-3xl;
}

.markdown h2 {
  @apply my-4 font-serif text-2xl;
}

.markdown h3 {
  @apply my-2 font-serif text-xl;
}

.markdown p {
  @apply mb-4 text-justify;
}

.markdown ul {
  @apply mb-4 list-disc;
}

.markdown ol {
  @apply mb-4 list-decimal;
}

.markdown blockquote {
  @apply px-4 py-2 mb-4 mx-0 border-l-8 text-sm;
}

.markdown blockquote p {
  @apply m-0;
} */



.py-05 {
    padding-top: 0.125rem;
    padding-bottom: 0.125rem;
  }
  
  .markdown {
    @apply text-gray-900 leading-normal break-words;
  }
  
  .markdown > * + * {
    @apply mt-0 mb-4;
  }
  
  .markdown li + li {
    @apply mt-1;
  }
  
  .markdown li > p + p {
    @apply mt-6;
  }
  
  .markdown strong {
    @apply font-semibold;
  }
  
  .markdown a {
    @apply text-blue-600 font-semibold;
  }
  
  .markdown strong a {
    @apply font-bold;
  }
  
  .markdown h1 {
    @apply leading-tight border-b text-4xl font-semibold mb-4 mt-6 pb-2;
  }
  
  .markdown h2 {
    @apply leading-tight border-b text-2xl font-semibold mb-4 mt-6 pb-2;
  }
  
  .markdown h3 {
    @apply leading-snug text-lg font-semibold mb-4 mt-6;
  }
  
  .markdown h4 {
    @apply leading-none text-base font-semibold mb-4 mt-6;
  }
  
  .markdown h5 {
    @apply leading-tight text-sm font-semibold mb-4 mt-6;
  }
  
  .markdown h6 {
    @apply leading-tight text-sm font-semibold text-gray-600 mb-4 mt-6;
  }
  
  .markdown blockquote {
    @apply text-base border-l-4 border-gray-300 pl-4 pr-4 text-gray-600;
  }
  
  .markdown code {
    @apply font-mono text-sm inline bg-gray-200 rounded px-1 py-05;
  }
  
  .markdown pre {
    @apply bg-gray-100 rounded p-4;
  }
  
  .markdown pre code {
    @apply block bg-transparent p-0 overflow-visible rounded-none;
  }
  
  .markdown ul {
    @apply text-base pl-8 list-disc;
  }
  
  .markdown ol {
    @apply text-base pl-8 list-decimal;
  }
  
  .markdown kbd {
    @apply text-xs inline-block rounded border px-1 py-05 align-middle font-normal font-mono shadow;
  }
  
  .markdown table {
    @apply text-base border-gray-600;
  }
  
  .markdown th {
    @apply border py-1 px-3;
  }
  
  .markdown td {
    @apply border py-1 px-3;
  }
  
  /* Override pygments style background color. */
  .markdown .highlight pre {
    @apply bg-gray-100 !important;
  }

/* .content-preview {
  width: 50%;
  background-color: antiquewhite;
}
.markdown-wrapper {
  height: calc(100vh - 56px);
}

.markdown-wrapper .fullscreen {
    height: 100vh;
} */

</style>