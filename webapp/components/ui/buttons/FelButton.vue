<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <div class="flex items-center justify-center gap-2">
      <div v-if="loading" 
           class="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
           :class="loadingColorClass"
      ></div>
      <span :class="{ 'opacity-0': loading && loadingOnly }">
        <slot />
      </span>
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "FButton",
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'destructive', 'outline', 'ghost'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingOnly: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const buttonClasses = computed(() => {
      const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none";
      
      const variantClasses = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground"
      };

      return `${baseClasses} ${variantClasses[props.variant]}`;
    });

    const loadingColorClass = computed(() => {
      const colorMap = {
        primary: 'border-primary-foreground',
        secondary: 'border-secondary-foreground',
        destructive: 'border-destructive-foreground',
        outline: 'border-foreground',
        ghost: 'border-foreground'
      };
      return colorMap[props.variant];
    });

    return {
      buttonClasses,
      loadingColorClass
    };
  },
});
</script>