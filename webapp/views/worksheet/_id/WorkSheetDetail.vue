<script setup lang="ts">
  import { computed, defineAsyncComponent } from 'vue';
  import { useWorksheetStore } from '@/stores/worksheet'
  const TabsNav = defineAsyncComponent(
    () => import("@/components/ui/tabs/TabsNav.vue")
  )

  let worksheetStore = useWorksheetStore();
  const targetUid = computed(() => worksheetStore.workSheet?.uid || '');
  const showAssignTab = computed(() => worksheetStore.workSheet?.state  !== 'pending');

  const tabs = [
    {
      id: "detail",
      label: "detail",
      component: defineAsyncComponent(() => import("./WorkSheetResults.vue")),
    },
    {
      id: "assign-samples",
      label: "assign-samples",
      component: defineAsyncComponent(() => import("./WorkSheetAssign.vue")),
      hidden: showAssignTab.value
    },
    {
      id: "logs",
      label: "logs",
      component: defineAsyncComponent(() => import("@/components/audit/AuditLog.vue")),
      props: {targetType: "worksheet", targetUid: targetUid?.value}
    },
  ]
</script>

<template>
  <section class="col-span-12 bg-background rounded-lg shadow-sm p-6">
    <TabsNav :tabs="tabs" initial-tab="default" />
  </section>
</template>