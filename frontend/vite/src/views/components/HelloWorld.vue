<template>
  <h1>{{ state.msg }}</h1>
</template>

<script>
import { reactive, toRefs, watchEffect } from 'vue';
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props) {
    let state = reactive({
      count1: 0,
      msg: props.msg,
    });
    function increment() {
      state.count1++;
    }
    return {
      state,
      increment,
    };
  },
  data() {
    return {
      count: 0,
    };
  },
};
</script>
