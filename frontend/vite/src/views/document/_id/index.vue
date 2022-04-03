<template>

    document detail here 
    
    <hr>

    <router-view />
    
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { useDocumentStore } from '../../../stores';

  const route = useRoute();
  const documentStore = useDocumentStore();
  
  documentStore.fetchDocumentByUid(+route.params.documentUid)
</script>