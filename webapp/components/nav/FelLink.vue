<script setup lang="ts">
import { LocationQueryRaw, RouteParamsRaw, useRouter } from 'vue-router';
const router = useRouter();

interface Props {
  name: string;
  routeName: string;
  query?: LocationQueryRaw;
  params?: RouteParamsRaw;
}
defineProps<Props>();

const navigate = (routeName: string, query: LocationQueryRaw | undefined, params: RouteParamsRaw | undefined) => {
    router.push({
        name: routeName,
    ...(query && { query }),
    ...(params && { params })
    });
}
</script>

<template>
    <span class="italic underline text-sm md:text-md text-blue-500 hover:text-blue-700 hover:cursor-pointer" @click="navigate(routeName, query, params)">
        {{ name }}
    </span>
</template>
