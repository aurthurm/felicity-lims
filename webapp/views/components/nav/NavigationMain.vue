<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useNotificationStore, useAuthStore } from "../../../stores";
import { userPreferenceComposable, useApiUtil } from "../../../composables";
import Drawer from "../../../components/Drawer.vue";
import * as guards from "./../../../guards";
const { errors } = useApiUtil()

const dropdownOpen = ref(false);
const themeChange = ref(false);
const isOpen = ref(false);

const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const { theme, toggleTheme, loadPreferedTheme } = userPreferenceComposable();

onMounted(() => loadPreferedTheme());

const userFullName = computed(
  () => `${authStore.auth?.user?.firstName} ${authStore.auth?.user?.lastName}`
);

const showNotifications = (val) => notificationStore.showNotifications(val);
const showErrors = ref(false)
</script>

<template>
  <nav id="main-nav" class="flex items-center pr-4 bg-sky-800" role="navigation">
    <div class="flex-1 py-2">
      <div class="relative w-full max-w-xl mr-6 focus-within:text-purple-500"></div>
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
        href="#"
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
        @click="showErrors = true"
        >
        <font-awesome-icon icon="bell" class="mr-2" />
        <span>Errors</span>
      </a>
      <a href="#"
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
        @click="showNotifications(true)">
        <font-awesome-icon icon="bell" class="mr-2" />
        <span>Notifications</span>
      </a>
      <router-link v-show="guards.canAccessPage(guards.pages.ADMINISTRATION)" to="/admin"
        class="no-underline text-gray-100 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark">
        <font-awesome-icon icon="cog" class="mr-2" />
        <span class="text-sm">Settings</span>
      </router-link>
      <div class="flex text-right align-middle py-2">
        <span
          class="flex justify-center items-center h-8 w-8 rounded-full border-2 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none text-white">
          <font-awesome-icon icon="user" />
        </span>
        <div class="relative">
          <div @click="dropdownOpen = !dropdownOpen" class="hidden md:block md:flex md:items-center ml-2 mt-1">
            <span class="text-white text-sm mr-2">{{ userFullName }}</span>
            <div>
              <font-awesome-icon icon="chevron-down" class="text-gray-400" />
            </div>
          </div>

          <div v-show="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 h-full w-full z-100"></div>

          <div v-show="dropdownOpen" class="absolute right-0 mt-4 py-2 w-48 bg-sky-800 rounded-sm shadow-xl z-20">
            <li @click="authStore.logout()"
              class="no-underline text-gray-100 py-1 opacity-80 flex items-center px-4 border-b border-transparent hover:bg-gray-800 hover:bg-opacity-25 hover:text-white">
              Log out
            </li>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <Drawer :show="showErrors" @close="showErrors = false">
    <template v-slot:header>
      <h3>Errors List</h3>
    </template>
    <template v-slot:body>
      <ul>
        <li v-for="(err, idx) in errors" :key="idx">
          {{ err }}
        </li>
      </ul>
    </template>
  </Drawer>

</template>
