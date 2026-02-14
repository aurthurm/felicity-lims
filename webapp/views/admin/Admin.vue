<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { getAdminBreadcrumbLabel } from '@/config/admin';

const VersionDisplay = defineAsyncComponent(
  () => import("./VersionDisplay.vue")
);

const route = useRoute();

// Route-based breadcrumb: persists on reload (derived from URL, not in-memory state)
const breadcrumbLabel = computed(() => getAdminBreadcrumbLabel(route.path));
</script>

<template>
  <div class="space-y-6">
    <beak-heading title="Settings">
      <template #subtitle>
        <nav class="flex items-center" aria-label="Breadcrumb">
          <router-link to="/admin" class="no-underline text-muted-foreground hover:text-primary transition-colors">
            Home
          </router-link>
          <span v-if="breadcrumbLabel" class="mx-2" aria-hidden="true">/</span>
          <span v-if="breadcrumbLabel" class="font-medium" aria-current="page">{{ breadcrumbLabel }}</span>
        </nav>
      </template>
      <VersionDisplay />
    </beak-heading>

    <router-view />
  </div>
</template>