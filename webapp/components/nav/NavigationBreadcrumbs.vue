<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import { useLaboratoryContextStore } from '@/stores/laboratory_context'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface Props {
  showHome?: boolean;
  maxItems?: number;
  separator?: string;
  showIcons?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showHome: true,
  maxItems: 5,
  separator: '/',
  showIcons: true,
  compact: false,
})

const router = useRouter()
const navigationStore = useNavigationStore()
const contextStore = useLaboratoryContextStore()

// Computed properties
const breadcrumbs = computed(() => navigationStore.breadcrumbs)
const currentLaboratory = computed(() => contextStore.context.activeLaboratory)

const processedBreadcrumbs = computed(() => {
  let items = [...breadcrumbs.value]
  
  // Add home if requested and not already present
  if (props.showHome && !items.some(item => item.route === '/')) {
    items.unshift({
      label: 'Home',
      route: '/',
      icon: 'home',
      isActive: false,
    })
  }
  
  // Limit number of items if specified
  if (props.maxItems && items.length > props.maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(props.maxItems - 2));
    items = [
      firstItem,
      {
        label: '...',
        icon: 'ellipsis-h',
        isActive: false,
      },
      ...lastItems,
    ]
  }
  
  return items
})

// Methods
const switchLaboratory = () => {
  router.push('/select-laboratory')
}
</script>

<template>
  <nav aria-label="Breadcrumb navigation" role="navigation">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem v-if="currentLaboratory && !compact">
          <Button variant="outline" size="sm" @click="switchLaboratory">
            <font-awesome-icon v-if="showIcons" icon="clinic-medical" class="mr-2" />
            {{ currentLaboratory.name }}
            <font-awesome-icon icon="chevron-down" class="ml-2" />
          </Button>
        </BreadcrumbItem>

        <BreadcrumbSeparator v-if="currentLaboratory && !compact" />

        <template v-for="(breadcrumb, index) in processedBreadcrumbs" :key="`breadcrumb-${index}`">
          <BreadcrumbItem>
            <BreadcrumbLink
              v-if="breadcrumb.route && !breadcrumb.isActive && breadcrumb.label !== '...'"
              as-child
            >
              <router-link :to="breadcrumb.route">
                <font-awesome-icon
                  v-if="showIcons && breadcrumb.icon"
                  :icon="breadcrumb.icon"
                  class="mr-2"
                />
                {{ breadcrumb.label }}
              </router-link>
            </BreadcrumbLink>
            <BreadcrumbPage v-else-if="breadcrumb.isActive">
              <font-awesome-icon
                v-if="showIcons && breadcrumb.icon"
                :icon="breadcrumb.icon"
                class="mr-2"
              />
              {{ breadcrumb.label }}
            </BreadcrumbPage>
            <BreadcrumbEllipsis v-else />
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < processedBreadcrumbs.length - 1" />
        </template>
      </BreadcrumbList>
    </Breadcrumb>

    <div v-if="!compact" class="mt-2 flex items-center gap-2">
      <Button variant="ghost" size="sm" @click="router.go(0)">
        Refresh
      </Button>
      <Button
        variant="ghost"
        size="sm"
        @click="navigator.clipboard?.writeText(window.location.href)"
      >
        Copy URL
      </Button>
    </div>
  </nav>
</template>
