<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useLocationStore } from '@/stores/location';
import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'AdminView' })
const VersionDisplay = defineAsyncComponent(
  () => import("./VersionDisplay.vue")
)

const locationStore = useLocationStore()
const resetSelected = () => locationStore.updateConfRoute("");
const selectedRoute = computed(() => locationStore.getConfRoute)
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Felicity Configurations">
      <VersionDisplay />
    </PageHeading>

    <div class="flex items-center text-sm">
      <span @click="resetSelected" class="cursor-pointer">
        <router-link to="/admin" class="no-underline">
          <h4 class="text-foreground font-medium">Home</h4>
        </router-link>
      </span>
      <span v-if="selectedRoute" class="mx-2 text-muted-foreground">&rarr;</span>
      <span v-if="selectedRoute" class="text-muted-foreground font-medium">{{ selectedRoute }}</span>
    </div>
    
    <hr>
    <router-view />
  </div>
</template>