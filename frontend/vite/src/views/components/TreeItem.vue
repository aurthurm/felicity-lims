<script setup>
import useTreeStateComposable from "../../composables/tree-state";

const props = defineProps({
  tree: Object,
});

const { tags, setActiveTree, activePath } = useTreeStateComposable();

const toggle = (treeNode) => setActiveTree(treeNode);

function isSelected(treeNode) {
  if (treeNode.tag === tags.storeRoom) {
    return activePath.value.room === treeNode.uid;
  } else if (treeNode.tag === tags.storageLocation) {
    return activePath.value.location === treeNode.uid;
  } else if (treeNode.tag === tags.storageSection) {
    return activePath.value.section === treeNode.uid;
  } else if (treeNode.tag === tags.storageContainer) {
    return activePath.value.container === treeNode.uid;
  }
}
</script>

<template>
  <li class="cursor-pointer leading-6 mb-2">
    <div :class="[{ 'text-blue-500 font-bold': isSelected(tree) }]" @click="toggle(tree)">
      {{ tree?.name }}
      <span v-if="tree.children?.length">[{{ tree.isOpen ? "-" : "+" }}]</span>
    </div>
    <ul
      v-show="tree.isOpen"
      v-if="tree.children?.length"
      :class="[
        'pl-4 border-l-2',
        {
          'border-l-orange-200': tree.tag === tags.storeRoom,
          'border-l-blue-200': tree.tag === tags.storageLocation,
          'border-l-green-200': tree.tag === tags.storageSection,
        },
      ]"
    >
      <TreeItem v-for="children in tree?.children" :tree="children" />
    </ul>
  </li>
</template>
