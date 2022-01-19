<template>
  <nav id="main-nav" class="flex items-center pr-4 bg-gray-700" role="navigation">
    
    <div class="flex-1 py-2">
      <div class="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
        <div class="absolute inset-y-0 flex items-center pl-2">
          <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          class="w-full pl-8 pr-2 py-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
          type="text"
          placeholder="Search ..."
          aria-label="Search"
        />
      </div>
    </div>
    <div class="flex">
      <!-- <a
        href="#"
        class="no-underline text-white opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
      >
        <font-awesome-icon icon="flag" class="mr-2" />
        <span>Activities</span>
      </a> -->
      <a
        href="#"
        class="no-underline text-white opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
        @click="showNotifications(true)"
      >
        <font-awesome-icon icon="bell" class="mr-2" />
        <span>Notifications</span>
      </a>
      <!-- <a
        href="#"
        class="no-underline text-white opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark"
      >
        <font-awesome-icon icon="envelope" class="mr-2" />
        <span class="text-sm">Messages</span>
      </a> -->
      <div class="flex text-right align-middle py-2">
        <div>
          <img
            class="inline-block h-10 w-10 rounded-full border-2 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none"
            src="https://avatars0.githubusercontent.com/u/17094364?s=460&amp;v=4"
            alt=""
          />
        </div>

        <div class="relative">
          <div
            @click="dropdownOpen = !dropdownOpen"
            class="hidden md:block md:flex md:items-center ml-2 mt-2"
          >
            <span class="text-white text-sm mr-1">{{ userFullName }}</span>
            <div>
              <font-awesome-icon icon="chevron-down" class="text-gray-400" />
            </div>
          </div>

          <div
            v-show="dropdownOpen"
            @click="dropdownOpen = false"
            class="fixed inset-0 h-full w-full z-10"
          ></div>

          <div
            v-show="dropdownOpen"
            class="absolute right-0 mt-4 py-2 w-48 bg-gray-700 rounded-md shadow-xl z-20"
          >
            <router-link
              v-show="canAccessPage(userRole, pages.ADMINISTRATION)"
              to="/admin"
              class="no-underline text-gray-500 py-1 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-gray-800 hover:text-gray-200"
              >Configurations</router-link>
            <router-link
              to="/auth"
              class="no-underline text-gray-500 py-1 opacity-50 flex items-center px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-gray-800 hover:text-gray-200"
              >Log out</router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { canAccessPage } from './../../../guards';
import { pages } from "./../../../router/constants";
import useNotificationComposable from './../../../modules/notification'
export default defineComponent({
  emits: ["openNotifications"],
  setup(_, { emit }) {
    const dropdownOpen = ref(false);
    const isOpen = ref(false);

    const userFullName: string | null = localStorage.getItem('fuser');


    const {  showNotifications } = useNotificationComposable()

    return {
      pages, canAccessPage,
      userRole: computed(() => localStorage.getItem('fRole') || "" ),
      isOpen,
      dropdownOpen,
      userFullName,
      showNotifications
    };
  },
});
</script>