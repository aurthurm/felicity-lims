<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from "vue"
import { useNotificationStore } from "@/stores/notification"
import { useStreamStore } from "@/stores/stream"
import useApiUtil from "@/composables/api_util"
import * as guards from "@/guards"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronRight } from "lucide-vue-next"
import { RightSidebarPanel } from "@/components/ui/sidebar"
import { adminLinksConfig } from "@/config/adminLinks"

const UserPreferences = defineAsyncComponent(() => import("@/components/user/UserPreferences.vue"))
const VersionDisplay = defineAsyncComponent(() => import("@/views/admin/VersionDisplay.vue"))

type SheetPanel = "errors" | "notifications" | "preferences" | "settings" | "version" | null

const rightSidebarTitle = (panel: SheetPanel) => {
  switch (panel) {
    case "errors": return "Errors"
    case "notifications": return "Notifications"
    case "preferences": return "Preferences"
    case "settings": return "Settings"
    case "version": return "Felicity Version"
    default: return ""
  }
}
const rightSidebarIcon = (panel: SheetPanel) => {
  switch (panel) {
    case "errors": return "exclamation-circle"
    case "notifications": return "bell"
    case "preferences": return "user-gear"
    case "settings": return "cog"
    case "version": return "tag"
    default: return "user"
  }
}

const openSheet = ref<SheetPanel>(null)
const rightPanelOpen = defineModel<boolean>('rightPanelOpen', { default: false })
const notificationStore = useNotificationStore()
const streamStore = useStreamStore()
const { errors, clearErrors } = useApiUtil()

// When store asks to show notifications (e.g. addNotification), open the notifications panel
watch(
  () => notificationStore.show,
  (show) => {
    if (show) openSheet.value = "notifications"
  }
)
watch(openSheet, (v) => {
  rightPanelOpen.value = v !== null
}, { immediate: true })

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
const versionNavItem = {
  id: "version" as const,
  label: "Version",
  icon: "tag",
  ariaLabel: "Version & updates",
  badge: () => 0,
  showBadge: () => false,
  show: () => true,
}
</script>

