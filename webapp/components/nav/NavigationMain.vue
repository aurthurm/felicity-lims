<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import useApiUtil from "@/composables/api_util"
import userPreferenceComposable from "@/composables/preferences"
import { useConfirmDialog } from "@/composables/confirm_dialog"
import * as guards from "@/guards"
import { VITE_USE_MEGA_MENU } from '@/conf'
import { useFullscreen } from "@vueuse/core"
import { LaboratoryType } from "@/types/gql"
import { SwitchActiveLaboratoryDocument } from "@/graphql/operations/_mutations"
import { SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables } from "@/types/gqlops"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"

const { isFullscreen, toggle } = useFullscreen()
const { alert } = useConfirmDialog()

// Auth and user information
const authStore = useAuthStore()
const activeLaboratory = computed<LaboratoryType | undefined>(
  () => authStore.auth?.activeLaboratory
)
const userLaboratories = computed(
  () => authStore.auth?.laboratories
)
const userFullName = computed(() => {
  const firstName = authStore.auth?.user?.firstName || ''
  const lastName = authStore.auth?.user?.lastName || ''
  return `${firstName} ${lastName}`.trim()
})

const { withClientMutation } = useApiUtil()

// Theme management
const { loadPreferredTheme } = userPreferenceComposable()
onMounted(() => {
  loadPreferredTheme()
})

// Navigation items for more maintainable structure
const navItems = computed(() => [
  {
    id: "patients-compact",
    label: "Compact",
    icon: "bullseye",
    route: "/patients-compact",
    guard: guards.pages.PATIENTS_COMPACT
  },
  {
    id: "patients",
    label: "Patients",
    icon: "user-injured",
    route: "/patients",
    guard: guards.pages.PATIENTS
  },
  {
    id: "clients",
    label: "Clients",
    icon: "clinic-medical",
    route: "/clients",
    guard: guards.pages.CLIENTS
  },
  {
    id: "samples",
    label: "Samples",
    icon: "vial",
    route: "/samples",
    guard: guards.pages.SAMPLES
  },
  {
    id: "worksheets",
    label: "WorkSheets",
    icon: "grip-vertical",
    route: "/worksheets",
    guard: guards.pages.WORKSHEETS
  },
  {
    id: "quality-control",
    label: "QControl",
    icon: "anchor",
    route: "/quality-control",
    guard: guards.pages.QC_SAMPLES
  },
  {
    id: "notice-manager",
    label: "NoticeManager",
    icon: "bell",
    route: "/notice-manager",
    guard: guards.pages.NOTICE_MANAGER
  },
  {
    id: "bio-banking",
    label: "BioBanking",
    icon: "database",
    route: "/bio-banking",
    guard: guards.pages.BIO_BANKING
  },
  {
    id: "shipments",
    label: "Referrals",
    icon: "truck",
    route: "/shipments",
    guard: guards.pages.REFERRAL
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "fa-solid fa-boxes-stacked",
    route: "/inventory",
    guard: guards.pages.INVENTORY
  },
  {
    id: "schemes",
    label: "Projects",
    icon: "project-diagram",
    route: "/schemes",
    guard: guards.pages.SCHEMES
  },
  {
    id: "documents",
    label: "Documents",
    icon: "file",
    route: "/documents",
    guard: guards.pages.DOCUMENT
  }
])

const propsNav = withDefaults(
  defineProps<{ showSidebarToggle?: boolean }>(),
  { showSidebarToggle: false }
)
const showModal = ref(false)
const targetLaboratoryUid = ref<string | null>(null)
const switching = ref(false)
const updateTargetLaboratoryUid = (value: string) => {
  targetLaboratoryUid.value = value || null
}
const switchLabNow = () => {
  if (!targetLaboratoryUid.value) {
    alert({
      title: "Select a Laboratory",
      description: "Please select a laboratory to switch to.",
      confirmText: "OK",
      variant: "default",
    })
    return
  }
  switching.value = true
  setTimeout(async () => {
    await withClientMutation<SwitchActiveLaboratoryMutation, SwitchActiveLaboratoryMutationVariables>(
          SwitchActiveLaboratoryDocument, 
          {userUid: authStore.auth?.user?.uid, laboratoryUid: targetLaboratoryUid.value}, 
          'setUserActiveLaboratory'
    ).then(_ => authStore.logout()).catch(() => undefined).finally(() => {
      showModal.value = false
      switching.value = false
    })
  }, 3000)
}
</script>

<template>
  <nav
      id="main-nav"
      class="flex min-h-10 items-center border-b px-4"
      role="navigation"
      aria-label="Main Navigation"
  >
    <!-- Sidebar toggle (when in sidebar layout) -->
    <SidebarTrigger
      v-if="propsNav.showSidebarToggle"
      class="-ml-2 mr-2 h-8 w-8 shrink-0 hover:bg-transparent"
    />

    <!-- Brand and menu section -->
    <div class="flex-1">
      <div class="flex text-right align-middle">
        <!-- Brand name (logo is in sidebar header) -->
        <router-link
            to="/"
            id="brand"
            class="flex items-center md:w-auto py-1"
            aria-label="Felicity LIMS Home"
        >
          <h1 class="text-left text-sm font-medium">
            {{ activeLaboratory?.name ?? "Felicity LIMS" }}
          </h1>
        </router-link>

        <span v-if="VITE_USE_MEGA_MENU" class="mx-4 h-5 border-l" aria-hidden="true"></span>

        <DropdownMenu v-if="VITE_USE_MEGA_MENU">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm">
              Menu
              <font-awesome-icon icon="chevron-down" class="ml-1.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" class="w-[520px] p-4">
            <div class="grid grid-cols-3 gap-2">
              <DropdownMenuItem
                v-for="item in navItems"
                :key="item.id"
                v-show="guards.canAccessPage(item.guard)"
                as-child
              >
                <router-link
                  :to="item.route"
                  :id="`${item.id}-link`"
                  class="flex items-center gap-2"
                >
                  <font-awesome-icon :icon="item.icon" />
                  <span class="text-sm font-medium">{{ item.label }}</span>
                </router-link>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- User section and actions -->
    <div class="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm">
            <font-awesome-icon icon="user" class="mr-1.5 size-3.5" />
            <span class="text-sm font-medium">{{ userFullName }}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="authStore.logout()">
            <font-awesome-icon icon="sign-out-alt" class="mr-2" aria-hidden="true"/>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        v-if="(userLaboratories?.length ?? 0) > 1"
        variant="ghost"
        size="icon-sm"
        @click="showModal = true"
        aria-label="Switch laboratory"
      >
        <font-awesome-icon icon="shuffle" aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        @click="toggle"
        :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
      >
        <font-awesome-icon :icon="isFullscreen ? 'compress' : 'expand'"/>
      </Button>
    </div>
  </nav>

    <!-- Lab Switcher -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">Current Laboratory Switcher</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="space-y-6 p-6">
        <div class="space-y-2">
          <span class="text-sm font-medium">Laboratory Name</span>
          <Select
            :model-value="targetLaboratoryUid ?? ''"
            @update:model-value="updateTargetLaboratoryUid"
          >
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Select Department</SelectItem>
              <SelectItem v-for="lab in userLaboratories" :key="lab.uid" :value="lab?.uid">
                {{ lab.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          @click.prevent="switchLabNow()"
          :disabled="switching"
          class="w-full"
        >
          <Spinner v-if="switching" class="mr-2 size-4" />
          Switch Laboratory
        </Button>
      </form>
    </template>
  </Modal>

</template>
