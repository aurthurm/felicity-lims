<script setup lang="ts">
import { useNoticeStore } from '@/stores/notice'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, defineAsyncComponent } from 'vue'

// Lazy load components
const FelInbox = defineAsyncComponent(
  () => import("@/components/ui/inbox/FelInbox.vue")
)

// Initialize stores
const authStore = useAuthStore()
const noticeStore = useNoticeStore()

// Load notices on mount
onMounted(() => {
  const user = authStore.auth?.user
  if (user?.uid) {
    noticeStore.fetchMyNotices(user.uid)
  }
})

// Computed properties
const notices = computed(() => noticeStore.getActiveNotices)

// Event handlers
const handleNoticeSelect = (notice: any) => {
  // Handle notice selection
}
</script>

<template>
  <div class="mt-4">
    <h1 class="text-xl text-foreground font-semibold">Notice Board</h1>
    <hr class="my-2" />
    
    <div v-if="notices.length <= 0" class="bg-background rounded-sm shadow-sm p-4 text-muted-foreground">
      You have no notices.
    </div>
    
    <FelInbox 
      v-else
      :items="notices"
      title="Notice Board"
      :loading="noticeStore.fetchingNotices"
      @select="handleNoticeSelect"
    />
  </div>
</template>

<style lang="postcss">
/* Component-specific styles can be added here */
</style>