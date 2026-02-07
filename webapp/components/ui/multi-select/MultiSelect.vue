<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { computed, ref, watch } from 'vue';
import { ChevronsUpDown, Check, X } from 'lucide-vue-next';
import { PopoverRoot } from 'reka-ui';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    modelValue?: string[] | string;
    value?: string[] | string;
    options: string[];
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
    class?: HTMLAttributes['class'];
    disabled?: boolean;
  }>(),
  {
    modelValue: () => [],
    placeholder: 'Select options...',
    searchable: true,
    searchPlaceholder: 'Search...',
    emptyMessage: 'No results found.',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
  (e: 'change', value: string[]): void;
}>();

const open = ref(false);
const searchQuery = ref('');

const propValue = computed(() => {
  const val = props.modelValue ?? props.value ?? [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val ? val.split(',').map((s) => s.trim()).filter(Boolean) : [];
  return [];
});

const selectedValues = computed(() => {
  return new Set(propValue.value);
});

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return props.options;
  const q = searchQuery.value.toLowerCase();
  return props.options.filter((opt) => opt.toLowerCase().includes(q));
});

function toggleValue(value: string) {
  const next = new Set(selectedValues.value);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  const arr = [...next];
  emit('update:modelValue', arr);
  emit('change', arr);
}

function removeValue(value: string, ev: Event) {
  ev.stopPropagation();
  const next = new Set(selectedValues.value);
  next.delete(value);
  const arr = [...next];
  emit('update:modelValue', arr);
  emit('change', arr);
}

function isSelected(value: string) {
  return selectedValues.value.has(value);
}

// Reset search when closed
watch(open, (isOpen) => {
  if (!isOpen) searchQuery.value = '';
});
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :disabled="disabled"
        :class="cn(
          'flex h-auto min-h-9 w-full items-center justify-between gap-2 overflow-hidden rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground',
          props.class,
        )"
      >
        <span
          v-if="selectedValues.size === 0"
          class="text-muted-foreground"
        >
          {{ placeholder }}
        </span>
        <div
          v-else
          class="flex flex-1 flex-wrap gap-1.5 overflow-hidden"
        >
          <Badge
            v-for="value in selectedValues"
            :key="value"
            variant="secondary"
            class="group flex items-center gap-1 rounded-sm px-1.5 font-normal"
            @click.stop="removeValue(value, $event)"
          >
            {{ value }}
            <X class="size-2.5 shrink-0 opacity-70 group-hover:opacity-100" />
          </Badge>
        </div>
        <ChevronsUpDown class="size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="flex min-w-[var(--reka-popover-trigger-width)] w-72 max-h-[320px] flex-col overflow-hidden p-0"
      align="start"
      :side-offset="4"
    >
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          v-if="searchable"
          class="flex h-9 shrink-0 items-center gap-2 border-b px-3"
        >
          <Search class="size-4 shrink-0 opacity-50" />
          <input
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            class="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          >
        </div>
        <div
          class="max-h-[260px] min-h-0 overflow-y-auto overflow-x-hidden"
        >
          <div
            v-if="filteredOptions.length === 0"
            class="py-6 text-center text-sm text-muted-foreground"
          >
            {{ emptyMessage }}
          </div>
          <div
            v-else
            class="p-1"
          >
            <button
              v-for="option in filteredOptions"
              :key="option"
              type="button"
              :class="cn(
                'relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
                isSelected(option) && 'bg-accent/50',
              )"
              @click="toggleValue(option)"
            >
              <Check
                :class="cn(
                  'size-4 shrink-0',
                  isSelected(option) ? 'opacity-100' : 'opacity-0',
                )"
              />
              {{ option }}
            </button>
          </div>
        </div>
      </div>
    </PopoverContent>
  </PopoverRoot>
</template>
