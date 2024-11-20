<script setup lang="ts">
import { useNoticeStore } from '@/stores/notice'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, defineAsyncComponent } from 'vue'
const FelInbox = defineAsyncComponent(
  () => import("@/components/ui/inbox/FelInbox.vue")
)
const authStore = useAuthStore();
const noticeStore = useNoticeStore();

onMounted(() => {
  const user = authStore.auth?.user;
  noticeStore.fetchMyNotices(user?.uid!)
})

const notices = computed(() => noticeStore.getActiveNotices)

const handleNoticeSelect = (notice) => {
  console.log('Selected notice:', notice)
}
</script>

<template>
    <FelInbox
      :items="notices"
      title="Notice Board"
      :loading="noticeStore.fetchingNotices"
      @select="handleNoticeSelect"
    />
</template>