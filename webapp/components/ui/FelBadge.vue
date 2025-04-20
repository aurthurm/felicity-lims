<template>
  <component
    :is="interactive ? 'button' : 'div'"
    :type="interactive ? 'button' : undefined"
    class="inline-flex items-center rounded-full font-medium ring-1 ring-inset transition-colors"
    :class="[
      sizeClasses[size],
      {
        'bg-primary/10 text-primary ring-primary/20 hover:bg-primary/20': variant === 'primary',
        'bg-secondary/10 text-secondary-foreground ring-secondary/20 hover:bg-secondary/20': variant === 'secondary',
        'bg-destructive/10 text-destructive ring-destructive/20 hover:bg-destructive/20': variant === 'destructive',
        'bg-muted text-muted-foreground ring-muted/20 hover:bg-muted/30': variant === 'muted',
        'bg-accent text-accent-foreground ring-accent/20 hover:bg-accent/20': variant === 'accent',
        'bg-success/10 text-success ring-success/20 hover:bg-success/20': variant === 'success',
        'bg-warning/10 text-warning ring-warning/20 hover:bg-warning/20': variant === 'warning',
        'bg-info/10 text-info ring-info/20 hover:bg-info/20': variant === 'info',
        'cursor-pointer': interactive
      }
    ]"
  >
    <span
      v-if="dot"
      class="mr-1.5 h-1.5 w-1.5 rounded-full"
      :class="[
        {
          'bg-primary': variant === 'primary',
          'bg-secondary': variant === 'secondary',
          'bg-destructive': variant === 'destructive',
          'bg-muted-foreground': variant === 'muted',
          'bg-accent': variant === 'accent',
          'bg-success': variant === 'success',
          'bg-warning': variant === 'warning',
          'bg-info': variant === 'info',
        }
      ]"
      aria-hidden="true"
    ></span>
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'destructive' | 'muted' | 'accent' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  dot: false,
  interactive: false
});

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base'
} as const;
</script>
