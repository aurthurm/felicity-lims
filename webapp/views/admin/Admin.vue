<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
const ItemSetting = defineAsyncComponent(
  () => import("../components/AdminBreadCrumb.vue") 
);

const configs = ref([
  { title: "Country, Provinces, Districts", path: "/admin/location-conf", icon: "flag" },
  {
    title: "Laboratory, Departments",
    path: "/admin/laboratory-conf",
    icon: "file-medical",
  },
  { title: "Users, Groups", path: "/admin/users-conf", icon: "users" },
  { title: "Suppliers, Manufacturers", path: "/admin/suppliers-conf", icon: "caravan" },
  {
    title: "Instruments, Methods, Units",
    path: "/admin/instruments-conf",
    icon: "laptop-medical",
  },
  { title: "Sample Types", path: "/admin/sampletypes-conf", icon: "fill" },
  { title: "Coding Standard", path: "/admin/coding-conf", icon: "fill" },
  { title: "Person Identification", path: "/admin/identification-conf", icon: "fill" },
  {
    title: "Tests, Categories, Profiles, QC",
    path: "/admin/analyses-conf",
    icon: "microscope",
  },
  {
    title: "WorkSheet Templates",
    path: "/admin/worksheets-conf",
    icon: "grip-horizontal",
  },
  { title: "Email, SMS", path: "/admin/publication-conf", icon: "copy" },
  { title: "Reflex Rules", path: "/admin/reflex-rule-conf", icon: "code-branch" },
  { title: "Load Setup Data", path: "/admin/setup-data-conf", icon: "database" },
  { title: "Inventory Mgt", path: "/admin/inventory-conf", icon: "database" },
  { title: "Sample Referral", path: "/admin/shipment-conf", icon: "truck" },
  { title: "Billing", path: "/admin/billing-conf", icon: "money-bill" },
]);
</script>

<template>
  <div class="container w-full my-4">
    <ul class="grid grid-cols-12 gap-4 my-2.5">
      <item-setting v-for="setting in configs" :key="setting.path" :title="setting.title" :path="setting.path"
        :icon="setting.icon" />
    </ul>
    <hr />
  </div>
</template>
