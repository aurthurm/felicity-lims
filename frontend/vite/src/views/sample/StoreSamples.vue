<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useSampleComposable } from "../../composables";
import { useStorageStore } from "../../stores";
import TreeItem from "../admin/storage/TreeItem.vue";
import useTreeStateComposable from "../../composables/tree-state";

const { treeData, tags, activeTree } = useTreeStateComposable();
const storageSrore = useStorageStore();
const { storeSamples } = useSampleComposable();

const samples = JSON.parse(window.history.state.samples);

onMounted(() => storageSrore.fetchStorageTree());

const storeSamples_ = async () => {
  const sampleUids: any[] = [];
  const storageContainerUid = activeTree.value.uid!;
  samples?.forEach((item) => {
    sampleUids.push(item?.uid);
  });
  await storeSamples({ storageContainerUid, sampleUids }).then((t) => console.log(t));
};
</script>

<template>
  <h4>Store Samples</h4>

  <div class="grid grid-cols-12 gap-4 min-h-full bg-white">
    <div className="col-span-2 pt-4 pl-4 bg-sky-200">
      <ul>
        <TreeItem v-for="(_tree, _idx) in treeData" :tree="_tree" :key="_idx" />
      </ul>
    </div>
    <div className="col-span-7 pt-4">
      <div class="mb-2">
        <span class="mr-4 uppercase font-medium">Container:</span>
        <span
          v-if="activeTree.tag === tags.storageContainer"
          class="mr-4 uppercase font-bold"
          >{{ activeTree.name }}</span
        >
      </div>
      <hr />

      <!--  -->
    </div>
    <div className="col-span-3 p-2">
      <h2 class="uppercase font-bold">Selected Samples</h2>
      <hr class="mt-2 mb-4 border-b-4" />
      <div v-for="(sample, index) in samples" :key="index" class="mt-2">
        <h2 class="text-gray-800 font-thin">
          {{ sample?.sampleId }} &lbbrk;{{
            sample?.analysisRequest?.clientRequestId
          }}&rbbrk; &rarr; {{ index }}
        </h2>
        <hr class="my-1" />
      </div>
    </div>
  </div>

  <button
    v-if="activeTree.tag === tags.storageContainer && samples?.length > 0"
    @click.prevent="storeSamples_()"
    class="px-2 py-1 mt-4 border-orange-600 border text-orange-600 rounded-sm transition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none"
  >
    Store Samples
  </button>
</template>
