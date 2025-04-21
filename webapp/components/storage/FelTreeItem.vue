<script setup lang="ts">
import { computed, PropType } from 'vue';
import useTreeStateComposable from "@/composables/tree-state";
import type { TreeDataType } from "@/types/storage";

const props = defineProps({
  tree: {
    type: Object as PropType<TreeDataType>,
    required: true
  }
});

const { tags, setActiveTree, activePath } = useTreeStateComposable();

const toggle = () => setActiveTree(props.tree);

const isSelected = computed(() => {
  if (!props.tree) return false;

  switch (props.tree.tag) {
    case tags.storeRoom:
      return activePath.value.room === props.tree.uid;
    case tags.storageLocation:
      return activePath.value.location === props.tree.uid;
    case tags.storageSection:
      return activePath.value.section === props.tree.uid;
    case tags.storageContainer:
      return activePath.value.container === props.tree.uid;
    default:
      return false;
  }
});
</script>

<template>
  <li class="cursor-pointer text-sm mb-2">
    <div 
      :class="[
        'py-1 px-2 rounded-md transition-colors duration-200',
        'hover:bg-muted/50',
        { 'bg-muted/30 text-primary font-medium': isSelected }
      ]" 
      @click="toggle"
    >
      <span class="flex items-center gap-2">
        <span>{{ tree?.name }}</span>
        <span v-if="tree.children?.length" class="text-xs text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded">
          {{ tree.isOpen ? "-" : "+" }}
        </span>
      </span>
    </div>
    <ul
      v-if="tree.children?.length && tree.isOpen"
      :class="[
        'pl-4 mt-1 border-l-2',
        {
          'border-l-warning/30': tree.tag === tags.storeRoom,
          'border-l-primary/30': tree.tag === tags.storageLocation,
          'border-l-success/30': tree.tag === tags.storageSection,
        },
      ]"
    >
      <TreeItem 
        v-for="(children, idx) in tree?.children" 
        :key="children.uid || idx" 
        :tree="children" 
      />
    </ul>
  </li>
</template>

<script lang="ts">
export default {
  name: 'TreeItem'
}
</script>