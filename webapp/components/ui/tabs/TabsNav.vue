<script setup lang="ts">
import { ref, computed, watch, KeepAlive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Tab {
  id: string;
  label: string;
  component: any;
  props?: Record<string, any>;
  hidden?: boolean;
}

const props = defineProps<{
  tabs: Tab[]
  initialTab?: string
  tabKey?: string
}>()

const route = useRoute()
const router = useRouter()

const key = props.tabKey || "tab"

/* ---------------------------------------------
   1️⃣ Resolve initial active tab
--------------------------------------------- */
const resolveInitial = () => {
  const tabFromUrl = route.query[key] as string | undefined
  const visible = props.tabs.filter((t) => !t.hidden)

  if (tabFromUrl && visible.some((t) => t.id === tabFromUrl)) return tabFromUrl
  if (props.initialTab && visible.some((t) => t.id === props.initialTab)) return props.initialTab

  return visible[0]?.id
}

const currentTabId = ref(resolveInitial())

/* ---------------------------------------------
   2️⃣ If URL lacks this tabKey but initialTab exists,
      add it to URL automatically
--------------------------------------------- */
if (!route.query[key] && props.initialTab) {
  router.replace({
    query: {
      ...route.query,
      [key]: props.initialTab,
    },
  })
}

/* ---------------------------------------------
   3️⃣ Visible tabs
--------------------------------------------- */
const visibleTabs = computed(() =>
  props.tabs.filter((t) => !t.hidden)
)

/* ---------------------------------------------
   4️⃣ Current tab object
--------------------------------------------- */
const currentTab = computed(() =>
  visibleTabs.value.find((t) => t.id === currentTabId.value)
)

/* ---------------------------------------------
   5️⃣ Change tab + update route at this tabKey
--------------------------------------------- */
const setCurrentTab = (tabId: string) => {
  currentTabId.value = tabId

  router.replace({
    query: {
      ...route.query,
      [key]: tabId,
    },
  })
}

/* ---------------------------------------------
   6️⃣ React when THIS key changes in URL
--------------------------------------------- */
watch(
  () => route.query[key],
  (newVal) => {
    const nextVal = newVal as string | undefined
    const visible = visibleTabs.value
    if (nextVal && visible.some((t) => t.id === nextVal)) {
      if (nextVal !== currentTabId.value) {
        currentTabId.value = nextVal
      }
      return
    }
    if (visible.length > 0 && currentTabId.value !== visible[0].id) {
      setCurrentTab(visible[0].id)
    }
  }
)

/* ---------------------------------------------
   7️⃣ If initialTab changes (rare), update unless URL overrides it
--------------------------------------------- */
watch(
  () => props.initialTab,
  (newVal) => {
    if (newVal && !route.query[key]) {
      currentTabId.value = newVal
      router.replace({
        query: { ...route.query, [key]: newVal },
      })
    }
  }
)

/* ---------------------------------------------
   8️⃣ If tab becomes hidden, fall back to first visible tab
--------------------------------------------- */
watch(
  visibleTabs,
  (newTabs) => {
    if (!newTabs.some((t) => t.id === currentTabId.value) && newTabs.length > 0) {
      setCurrentTab(newTabs[0].id)
    }
  },
  { immediate: true }
);
</script>



<template>
  <Tabs :model-value="currentTabId" @update:model-value="setCurrentTab">
    <TabsList>
      <TabsTrigger
        v-for="tab in visibleTabs"
        :key="tab.id"
        :value="tab.id"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>

    <KeepAlive>
      <TabsContent
        v-for="tab in visibleTabs"
        :key="tab.id"
        :value="tab.id"
      >
        <component
          v-if="currentTabId === tab.id"
          :is="tab.component"
          v-bind="tab.props || {}"
        />
      </TabsContent>
    </KeepAlive>
  </Tabs>
</template>
