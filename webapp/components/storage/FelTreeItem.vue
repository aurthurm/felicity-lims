<script setup>
import { computed } from 'vue';
import useTreeStateComposable from "@/composables/tree-state";

const props = defineProps({
  tree: {
    type: Object,
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
  <li class="cursor-pointer leading-6 mb-2">
    <div 
      :class="[{ 'text-accent font-bold': isSelected }]" 
      @click="toggle"
    >
      {{ tree?.name }}
      <span v-if="tree.children?.length">
        [{{ tree.isOpen ? "-" : "+" }}]
      </span>
    </div>
    <ul
      v-if="tree.children?.length && tree.isOpen"
      :class="[
        'pl-4 border-l-2',
        {
          'border-l-orange-200': tree.tag === tags.storeRoom,
          'border-l-blue-200': tree.tag === tags.storageLocation,
          'border-l-green-200': tree.tag === tags.storageSection,
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

<script>
export default {
  name: 'TreeItem'
}
</script>