<script setup lang="ts">
import { watch, ref, onMounted, computed, defineAsyncComponent } from "vue";
import { useNotificationStore } from "@/stores/notification";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import useApiUtil from "@/composables/api_util";
import userPreferenceComposable from "@/composables/preferences";
import * as guards from "@/guards";
const Logo = defineAsyncComponent(
  () => import("@/components/logo/Logo.vue")
)
const Drawer = defineAsyncComponent(
  () => import("@/components/ui/FelDrawer.vue")
)

// MegaMenu Dropdown
const menuOpen = ref(false);
const router = useRouter()
watch(() => router.currentRoute.value, (p, n) => {
  if(p.path != n.path) {
    menuOpen.value = false
  }
})

// Auth User
const authStore = useAuthStore();
const userFullName = computed(
  () => `${authStore.auth?.user?.firstName} ${authStore.auth?.user?.lastName}`
);

// User menu
const dropdownOpen = ref(false);

// Theme Management
const { loadPreferedTheme } = userPreferenceComposable();
onMounted(() => loadPreferedTheme());

// Notifications and Errors
const { errors, clearErrors } = useApiUtil()
const showErrors = ref(false)

const notificationStore = useNotificationStore();
const showNotifications = (val) => notificationStore.showNotifications(val);
</script>

<template>
  <nav id="main-nav" class="flex items-center px-6 bg-sky-800" role="navigation">
    <div class="flex-1">
      <div class="flex text-right align-middle">
        <router-link to="/" id="brand" class="flex items-center md:w-auto text-white">
          <Logo />
          <h1 class="text-left text-2xl font-medium mx-2 transition-all duration-500">Felicity LIMS</h1>
        </router-link>

        <span class="mx-8 border-l-2 border-gray-400 my-2"></span>
        
        <div @click="menuOpen = !menuOpen" class="hidden md:flex md:items-center">
          <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Menu</span>
          <div>
            <font-awesome-icon icon="chevron-down" class="text-gray-400" />
          </div>
        </div>

        <div v-show="menuOpen" class="absolute left-16 ml-8 top-16 mt-1 p-4 w-2/4 bg-sky-800 rounded-sm shadow-xl z-20">
          <div id="aside-nav" class="grid grid-rows-4 grid-flow-col gap-4" role="navigation">
            <!-- <router-link v-show="guards.canAccessPage(guards.pages.DASHBOARD)" to="/dashboard" id="dashboard-link"
              class="flex items-center has-tooltip mt-1 p-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="tachometer-alt" /></span>
              <span class="">Dashboard</span>
            </router-link> -->
            <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS_COMPACT)" to="/patients-compact"
              id="patients-compact-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="bullseye" /></span>
              <span class="text-xl font-bold mr-2 uppercase">Compact</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.PATIENTS)" to="/patients" id="patients-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="user-injured" /></span>
              <span class="text-xl font-bold mr-2 uppercase">Patients</span>
          </router-link>
          <router-link v-show="guards.canAccessPage(guards.pages.CLIENTS)" to="/clients" id="clients-link"
            class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
            <span class="mr-4"><font-awesome-icon icon="clinic-medical" /></span>
            <span class="text-xl font-bold mr-2 uppercase">Clients</span>
          </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.SAMPLES)" to="/samples" id="samples-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="vial" /></span>
              <span class="text-xl font-bold mr-2 uppercase">Samples</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.WORKSHEETS)" to="/worksheets" id="worksheets-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="grip-vertical" /></span>
              <span class="text-xl font-bold mr-2 uppercase">WorkSheets</span>
            </router-link>
            <router-link
              v-show="guards.canAccessPage(guards.pages.QC_SAMPLES)"
              to="/quality-control"
              id="quality-control-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white"
            >
              <span class="mr-4"><font-awesome-icon icon="anchor" /></span>
              <span class="text-xl font-bold mr-2 uppercase">QControl</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.NOTICE_MANAGER)" to="/notice-manager"
              id="notice-manager-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="bell" /></span>
              <span class="text-xl font-bold mr-2 uppercase">NoticeManager</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.BIO_BANKING)" to="/bio-banking" id="bio-banking-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="database" /></span>
              <span class="text-xl font-bold mr-2 uppercase">BioBanking</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.REFERRAL)" to="/shipments" id="shipments-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="truck" /></span>
              <span class="text-xl font-bold mr-2 uppercase">Referrals</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.INVENTORY)" to="/inventory" id="inventory-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="fa-solid fa-boxes-stacked" /></span>
              <span class="text-xl font-bold mr-2 uppercase">Inventory</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.SCHEMES)" to="/schemes" id="scheme-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="project-diagram" /></span>
              <span class="text-xl font-bold mr-2 uppercase">Projects</span>
            </router-link>
            <router-link v-show="guards.canAccessPage(guards.pages.DOCUMENT)" to="/documents" id="documents-link"
              class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-100 hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              <span class="mr-4"><font-awesome-icon icon="file" /></span>
              <span class="text-xl font-bold mr-2 uppercase">Documents</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- <span
          @click="toggleTheme()"
          class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
        >
          <font-awesome-icon :icon="theme?.icon" class="mr-2" />
          <span class="text-sm">{{ theme?.variant }} mode</span>
        </span> -->
      <a v-show="errors.length > 0"
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
        @click="showErrors = true"
        >
        <font-awesome-icon icon="bell" class="mr-2" />
        <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Errors</span>
      </a>
      
      <span v-show="errors.length > 0" class="mx-4 border-l-2 border-gray-400"></span>

      <a
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
        @click="showNotifications(true)">
        <font-awesome-icon icon="bell" class="mr-2" />
        <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Notifications</span>
      </a>
      
      <span class="mx-4 border-l-2 border-gray-400"></span>

      <router-link v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)" to="/admin"
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark">
        <font-awesome-icon icon="cog" class="mr-2" />
        <span class="text-gray-50 text-xl font-bold mr-2 uppercase">Settings</span>
      </router-link>
      
      <span class="mx-4 border-l-2 border-gray-400"></span>

      <div class="px-4 flex text-right align-middle">
        <span
          class="flex justify-center items-center h-8 w-8 rounded-full border-2 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none text-white">
          <font-awesome-icon icon="user" />
        </span>
        <div class="relative">
          <div @click="dropdownOpen = !dropdownOpen" class="hidden md:flex md:items-center ml-2">
            <span class="text-gray-50 text-xl font-bold mr-2 uppercase">{{ userFullName }}</span>
            <div>
              <font-awesome-icon icon="chevron-down" class="text-gray-400" />
            </div>
          </div>

          <div v-show="dropdownOpen" class="absolute right-0 top-12 mt-1 py-2 w-48 bg-sky-800 rounded-sm shadow-xl z-20">
            <li @click="authStore.logout()"
              class="no-underline text-gray-100 py-1 opacity-80 flex items-center px-4 border-b border-transparent hover:bg-gray-800 hover:bg-opacity-25 hover:text-white uppercase">
              Log out
            </li>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <Drawer :show="showErrors" @close="showErrors = false">
    <template v-slot:header>
      <div class="flex items-center justify-between">
      <h3 class="font-semibold text-lg">Errors List</h3>
      <button 
        class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        @click="clearErrors()"
      >
        <font-awesome-icon 
          icon="fa-delete-left" 
          class="w-5 h-5"
        />
      </button>
    </div>
    </template>
    <template v-slot:body>
      <ul>
        <li v-for="(err, idx) in errors" :key="idx" class="mb-2 p-2 bg-white italic text-xs">
          <code>{{ err }}</code>
        </li>
      </ul>
    </template>
  </Drawer>

</template>
