<script setup lang="ts">
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
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Navigation',
  hideTitle: false
})

const emit = defineEmits<Emits>()

const updateCurrentSection = (sectionId: string) => {
  emit('update:modelValue', sectionId)
}

// Helper to determine if we should render component or use slots
const shouldRenderComponent = (sectionId: string): boolean => {
  const item = props.items.find(item => item.id === sectionId)
  return !!item?.component
}

// Get component for section if it exists
const getComponent = (sectionId: string): any => {
  const item = props.items.find(item => item.id === sectionId)
  return item?.component || null
}
</script>

<template>
  <div class="flex w-full h-full mt-4">
    <!-- Sidebar -->
    <aside class="w-48 sticky top-0">
      <nav class="p-4">
        <h2 v-if="!hideTitle" class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h2>
        <hr class="my-1">
        <ul class="space-y-2">
          <li v-for="item in items" :key="item.id">
            <button 
              @click="updateCurrentSection(item.id)" 
              :class="[
                'w-full text-left p-2  transition-colors duration-150 flex items-center gap-2',
                {
                  'bg-sky-600 text-white': modelValue === item.id,
                  'text-gray-600 hover:bg-gray-100': modelValue !== item.id,
                },
              ]"
            >
              <i v-if="item.icon" :class="item.icon"></i>
              {{ item.label }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 bg-slate-50">
      <!-- Render component if available -->
      <component
        v-if="shouldRenderComponent(modelValue)"
        :is="getComponent(modelValue)"
      />
      <!-- Otherwise use slots -->
      <slot v-else></slot>
    </main>
  </div>
</template>