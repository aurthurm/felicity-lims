
<template>
  <div>
    <input
      type="text"
      placeholder="请输入标题"
      v-model="currentTitle"
      @blur="hadnleTitleBlur"
    />
    <div class="content-edit">
      <input type="textarea" class="textarea" v-model="content" :rows="48" />
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref } from 'vue'
import mitt from 'mitt'
export const emitter = mitt()
export default {
  name: 'FileEdit',
  inheritAttrs: false,
  props: {
    title: String
  },
  setup (props, { emit }) {
    const content = ref('')
    const currentTitle = ref(props.title)
    watch(content, newContent => {
      // emitter.emit('editor-content', newContent)
      emit('update:content', newContent)
      emit('change', newContent)
    })
    watch(props.title, newVal => {
      currentTitle.value = newVal
    })
    watch(currentTitle, newVal => {
      emit('update:title', newVal)
    })
    const hadnleTitleBlur = (event:any) => {
      console.log(event.target.value)
      emit('title-blur', event.target.value)
    }
    return {
      content,
      currentTitle,
      hadnleTitleBlur
    }
  }
}
</script>

<style scoped>
.markdown-wrapper {
  height: calc(100vh - 40px);
}
</style>
