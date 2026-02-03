<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from "vue"
import Drawer from "@/components/ui/Drawer.vue"
import { useNotificationStore } from "@/stores/notification"
import { useStreamStore } from "@/stores/stream"
import useApiUtil from "@/composables/api_util"
import * as guards from "@/guards"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-vue-next"

const UserPreferences = defineAsyncComponent(() => import("@/components/user/UserPreferences.vue"))

type SheetPanel = "errors" | "notifications" | "preferences" | "settings" | null

const openSheet = ref<SheetPanel>(null)
const notificationStore = useNotificationStore()
const streamStore = useStreamStore()
const { errors, clearErrors } = useApiUtil()

// When store asks to show notifications (e.g. addNotification), open the notifications sheet
watch(
  () => notificationStore.show,
  (show) => {
    if (show) openSheet.value = "notifications"
  }
)

const open = (panel: SheetPanel) => {
  openSheet.value = panel
}

const close = () => {
  if (openSheet.value === "notifications") {
    notificationStore.showNotifications(false)
  }
  openSheet.value = null
}

const rightNavItems = [
  {
    id: "errors" as const,
    label: "Errors",
    icon: "exclamation-circle",
    ariaLabel: "Show errors",
    badge: () => errors.value?.length ?? 0,
    showBadge: () => (errors.value?.length ?? 0) > 0,
    show: () => true,
  },
  {
    id: "notifications" as const,
    label: "Notifications",
    icon: "bell",
    ariaLabel: "Show notifications",
    badge: () => notificationStore.getNotifications.length,
    showBadge: () => notificationStore.getNotifications.length > 0,
    show: () => true,
  },
  {
    id: "preferences" as const,
    label: "Preferences",
    icon: "user-gear",
    ariaLabel: "Preferences",
    badge: () => 0,
    showBadge: () => false,
    show: () => true,
  },
  {
    id: "settings" as const,
    label: "Settings",
    icon: "cog",
    ariaLabel: "Settings",
    badge: () => 0,
    showBadge: () => false,
    show: () => guards.canAccessPage(guards.pages.ADMINISTRATION),
  },
]
</script>

