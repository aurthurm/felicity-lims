<script setup>
import { ref, computed } from "vue";
import useTreeStateComposable from "./tree-state";

const { activePath, tags, activeTree } = useTreeStateComposable();

const props = defineProps({
  tree: Object,
});

const isOpen = ref(false);
const isFolder = computed(() => {
  return props.tree?.children && props.tree?.children?.length;
});

function toggle(treeNode) {
  isOpen.value = !isOpen.value;
  activeTree.value = treeNode;
  if (treeNode.tag === tags.storeRoom) {
    activePath.value.room = treeNode.uid;
    activePath.value.location = null;
    activePath.value.section = null;
    activePath.value.conatiner = null;
  }
  if (treeNode.tag === tags.storageLocation) {
    activePath.value.location = treeNode.uid;
    activePath.value.section = null;
    activePath.value.conatiner = null;
  }
  if (treeNode.tag === tags.storageSection) {
    activePath.value.section = treeNode.uid;
    activePath.value.conatiner = null;
  }
  if (treeNode.tag === tags.storageContainer) {
    activePath.value.conatiner = treeNode.uid;
  }
  console.log(activePath.value, activeTree.value);
}

function isSelected(treeNode) {
  if (treeNode.tag === tags.storeRoom) {
    return activePath.value.room === treeNode.uid;
  } else if (treeNode.tag === tags.storageLocation) {
    return activePath.value.location === treeNode.uid;
  } else if (treeNode.tag === tags.storageSection) {
    return activePath.value.section === treeNode.uid;
  } else if (treeNode.tag === tags.storageContainer) {
    return activePath.value.conatiner === treeNode.uid;
  }
}

function changeType() {
  if (!isFolder.value) {
    props.tree.children = [];
    addChild();
    isOpen.value = true;
  }
}

function addChild() {
  props.tree.children.push({ name: "new stuff" });
}
</script>

<template>
  <li class="cursor-pointer leading-6 mb-2">
    <div
      :class="[{ 'text-blue-500 font-bold': isSelected(tree) }]"
      @click="toggle(tree)"
      @dblclick="changeType"
    >
      {{ tree?.name }}
      <span v-if="isFolder">[{{ isOpen ? "-" : "+" }}]</span>
    </div>
    <ul
      v-show="isOpen"
      v-if="isFolder"
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
      <!-- <li class="add" @click="addChild">+</li> -->
    </ul>
  </li>
</template>
