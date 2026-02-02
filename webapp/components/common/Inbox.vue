<script setup lang="ts">
import { computed, ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
export interface InboxItem {
    uid: string;
    title: string;
    body: string;
    status?: string;
    [key: string]: any; // Allow for additional properties
}

interface Props {
  items: InboxItem[];
  title?: string;
  titleKey?: string;
  bodyKey?: string;
  statusKey?: string;
  showNumbers?: boolean;
  leftPanelWidth?: string;
  sanitizeHtml?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  title: 'Inbox',
  titleKey: 'title',
  bodyKey: 'body',
  statusKey: 'status',
  showNumbers: true,
  leftPanelWidth: 'w-1/5',
  sanitizeHtml: true,
  loading: false
});

const emit = defineEmits<{
  (e: 'select', item: InboxItem | null): void;
}>();

const selectedItem = ref<InboxItem | null>(null);

const handleSelect = (item: InboxItem) => {
  selectedItem.value = item;
  emit('select', item);
};

const getExcerpt = (text: string, length: number = 100): string => {
  if (props.sanitizeHtml) {
    text = text.replace(/<[^>]*>/g, '');
  }
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

// Computed property for loading state placeholder items
const placeholderItems = computed(() => Array(3).fill(null));
</script>

<template>
  <Card class="min-h-[450px]">
    <CardHeader class="border-b border-border">
      <CardTitle class="text-xl">{{ title }}</CardTitle>
    </CardHeader>

    <CardContent class="p-0">
      <div class="flex h-full min-h-[400px] overflow-hidden">
        <!-- List Panel -->
        <div :class="[leftPanelWidth, 'border-r border-border']">
          <ScrollArea class="h-full">
            <div class="divide-y divide-border">
              <template v-if="loading">
                <div 
                  v-for="(_, index) in placeholderItems" 
                  :key="index"
                  class="p-4"
                >
                  <div class="flex items-start space-x-4">
                    <Skeleton class="h-8 w-8 rounded-full" />
                    <div class="flex-1">
                      <Skeleton class="h-4 w-3/4 mb-2" />
                      <Skeleton class="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              </template>
              
              <div
                v-else
                v-for="(item, index) in items"
                :key="item.uid"
                @click="handleSelect(item)"
                :class="[
                  'p-4 cursor-pointer transition-colors duration-200',
                  selectedItem?.uid === item.uid 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                ]"
              >
                <div class="flex items-start space-x-4">
                  <span 
                    v-if="showNumbers"
                    class="inline-flex items-center justify-center w-8 h-8 text-xs font-medium text-primary-foreground bg-primary rounded-full"
                  >
                    {{ index + 1 }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between gap-2">
                      <h2 class="text-sm font-medium truncate">
                        {{ item[titleKey] }}
                      </h2>
                      <Badge v-if="item[statusKey]" variant="destructive">
                        {{ item[statusKey] }}
                      </Badge>
                    </div>
                    <p class="mt-1 text-sm text-muted-foreground truncate">
                      {{ getExcerpt(item[bodyKey]) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <!-- Content Panel -->
        <div class="flex-1 bg-background">
          <ScrollArea class="h-full">
            <article class="p-6" v-if="selectedItem">
              <div class="mb-4 border-b border-border pb-4">
                <h2 class="text-2xl font-bold text-foreground mb-2">
                  {{ selectedItem[titleKey] }}
                </h2>
                <Badge v-if="selectedItem[statusKey]" variant="destructive">
                  {{ selectedItem[statusKey] }}
                </Badge>
              </div>
              <div
                class="prose prose-foreground max-w-none"
                v-html="sanitizeHtml ? selectedItem[bodyKey] : selectedItem[bodyKey]"
              ></div>
            </article>
            <div 
              v-else 
              class="h-full flex items-center justify-center text-muted-foreground p-6"
            >
              Select an item to view its contents
            </div>
          </ScrollArea>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
