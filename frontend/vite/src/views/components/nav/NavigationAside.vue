<template>
  <div class="mx-auto flex flex-col items-center h-full">
    <div class="flex-none relative">
      <div class="absolute -right-6 top-14 text-2xl cursor-pointer" @click=toggleNavText()>
        <font-awesome-icon icon="bars" />
      </div>
      <router-link to="/" id="brand" class="flex items-center md:w-auto pl-6 py-2 text-white">
        <font-awesome-icon icon="meteor" class="text-4xl" />
        <h1 v-if="viewNavText" class="text-left text-2xl font-medium mx-2 ">Felicity LIMS</h1>
      </router-link>
      <nav id="aside-nav" class="" role="navigation">
        <router-link 
        v-show="canAccessPage(userRole, pages.DASHBOARD)"
        to="/dashboard" id="dashboard-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="tachometer-alt" /></span>
          <span v-if="viewNavText">Dashboard</span>
          <span v-else class="tooltip ">Dashboard</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.PATIENTS_COMPACT)"
        to="/patients-compact" id="patients-compact-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="bullseye" /></span>
          <span v-if="viewNavText">Compact</span>
          <span v-else class="tooltip ">Compact</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.PATIENTS)" to="/patients" id="patients-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="user-injured" /></span>
          <span v-if="viewNavText">Patients</span>
          <span v-else class="tooltip ">Patients</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.CLIENTS)" to="/clients" id="clients-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="clinic-medical" /></span>
          <span v-if="viewNavText">Clients</span>
          <span v-else class="tooltip ">Clients</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.SAMPLES)" to="/samples" id="samples-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="vial" /></span>
          <span v-if="viewNavText">Samples</span>
          <span v-else class="tooltip ">Samples</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.WORKSHEETS)" to="/worksheets" id="worksheets-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="grip-vertical" /></span>
          <span v-if="viewNavText">WorkSheets</span>
          <span v-else class="tooltip ">WorkSheets</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.QC_SAMPLES)" to="/quality-control" id="markdown-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="anchor" /></span>
          <span v-if="viewNavText">QControl</span>
          <span v-else class="tooltip ">QControl</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.KANBAN_BOARD)" to="/kanban-boards" id="kanban-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="tasks" /></span>
          <span v-if="viewNavText">Boards</span>
          <span v-else class="tooltip ">Boards</span>
        </router-link>
        <router-link 
        v-show="canAccessPage(userRole, pages.MARKDOWN_DOCUMENTS)" to="/documents" id="markdown-link" class="flex items-center has-tooltip mt-1 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100 border-l-4 border-gray-700">
          <span class="mr-4"><font-awesome-icon icon="book" /></span>
          <span v-if="viewNavText">Documents</span>
          <span v-else class="tooltip ">Documents</span>
        </router-link>
      </nav>
    </div>
    <div class="flex-grow"></div>
    <footer id="asideFooter" v-if="viewNavText" class="flex-none bg-gray-700 text-center text-gray-100 p-4">
      <hr>
      <span>&copy; 2020 </span>|
      <router-link to="/about" class="text-gray-200"> About</router-link>
      <hr>
    </footer>
  </div>
</template>


<style scoped>
/* #asideFooter {
    position:fixed;
    margin: 0 auto;
    width: 100%;
    bottom: 0;
} */

.router-link-active  {
    @apply bg-gray-600 bg-opacity-25 text-gray-100 border-l-4 border-gray-100;
}
  
.tooltip {
  @apply invisible absolute;
}

.has-tooltip:hover .tooltip {
  @apply visible z-50 mt-10 left-16 bg-gray-500 text-gray-200 p-1 rounded;
}

</style>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import FooterMain from '../FooterMain.vue';

import { canAccessPage, roles } from './../../../guards';
import { pages } from "./../../../router/constants";

export default defineComponent({
  components: {
    FooterMain
  },
  setup() {
    let viewNavText = ref(false);

    function toggleNavText(): void {
      viewNavText.value = !viewNavText.value;
    }

    return {
      pages, canAccessPage,
      userRole: computed(() => localStorage.getItem('fRole') || "" ),
      viewNavText,
      toggleNavText
    }
  }
});
</script>