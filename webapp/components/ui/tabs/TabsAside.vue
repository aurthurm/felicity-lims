<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NavigationItem {
  id: string
  label: string
  icon?: string
  component?: any
}

interface Props {
  title?: string
  items: NavigationItem[]
  modelValue: string
  hideTitle?: boolean
}

interface Emits {
  (e: "update:modelValue", value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  title: "Navigation",
  hideTitle: false,
})

const emit = defineEmits<Emits>()

const updateCurrentSection = (sectionId: string) => {
  emit("update:modelValue", sectionId)
}

const shouldRenderComponent = (sectionId: string): boolean => {
  const item = props.items.find((item) => item.id === sectionId)
  return !!item?.component
}

const getComponent = (sectionId: string): any => {
  const item = props.items.find((item) => item.id === sectionId)
  return item?.component || null
}
</script>

<template>
  <Tabs :value="modelValue" @update:value="updateCurrentSection" class="flex flex-row gap-6">
    <aside class="w-48">
      <TabsList class="h-auto flex flex-col items-stretch">
        <span v-if="!hideTitle" class="px-2 pb-2 text-sm font-medium">{{ title }}</span>
        <TabsTrigger v-for="item in items" :key="item.id" :value="item.id">
          <span class="flex items-center gap-2">
            <i v-if="item.icon" :class="item.icon"></i>
            {{ item.label }}
          </span>
        </TabsTrigger>
      </TabsList>
    </aside>

    <main class="flex-1">
      <TabsContent v-for="item in items" :key="item.id" :value="item.id">
        <component
          v-if="shouldRenderComponent(item.id)"
          :is="getComponent(item.id)"
        />
        <slot v-else />
      </TabsContent>
    </main>
  </Tabs>
</template>
