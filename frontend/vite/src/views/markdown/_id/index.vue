<template>

    document detail here 
    <hr>
    <router-view />
    
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes } from '../../../store/modules/markdown';

export default defineComponent({
  name: "worksheet-single",
  setup() {
    const route = useRoute();
    const store = useStore();
    
    store.dispatch(ActionTypes.FETCH_DOCUMENT_BY_UID, +route.params.documentUid)

    return { 
    };
  },
});
</script>