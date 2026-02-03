<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue"
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import * as guards from "@/guards"

const Logo = defineAsyncComponent(() => import("@/components/logo/Logo.vue"))
useSidebar()

const navItems = computed(() => [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "tachometer-alt",
    route: "/dashboard",
    guard: guards.pages.DASHBOARD,
  },
  {
    id: "billing",
    label: "Billing",
    icon: "money-bill",
    route: "/billing",
    guard: guards.pages.BILLING,
  },
  {
    id: "patients-compact",
    label: "Compact",
    icon: "bullseye",
    route: "/patients-compact",
    guard: guards.pages.PATIENTS_COMPACT,
  },
  {
    id: "patients",
    label: "Patients",
    icon: "user-injured",
    route: "/patients",
    guard: guards.pages.PATIENTS,
  },
  {
    id: "clients",
    label: "Clients",
    icon: "clinic-medical",
    route: "/clients",
    guard: guards.pages.CLIENTS,
  },
  {
    id: "samples",
    label: "Samples",
    icon: "vial",
    route: "/samples",
    guard: guards.pages.SAMPLES,
  },
  {
    id: "worksheets",
    label: "WorkSheets",
    icon: "grip-vertical",
    route: "/worksheets",
    guard: guards.pages.WORKSHEETS,
  },
  {
    id: "quality-control",
    label: "QControl",
    icon: "anchor",
    route: "/quality-control",
    guard: guards.pages.QC_SAMPLES,
  },
  {
    id: "notice-manager",
    label: "NoticeManager",
    icon: "bell",
    route: "/notice-manager",
    guard: guards.pages.NOTICE_MANAGER,
  },
  {
    id: "bio-banking",
    label: "BioBanking",
    icon: "database",
    route: "/bio-banking",
    guard: guards.pages.BIO_BANKING,
  },
  {
    id: "shipments",
    label: "Referrals",
    icon: "truck",
    route: "/shipments",
    guard: guards.pages.REFERRAL,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: "fa-solid fa-boxes-stacked",
    route: "/inventory",
    guard: guards.pages.INVENTORY,
  },
  {
    id: "schemes",
    label: "Projects",
    icon: "project-diagram",
    route: "/schemes",
    guard: guards.pages.SCHEMES,
  },
  {
    id: "documents",
    label: "Documents",
    icon: "file",
    route: "/documents",
    guard: guards.pages.DOCUMENT,
  },
])
</script>

<template>
  <div class="flex h-full min-w-0 flex-col overflow-x-hidden">
    <SidebarHeader class="flex h-10 flex-row items-center px-2 py-1">
      <router-link
        to="/"
        class="flex h-8 min-w-8 items-center justify-center gap-2 overflow-hidden rounded-md"
      >
        <Logo styling="size-8 shrink-0" />
        <span
          class="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden"
        >
          Felicity LIMS
        </span>
      </router-link>
    </SidebarHeader>

    <SidebarContent class="border-t border-b border-sidebar-border px-2">
      <SidebarMenu>
        <SidebarMenuItem
          v-for="item in navItems"
          :key="item.id"
          v-show="guards.canAccessPage(item.guard)"
        >
          <SidebarMenuButton as-child :tooltip="item.label" class="px-3">
            <router-link :to="item.route" class="flex items-center gap-3">
              <font-awesome-icon :icon="item.icon" class="size-4 shrink-0" />
              <span class="truncate">{{ item.label }}</span>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>

    <SidebarFooter class="px-2 py-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child tooltip="About" class="px-3">
            <router-link to="/about" class="flex items-center gap-3">
              <font-awesome-icon icon="info" class="size-4 shrink-0" />
              <span class="truncate">About</span>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </div>
</template>
