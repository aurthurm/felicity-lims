<script setup lang="ts">
import { computed, PropType } from 'vue';
import useTreeStateComposable from "@/composables/tree-state";
import type { TreeNodeType } from "@/types/storage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const props = defineProps({
  tree: {
    type: Object as PropType<TreeNodeType>,
    required: true
  }
});

const { tags, setActiveTree, activePath } = useTreeStateComposable();

const toggle = () => setActiveTree(props.tree);

const isSelected = computed(() => {
  if (!props.tree) return false;

  switch (props.tree.tag) {
    case tags.STORE_ROOM:
      return activePath.value.room === props.tree.uid;
    case tags.STORAGE_LOCATION:
      return activePath.value.location === props.tree.uid;
    case tags.STORAGE_SECTION:
      return activePath.value.section === props.tree.uid;
    case tags.STORAGE_CONTAINER:
      return activePath.value.container === props.tree.uid;
    default:
      return false;
  }
});
</script>

<template>
  <li class="text-sm mb-2">
    <Collapsible :open="tree.isOpen" @update:open="() => toggle()">
      <CollapsibleTrigger as-child>
        <Button
          variant="ghost"
          class="w-full justify-start px-2 py-1"
          :class="[
            'rounded-md transition-colors duration-200',
            { 'bg-muted/30 text-primary font-medium': isSelected }
          ]"
        >
          <span class="flex items-center gap-2">
            <span>{{ tree?.name }}</span>
            <span v-if="tree.children?.length" class="text-xs text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
              {{ tree.isOpen ? "-" : "+" }}
            </span>
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul
          v-if="tree.children?.length"
          :class="[
            'pl-4 mt-1 border-l-2',
            {
              'border-l-warning/30': tree.tag === tags.STORE_ROOM,
              'border-l-primary/30': tree.tag === tags.STORAGE_LOCATION,
              'border-l-success/30': tree.tag === tags.STORAGE_SECTION,
            },
          ]"
        >
          <TreeItem 
            v-for="(children, idx) in tree?.children" 
            :key="children.uid || idx" 
            :tree="children" 
          />
        </ul>
      </CollapsibleContent>
    </Collapsible>
  </li>
</template>

<script lang="ts">
export default {
  name: 'TreeItem'
}
</script>
