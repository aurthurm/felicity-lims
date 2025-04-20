<script setup lang="ts">
import { computed, watch, onMounted, defineAsyncComponent } from "vue";
import useSampleComposable from "@/composables/samples";
import { useStorageStore } from "@/stores/storage";
import useTreeStateComposable from "@/composables/tree-state";
import { useField, useForm } from "vee-validate";
import { object, array } from "yup";
import { storgeSlotMapper } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const TreeItem = defineAsyncComponent(
  () => import("@/components/storage/FelTreeItem.vue")
)

interface ISampleData {
  sampleUid?: number;
  storageContainerUid?: number;
  storageSlot?: string;
  storageSlotIndex?: number;
}

//

const { treeData, tags, activeTree, resetActiveTree } = useTreeStateComposable();
resetActiveTree();
const storageSrore = useStorageStore();
const { storeSamples } = useSampleComposable();

let samples = JSON.parse(window.history.state.samples);

let assignedUids: string[] = [];

const setAssigned = (_) => {
  assignedUids = [];
  samplesData.value.forEach((s) => {
    if (s.sampleUid) {
      assignedUids.push(s.sampleUid?.toString());
    }
  });
};

onMounted(() => storageSrore.fetchStorageTree());

watch(
  () => activeTree.value,
  (tree, prev) => {
    if (tree.tag === "storage-container") {
      storageSrore.fetchStorageContainer(tree.uid!);
      samplesData.value = [];
    }
  },
  { deep: true }
);
const storageContainer = computed(() => storageSrore.getStorageContainer);
const emptySlots = computed(() => {
  const sc = storageSrore.getStorageContainer;
  return (sc?.slots ?? 0) - (sc?.storedCount ?? 0);
});

const prepareSlots = () => {
  // add existing to pool
  samples = [...samples, ...(storageContainer.value?.samples ?? [])];
  //
  samplesData.value = [];
  const slots = storgeSlotMapper(
    storageContainer.value?.cols ?? 1,
    storageContainer.value?.rows ?? 1,
    !storageContainer.value?.grid,
    storageContainer.value?.rowWise! ?? false
  ).map((s) => ({ ...s, storageContainerUid: storageContainer.value?.uid }));

  slots.forEach((slot) => {
    const filtrate = samples.filter(
      (s) =>
        s.storageSlotIndex === slot.storageSlotIndex &&
        s.storageContainerUid === slot.storageContainerUid
    );
    if (filtrate.length > 0) {
      slot = { ...slot, sampleUid: filtrate[0].uid };
      assignedUids.push(slot.sampleUid.toString());
    }
    //
    samplesData.value.push({
      sampleUid: undefined,
      ...slot,
    });
  });
};

const formSchema = object({
  samples: array().required().min(1, "Select At least one sample"),
});

const { handleSubmit, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    priority: 0,
    samples: storageContainer.value?.samples ?? [],
  } as any,
});

const { value: samplesData } = useField<ISampleData[]>("samples");

const removeSample = (uid) => {
  samplesData.value = samplesData.value.map((s) => {
    if (s.sampleUid === uid) {
      s = { ...s, sampleUid: undefined };
    }
    return s;
  });
  assignedUids = assignedUids.filter((a) => +a !== uid);
};

const submitForm = handleSubmit(async (values) => {
  const data = values.samples.filter((s) => s.sampleUid);
  await storeSamples(data).then(async (t) => {
    await storageSrore.fetchStorageContainer(data[0].storageContainerUid!);
    prepareSlots();
  });
});
</script>

<template>
  <div class="space-y-6">
    <h4 class="text-xl font-semibold text-foreground">Store Samples</h4>

    <div class="grid grid-cols-12 gap-6 min-h-full">
      <div class="col-span-2 bg-secondary rounded-lg shadow-sm p-4">
        <ul class="space-y-2">
          <TreeItem v-for="(_tree, _idx) in treeData" :tree="_tree" :key="_idx" />
        </ul>
      </div>
      
      <div class="col-span-7 space-y-6">
        <div class="bg-background rounded-lg shadow-sm p-6">
          <div v-if="activeTree.tag === tags.storageContainer">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-foreground">Name</span>
                  <span class="text-muted-foreground">{{ storageContainer?.name }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-foreground">Layout</span>
                  <div class="flex items-center gap-2">
                    <span class="text-muted-foreground">{{ storageContainer?.grid ? "grid" : "column" }}</span>
                    <span v-if="storageContainer?.grid" class="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {{ storageContainer?.rowWise ? "by-row" : "by-column" }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-foreground">Slots</span>
                  <span class="text-muted-foreground">{{ storageContainer?.slots }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium text-foreground">Empty Slots</span>
                  <span class="text-muted-foreground">{{ emptySlots }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-muted-foreground">Please select a storage container</div>
        </div>

        <div class="flex justify-end">
          <button 
            v-if="activeTree.tag === tags.storageContainer"
            @click="prepareSlots()"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Reset Slots
          </button>
        </div>

        <form action="post" class="bg-background rounded-lg shadow-sm p-6 space-y-6" @submit.prevent="submitForm">
          <div class="grid grid-cols-12 gap-4 text-sm font-medium text-foreground">
            <div class="col-span-1">Position</div>
            <div class="col-span-1">Label</div>
            <div class="col-span-10">Sample</div>
          </div>

          <div class="space-y-4">
            <div v-for="(storageMeta, index) in samplesData" :key="index" class="grid grid-cols-12 gap-4 items-center py-4 border-b border-border last:border-0">
              <div class="col-span-1 text-muted-foreground">{{ storageMeta.storageSlotIndex }}</div>
              <div class="col-span-1 text-muted-foreground">{{ storageMeta.storageSlot }}</div>
              <div class="col-span-10">
                <div class="flex items-center gap-4">
                  <select 
                    name="sampleUid" 
                    id="sampleUid" 
                    v-model="storageMeta.sampleUid" 
                    class="w-64 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    @change="setAssigned"
                    aria-label="Select sample"
                  >
                    <option v-for="sample in samples" :key="sample.uid" :value="sample.uid"
                      v-show="!assignedUids.includes(sample.uid.toString())">
                      {{ sample?.sampleId }} &lbbrk;{{ sample?.analysisRequest?.clientRequestId }}&rbbrk;
                    </option>
                  </select>
                  <button 
                    v-if="storageMeta.sampleUid" 
                    @click="removeSample(storageMeta.sampleUid)"
                    class="text-destructive hover:text-destructive/80 transition-colors"
                    aria-label="Remove sample"
                  >
                    <FontAwesomeIcon icon="ban" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button 
              v-if="activeTree.tag === tags.storageContainer && samples?.length > 0" 
              type="submit"
              class="px-6 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-destructive/50"
            >
              Store Samples
            </button>
          </div>
        </form>
      </div>
      
      <div class="col-span-3"></div>
    </div>
  </div>
</template>
