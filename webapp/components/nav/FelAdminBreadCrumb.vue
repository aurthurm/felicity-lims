<script setup lang="ts">
import { useLocationStore } from '@/stores/location';

const props = defineProps({
    title: String,
    path: String,
    icon: String,
})

const locationStore = useLocationStore();
const select = (val?: string) => locationStore.updateConfRoute(val!);
</script>

<template>
    <li class="col-span-4 border-gray-400" @click="select(props.title)">
        <router-link :to="path ?? ''" class="no-underline">
            <div
                class="shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-sm flex flex-1 items-center p-4">
                <div class="mr-4">
                    <font-awesome-icon :icon="icon" />
                </div>
                <div class="flex-1 pl-1 md:mr-16">
                    <div class="font-medium dark:text-white">
                        {{ title }}
                    </div>
                </div>
            </div>
        </router-link>
    </li>
</template>