<template>

  <router-view />
  
</template>

<script setup lang="ts">
  import {reactive } from 'vue'
  import { useStore } from 'vuex';
  import { ActionTypes as AnaysisActionTypes } from '../../../store/modules/analysis'
  const  store = useStore();

  let analysesParams = reactive({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  });

  store.dispatch(AnaysisActionTypes.FETCH_ANALYSES_SERVICES, analysesParams)
</script>