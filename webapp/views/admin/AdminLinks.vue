<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { ADMIN_CONFIGS } from "@/config/admin";

const ItemSetting = defineAsyncComponent(
  () => import("@/components/nav/FelAdminBreadCrumb.vue")
);
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <div v-for="setting in ADMIN_CONFIGS" class="col-span-1">
      <item-setting 
      :key="setting.path" 
      :title="setting.title" 
      :path="setting.path"
      :icon="setting.icon"
      />
    </div>
  </div>
</template>