<template>
  <div class="relative flex shrink-0">
    <!-- Sheets render first so the aside can stack above them (slide from beneath) -->
    <!-- Errors sheet -->
    <Drawer
      :show="openSheet === 'errors'"
      side="right"
      contentWidth="sm:max-w-md w-full max-w-[calc(100vw-2rem)]"
      disable-portal
      @close="close"
    >
    <template #header>
      <div class="flex flex-col gap-1.5">
        <h3 class="font-semibold text-lg text-foreground">Errors List</h3>
        <p v-if="errors.length > 0" class="text-xs text-muted-foreground">
          {{ errors.length }} error{{ errors.length !== 1 ? 's' : '' }} to display
        </p>
      </div>
    </template>
    <template #body>
      <div v-if="errors.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <p class="text-sm text-muted-foreground">No errors to display</p>
      </div>
      <div v-else class="divide-y divide-border" role="list" aria-label="Error messages">
        <div
          v-for="(err, idx) in errors"
          :key="idx"
          class="flex items-start gap-2 py-3 first:pt-0 last:pb-0 text-sm text-destructive"
        >
          <ChevronRight class="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <span class="whitespace-pre-wrap wrap-break-word">{{ err }}</span>
        </div>
      </div>
    </template>
    <template #footer>
      <Button variant="outline" size="sm" @click="close">
        Close
      </Button>
      <Button
        variant="destructive"
        size="sm"
        @click="clearErrors(); close()"
        :disabled="errors.length === 0"
        aria-label="Clear all errors"
      >
        <font-awesome-icon icon="trash-alt" class="mr-2 size-3.5" aria-hidden="true" />
        Clear all
      </Button>
    </template>
  </Drawer>

  <!-- Notifications sheet -->
  <Drawer
    :show="openSheet === 'notifications'"
    side="right"
    contentWidth="sm:max-w-md w-full max-w-[calc(100vw-2rem)]"
    disable-portal
    @close="close"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <font-awesome-icon icon="bell" class="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 class="text-lg font-semibold tracking-tight text-foreground">Notifications</h2>
          <p class="text-xs text-muted-foreground">Activity and updates</p>
        </div>
      </div>
    </template>
    <template #body>
      <div class="space-y-2">
        <div
          v-if="!streamStore.streams?.length"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <div class="rounded-full bg-muted p-4 mb-4">
            <font-awesome-icon icon="bell" class="text-2xl text-muted-foreground" aria-hidden="true" />
          </div>
          <p class="text-sm font-medium text-foreground">No notifications yet</p>
          <p class="mt-1 text-xs text-muted-foreground max-w-[200px]">
            When you receive activity updates, they'll appear here.
          </p>
        </div>
        <article
          v-for="stream of streamStore.streams"
          :key="stream?.uid"
          class="flex gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50"
          :aria-label="`Notification from ${stream?.actor?.firstName} ${stream?.actor?.lastName}`"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
            aria-hidden="true"
          >
            <font-awesome-icon icon="user" class="text-primary" aria-hidden="true" />
          </div>
          <div class="min-w-0 flex-1 space-y-1">
            <p class="text-sm leading-snug text-foreground">
              <span class="font-medium text-foreground">{{ stream?.actor?.firstName }} {{ stream?.actor?.lastName }}</span>
              <span class="mx-1 text-destructive italic">{{ stream.verb }}</span>
              <span class="text-muted-foreground">{{ stream.actionObjectType }}</span>
              <span class="ml-1 font-medium text-foreground">{{ stream?.actionObject?.sample?.sampleId ?? stream?.actionObject?.sampleId ?? stream?.actionObject?.sampleUid ?? stream?.actionObject?.worksheetId }}</span>
            </p>
          </div>
        </article>
      </div>
    </template>
  </Drawer>

  <!-- Settings sheet -->
  <Drawer
    :show="openSheet === 'settings'"
    side="right"
    contentWidth="sm:max-w-md w-full max-w-[calc(100vw-2rem)]"
    disable-portal
    @close="close"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <font-awesome-icon icon="cog" class="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 class="text-lg font-semibold tracking-tight text-foreground">Settings</h2>
          <p class="text-xs text-muted-foreground">Administration and preferences</p>
        </div>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <router-link
          v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)"
          to="/admin"
          class="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50"
          @click="close"
        >
          <font-awesome-icon icon="cog" class="size-5 text-muted-foreground" aria-hidden="true" />
          <span class="font-medium">Administration</span>
          <font-awesome-icon icon="chevron-right" class="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
        </router-link>
      </div>
    </template>
  </Drawer>

  <!-- Preferences sheet -->
  <Drawer
    :show="openSheet === 'preferences'"
    side="right"
    contentWidth="sm:max-w-md w-full max-w-[calc(100vw-2rem)]"
    disable-portal
    @close="close"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <font-awesome-icon icon="user-gear" class="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 class="text-lg font-semibold tracking-tight text-foreground">Preferences</h2>
          <p class="text-xs text-muted-foreground">Customize your experience</p>
        </div>
      </div>
    </template>
    <template #body>
      <div class="rounded-lg border border-border bg-card p-4 shadow-sm">
        <UserPreferences />
      </div>
    </template>
  </Drawer>

  <aside
    class="relative z-60 flex shrink-0 flex-col border-l border-border bg-sidebar py-2 w-(--right-sidebar-width) min-w-(--right-sidebar-width)"
    role="navigation"
    aria-label="Right sidebar"
  >
    <div class="flex flex-col items-center gap-1 px-2">
      <template v-for="item in rightNavItems" :key="item.id">
        <Button
          v-if="item.show()"
          variant="ghost"
          size="icon"
          :class="[
            'relative h-10 w-10 rounded-lg',
            openSheet === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground',
            item.id === 'errors' && (errors.length > 0 ? 'text-destructive' : 'text-destructive/70')
          ]"
          :aria-label="item.ariaLabel"
          :aria-expanded="openSheet === item.id"
          @click="open(item.id)"
        >
          <font-awesome-icon
            :icon="item.icon"
            class="size-5 shrink-0"
            aria-hidden="true"
          />
          <Badge
            v-if="item.showBadge()"
            :variant="item.id === 'errors' ? 'destructive' : 'secondary'"
            class="absolute -right-0.5 -top-0.5 size-4 min-w-4 justify-center rounded-full p-0 text-[10px]"
          >
            {{ item.badge() }}
          </Badge>
        </Button>
      </template>
    </div>
  </aside>
  </div>
</template>
