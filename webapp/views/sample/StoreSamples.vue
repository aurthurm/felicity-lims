<script setup lang="ts">
import { computed, watch, onMounted } from "vue";
import { useSampleComposable } from "../../composables";
import { useStorageStore } from "../../stores";
import TreeItem from "../components/TreeItem.vue";
import useTreeStateComposable from "../../composables/tree-state";
import { useField, useForm } from "vee-validate";
import { object, array } from "yup";
import { storgeSlotMapper } from "../../utils";

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
      console.log(filtrate, slot);
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
    samples: (storageContainer.value?.samples as ISampleData[]) ?? [],
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
  <h4>Store Samples</h4>

  <div class="grid grid-cols-12 gap-4 min-h-full bg-white">
    <div className="col-span-2 pt-4 pl-4 bg-sky-200">
      <ul>
        <TreeItem v-for="(_tree, _idx) in treeData" :tree="_tree" :key="_idx" />
      </ul>
    </div>
    <div className="col-span-7 pt-4">
      <div class="mb-2">
        <div v-if="activeTree.tag === tags.storageContainer">
          <div class="grid grid-cols-2 mt-2">
            <div class="col-span-1">
              <div class="flex">
                <span class="text-gray-600 text-md font-bold w-52">Name:</span>
                <span class="text-gray-600 text-md">{{ storageContainer?.name }}</span>
              </div>
              <div class="flex">
                <span class="text-gray-600 text-md font-bold w-52">Layout:</span>
                <span class="text-gray-600 text-md">{{
                  storageContainer?.grid ? "grid" : "column"
                }}</span>
                <span class="ml-2 text-gray-600 text-md italic bg-slate-400 px-1 rounded-sm"
                  v-if="storageContainer?.grid">{{ storageContainer?.rowWise ? "by-row" : "by-column" }}</span>
              </div>
            </div>
            <div class="col-span-1">
              <div class="flex">
                <span class="text-gray-600 text-md font-bold w-52">Slots:</span>
                <span class="text-gray-600 text-md">{{ storageContainer?.slots }}</span>
              </div>
              <div class="flex mt-2">
                <span class="text-gray-600 text-md font-bold w-52">Empty Slots:</span>
                <span class="text-gray-600 text-md mr-2">{{ emptySlots }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>Please select a storage container</div>
      </div>
      <hr />

      <button v-if="activeTree.tag === tags.storageContainer"
        class="border border-sky-800 bg-sky-800 text-white rounded-sm mt-2 px-4 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        @click="prepareSlots()">
        Reset Slots
      </button>

      <form action="post" class="p-4 mb-8 bg-white" @submit.prevent="submitForm">
        <div class="grid grid-cols-12 mb-4">
          <div class="col-span-1 font-semibold">Position</div>
          <div class="col-span-1 font-semibold">Label</div>
          <div class="col-span-10 font-semibold">Sample</div>
        </div>
        <div v-for="(storageMeta, index) in samplesData" class="mt-2 grid grid-cols-12" :key="index">
          <div class="col-span-12 mb-2">
            <hr />
          </div>
          <div class="col-span-1">
            {{ storageMeta.storageSlotIndex }}
          </div>
          <div class="col-span-1">
            {{ storageMeta.storageSlot }}
          </div>
          <label class="col-span-10">
            <select name="sampleUid" id="sampleUid" v-model="storageMeta.sampleUid" class="form-input w-64 h-6 p-0"
              @change="setAssigned">
              <option v-for="sample in samples" :key="sample.uid" :value="sample.uid"
                v-show="!assignedUids.includes(sample.uid.toString())">
                {{ sample?.sampleId }} &lbbrk;{{
                  sample?.analysisRequest?.clientRequestId
                }}&rbbrk;
              </option>
            </select>
            <span v-if="storageMeta.sampleUid" class="ml-2 text-red-500"
              @click="removeSample(storageMeta.sampleUid)"><font-awesome-icon icon="ban" />
            </span>
          </label>
        </div>
        <hr class="mt-8" />
        <button v-if="activeTree.tag === tags.storageContainer && samples?.length > 0" type="submit"
          class="px-2 py-1 mt-4 border-orange-600 border text-orange-600 rounded-sm transition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none">
          Store Samples
        </button>
      </form>

      <!--  -->
    </div>
    <div className="col-span-3 p-2"></div>
  </div>
</template>
