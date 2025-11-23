<script setup lang="ts">
import { ref, computed, watch, KeepAlive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Tab {
  id: string;
  label: string;
  component: any;
  props?: Record<string, any>;
  hidden?: boolean;
}

const props = defineProps<{
  tabs: Tab[];
  initialTab?: string;
  tabKey?: string;  // ⭐ NEW: query param key (default = "tab")
}>();

const route = useRoute();
const router = useRouter();

const key = props.tabKey || "tab";   // default behavior preserved

/* ---------------------------------------------
   1️⃣ Resolve initial active tab
--------------------------------------------- */
const resolveInitial = () => {
  const tabFromUrl = route.query[key] as string | undefined;

  if (tabFromUrl) return tabFromUrl;
  if (props.initialTab) return props.initialTab;

  return props.tabs[0]?.id;
};

const currentTabId = ref(resolveInitial());

/* ---------------------------------------------
   2️⃣ If URL lacks this tabKey but initialTab exists,
      add it to URL automatically
--------------------------------------------- */
if (!route.query[key] && props.initialTab) {
  router.replace({
    query: {
      ...route.query,
      [key]: props.initialTab
    }
  });
}

/* ---------------------------------------------
   3️⃣ Visible tabs
--------------------------------------------- */
const visibleTabs = computed(() =>
  props.tabs.filter((t) => !t.hidden)
);

/* ---------------------------------------------
   4️⃣ Current tab object
--------------------------------------------- */
const currentTab = computed(() =>
  visibleTabs.value.find((t) => t.id === currentTabId.value)
);

/* ---------------------------------------------
   5️⃣ Change tab + update route at this tabKey
--------------------------------------------- */
const setCurrentTab = (tabId: string) => {
  currentTabId.value = tabId;

  router.replace({
    query: {
      ...route.query,
      [key]: tabId
    }
  });
};

/* ---------------------------------------------
   6️⃣ React when THIS key changes in URL
--------------------------------------------- */
watch(
  () => route.query[key],
  (newVal) => {
    if (newVal && newVal !== currentTabId.value) {
      currentTabId.value = newVal as string;
    }
  }
);

/* ---------------------------------------------
   7️⃣ If initialTab changes (rare), update unless URL overrides it
--------------------------------------------- */
watch(
  () => props.initialTab,
  (newVal) => {
    if (newVal && !route.query[key]) {
      currentTabId.value = newVal;
      router.replace({
        query: { ...route.query, [key]: newVal }
      });
    }
  }
);

/* ---------------------------------------------
   8️⃣ If tab becomes hidden, fall back to first visible tab
--------------------------------------------- */
watch(
  visibleTabs,
  (newTabs) => {
    if (!newTabs.some((t) => t.id === currentTabId.value) && newTabs.length > 0) {
      setCurrentTab(newTabs[0].id);
    }
  },
  { immediate: true }
);
</script>



<template>
  <section class="col-span-12">
    <nav class="bg-background border-b border-border" v-motion-slide-left>
      <div class="-mb-px flex justify-start">
        <a
          v-for="tab in visibleTabs"
          :key="tab.id"
          :class="[
            'no-underline text-muted-foreground uppercase tracking-wide font-medium text-sm py-2 px-4',
            'border-b-2 transition-colors duration-200',
            currentTabId === tab.id 
              ? 'border-primary text-primary font-medium' 
              : 'border-transparent hover:border-primary/50 hover:text-primary/80'
          ]"
          @click="setCurrentTab(tab.id)"
        >
          {{ tab.label }}
        </a>
      </div>
    </nav>

    <div class="mt-4">
      <KeepAlive>
        <component
          v-if="currentTab"
          :key="currentTab.id"
          :is="currentTab.component"
          v-bind="currentTab.props || {}"
        />
      </KeepAlive>
    </div>
  </section>
</template>
