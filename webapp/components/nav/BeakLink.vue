<script setup lang="ts">
import { LocationQueryRaw, RouteParamsRaw, useRouter } from 'vue-router';
const router = useRouter();

interface Props {
  name: string;
  routeName: string;
  query?: LocationQueryRaw;
  params?: RouteParamsRaw;
  variant?: 'default' | 'primary' | 'secondary' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  underline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  underline: true
});

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
} as const;

const variantClasses = {
  default: 'text-foreground hover:text-primary',
  primary: 'text-primary hover:text-primary/90',
  secondary: 'text-secondary-foreground hover:text-secondary',
  muted: 'text-muted-foreground hover:text-foreground'
} as const;

const navigate = (routeName: string, query: LocationQueryRaw | undefined, params: RouteParamsRaw | undefined) => {
    router.push({
        name: routeName,
        ...(query && { query }),
        ...(params && { params })
    });
}
</script>

<template>
    <button
        type="button"
        class="inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        :class="[
            sizeClasses[size],
            variantClasses[variant],
            { 'underline': underline }
        ]"
        @click="navigate(routeName, query, params)"
        :aria-label="`Navigate to ${name}`"
        role="link"
    >
        {{ name }}
    </button>
</template>