<template>
  <div
    class="right-sidebar-wrapper flex shrink-0"
    :style="{ '--right-sidebar-panel-width': '320px' }"
  >
    <!-- Panel is fixed: width = min-width = max-width so content cannot change the panel size -->
    <!-- Panel sits below main content (z-5) and is revealed when main content slides left -->
    <div
      class="right-sidebar-panel-fixed fixed inset-y-0 z-5 flex flex-col overflow-hidden"
      :style="{
        right: 'var(--right-sidebar-width, 3rem)',
        width: 'var(--right-sidebar-panel-width)',
        minWidth: 'var(--right-sidebar-panel-width)',
        maxWidth: 'var(--right-sidebar-panel-width)',
      }"
    >
      <RightSidebarPanel
        :open="openSheet !== null"
        :title="rightSidebarTitle(openSheet)"
        :icon="rightSidebarIcon(openSheet)"
        fill-parent
        @close="close"
      >
        <template #default>
          <div class="w-full min-w-0 max-w-full overflow-x-hidden">
            <!-- Errors panel -->
            <template v-if="openSheet === 'errors'">
              <div v-if="errors.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
                <p class="text-xs text-muted-foreground">No errors to display</p>
              </div>
              <div v-else class="divide-y divide-border space-y-1" role="list" aria-label="Error messages">
                <div
                  v-for="(err, idx) in errors"
                  :key="idx"
                  class="flex items-start gap-1.5 py-2 text-xs text-destructive"
                >
                  <ChevronRight class="mt-0.5 size-3 shrink-0 text-destructive" aria-hidden="true" />
                  <span class="whitespace-pre-wrap wrap-break-word min-w-0">{{ err }}</span>
                </div>
              </div>
            </template>

            <!-- Notifications panel -->
            <template v-else-if="openSheet === 'notifications'">
              <div class="space-y-1.5">
                <div
                  v-if="!streamStore.streams?.length"
                  class="flex flex-col items-center justify-center py-8 text-center px-1"
                >
                  <div class="rounded-full bg-muted p-3 mb-3">
                    <font-awesome-icon icon="bell" class="text-lg text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p class="text-xs font-medium text-foreground">No notifications yet</p>
                  <p class="mt-1 text-[11px] text-muted-foreground">
                    When you receive activity updates, they'll appear here.
                  </p>
                </div>
                <article
                  v-for="stream of streamStore.streams"
                  :key="stream?.uid"
                  class="flex gap-2 rounded-md border border-border bg-card p-3 shadow-sm transition-colors hover:bg-accent/50"
                  :aria-label="`Notification from ${stream?.actor?.firstName} ${stream?.actor?.lastName}`"
                >
                  <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10"
                    aria-hidden="true"
                  >
                    <font-awesome-icon icon="user" class="size-3 text-primary" aria-hidden="true" />
                  </div>
                  <div class="min-w-0 flex-1 space-y-0.5 overflow-hidden">
                    <p class="text-xs leading-snug text-foreground line-clamp-2 wrap-break-word">
                      <span class="font-medium text-foreground">{{ stream?.actor?.firstName }} {{ stream?.actor?.lastName }}</span>
                      <span class="mx-0.5 text-destructive italic">{{ stream.verb }}</span>
                      <span class="text-muted-foreground">{{ stream.actionObjectType }}</span>
                      <span class="ml-0.5 font-medium text-foreground">{{ stream?.actionObject?.sample?.sampleId ?? stream?.actionObject?.sampleId ?? stream?.actionObject?.sampleUid ?? stream?.actionObject?.worksheetId }}</span>
                    </p>
                  </div>
                </article>
              </div>
            </template>

            <!-- Settings panel -->
            <template v-else-if="openSheet === 'settings'">
              <div class="flex flex-col gap-0.5">
                <router-link
                  v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)"
                  to="/admin"
                  class="flex items-center gap-2 rounded-sm px-2 py-2 text-sm font-medium transition-colors hover:bg-accent/50"
                >
                  <font-awesome-icon icon="house" class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span class="truncate">Home</span>
                  <font-awesome-icon icon="chevron-right" class="ml-auto size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </router-link>
                <router-link
                  v-for="link in adminLinksConfig"
                  :key="link.path"
                  v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)"
                  :to="link.path"
                  class="flex items-center gap-2 rounded-sm px-2 py-2 text-sm font-medium transition-colors hover:bg-accent/50"
                >
                  <font-awesome-icon :icon="link.icon" class="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <span class="truncate min-w-0">{{ link.title }}</span>
                  <font-awesome-icon icon="chevron-right" class="ml-auto size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </router-link>
              </div>
            </template>

            <!-- Preferences panel -->
            <template v-else-if="openSheet === 'preferences'">
              <UserPreferences compact />
            </template>

            <!-- Version panel -->
            <template v-else-if="openSheet === 'version'">
              <VersionDisplay />
            </template>
          </div>
        </template>

        <template #footer>
          <div v-if="openSheet === 'errors'" class="flex flex-wrap gap-1.5">
            <Button
              variant="destructive"
              size="sm"
              class="h-7 text-xs px-2"
              :disabled="errors.length === 0"
              aria-label="Clear all errors"
              @click="clearErrors()"
            >
              <font-awesome-icon icon="trash-alt" class="mr-1 size-3" aria-hidden="true" />
              Clear all
            </Button>
          </div>
        </template>
      </RightSidebarPanel>
    </div>

    <!-- Spacer reserves width so main content doesn't shift when icon bar is fixed -->
    <div
      class="w-(--right-sidebar-width) min-w-(--right-sidebar-width) shrink-0 bg-transparent"
      aria-hidden="true"
    />
    <!-- Icon bar: fixed so it stays visible on scroll (matches left sidebar behavior) -->
    <!-- Icon bar sits above everything (z-30) so it's always accessible -->
    <aside
      class="fixed right-0 top-0 bottom-0 z-30 flex h-svh shrink-0 flex-col border-l border-border bg-sidebar py-2 w-(--right-sidebar-width) min-w-(--right-sidebar-width) transition-[width] duration-200 ease-linear"
      role="navigation"
      aria-label="Right sidebar"
    >
      <div class="flex flex-1 flex-col items-center gap-1 px-2">
        <template v-for="item in rightNavItems" :key="item.id">
          <Tooltip v-if="item.show()">
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                :class="[
                  'relative h-10 w-10 rounded-lg',
                  openSheet === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground',
                  item.id === 'errors' && (errors.length > 0 ? 'text-destructive' : 'text-destructive/70')
                ]"
                :aria-label="item.ariaLabel"
                :aria-expanded="openSheet === item.id"
                @click="open(openSheet === item.id ? null : item.id)"
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
            </TooltipTrigger>
            <TooltipContent side="left" align="center">
              {{ item.label }}
            </TooltipContent>
          </Tooltip>
        </template>
      </div>
      <div class="mt-auto flex flex-col items-center gap-1 px-2 pb-2">
        <Tooltip v-if="versionNavItem.show()">
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              :class="[
                'relative h-10 w-10 rounded-lg',
                openSheet === versionNavItem.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
              ]"
              :aria-label="versionNavItem.ariaLabel"
              :aria-expanded="openSheet === versionNavItem.id"
              @click="open(openSheet === versionNavItem.id ? null : versionNavItem.id)"
            >
              <font-awesome-icon
                :icon="versionNavItem.icon"
                class="size-5 shrink-0"
                aria-hidden="true"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" align="center">
            {{ versionNavItem.label }}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  </div>
</template>
