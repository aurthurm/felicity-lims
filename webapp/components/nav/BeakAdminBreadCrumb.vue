<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationStore } from '@/stores/location';

interface Props {
    title: string;
    path?: string;
    icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
    path: '',
    icon: 'chevron-right'
});

const route = useRoute();
const locationStore = useLocationStore();
const select = (val?: string) => locationStore.updateConfRoute(val!);

const isActive = computed(() => {
    if (!props.path) return false;
    const normalized = route.path.replace(/\/$/, '');
    return normalized === props.path || normalized.startsWith(props.path + '/');
});
</script>

<template>
    <div @click="select(props.title)">
        <router-link 
            :to="path" 
            class="block no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
            :aria-label="`Navigate to ${title} page`"
        >
            <div
                :class="[
                    'border rounded-md flex flex-1 items-center p-4 transition-colors duration-200',
                    isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:border-primary/50 hover:bg-accent hover:text-accent-foreground'
                ]">
                <div :class="['mr-4', isActive ? 'text-primary' : 'text-muted-foreground']">
                    <font-awesome-icon :icon="icon" class="h-5 w-5" aria-hidden="true" />
                </div>
                <div class="flex-1 pl-1 md:mr-16">
                    <div :class="['font-medium', isActive ? 'text-primary' : 'text-card-foreground']">
                        {{ title }}
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>