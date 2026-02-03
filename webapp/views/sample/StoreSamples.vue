<script setup lang="ts">
import { computed, watch, onMounted, defineAsyncComponent } from "vue";
import useSampleComposable from "@/composables/samples";
import { useStorageStore } from "@/stores/storage";
import useTreeStateComposable from "@/composables/tree-state";
import { useForm } from "vee-validate";
import { object, array } from "yup";
import { storgeSlotMapper } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ExtStorageContainerType } from "@/types/storage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const TreeItem = defineAsyncComponent(
  () => import("@/components/storage/TreeItem.vue")
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

const setAssigned = () => {
  assignedUids = [];
  values.samples.forEach((s) => {
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
      setFieldValue("samples", []);
    }
  },
  { deep: true }
);
const storageContainer = computed<ExtStorageContainerType>(() => storageSrore.getStorageContainer as ExtStorageContainerType);
const emptySlots = computed(() => {
  const sc = storageSrore.getStorageContainer;
  return (sc?.slots ?? 0) - (sc?.storedCount ?? 0);
});

const prepareSlots = () => {
  // add existing to pool
  samples = [...samples, ...(storageContainer.value?.samples ?? [])];
  //
  setFieldValue("samples", []);
  const slots = storgeSlotMapper(
    storageContainer.value?.cols ?? 1,
    storageContainer.value?.rows ?? 1,
    !storageContainer.value?.grid,
    storageContainer.value?.rowWise! ?? false
  ).map((s) => ({ ...s, storageContainerUid: storageContainer.value?.uid }));

  const nextSamples: ISampleData[] = [];
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
    nextSamples.push({
      sampleUid: undefined,
      ...slot,
    });
  });
  setFieldValue("samples", nextSamples);
};

const formSchema = object({
  samples: array().required().min(1, "Select At least one sample"),
});

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    priority: 0,
    samples: storageContainer.value?.samples ?? [],
  } as any,
});

const samplesData = computed(() => values.samples as ISampleData[]);

const removeSample = (uid) => {
  const next = values.samples.map((s) => {
    if (s.sampleUid === uid) {
      s = { ...s, sampleUid: undefined };
    }
    return s;
  });
  setFieldValue("samples", next);
  assignedUids = assignedUids.filter((a) => +a !== uid);
};

const updateSampleAt = (index: number, sampleUid: string) => {
  const parsed = sampleUid ? Number(sampleUid) : undefined;
  const next = values.samples.map((s, idx) => (
    idx === index ? { ...s, sampleUid: parsed } : s
  ));
  setFieldValue("samples", next);
  setAssigned();
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
          <div v-if="activeTree.tag === tags.STORAGE_CONTAINER">
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
          <Button 
            v-if="activeTree.tag === tags.STORAGE_CONTAINER"
            @click="prepareSlots()"
            type="button"
          >
            Reset Slots
          </Button>
        </div>

        <Form class="bg-background rounded-lg shadow-sm p-6 space-y-6" @submit="submitForm">
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
                  <FormField :name="`samples.${index}.sampleUid`" v-slot="{ value }">
                    <FormItem class="w-64">
                      <FormControl>
                        <Select :model-value="value ? String(value) : ''" @update:model-value="(val) => updateSampleAt(index, val)">
                          <SelectTrigger>
                            <SelectValue placeholder="Select sample" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="sample in samples" :key="sample.uid" :value="String(sample.uid)"
                              v-show="!assignedUids.includes(sample.uid.toString())">
                              {{ sample?.sampleId }} &lbbrk;{{ sample?.analysisRequest?.clientRequestId }}&rbbrk;
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <Button 
                    v-if="storageMeta.sampleUid" 
                    @click="removeSample(storageMeta.sampleUid)"
                    variant="ghost"
                    size="icon"
                    type="button"
                    aria-label="Remove sample"
                  >
                    <FontAwesomeIcon icon="ban" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <Button 
              v-if="activeTree.tag === tags.STORAGE_CONTAINER && samples?.length > 0" 
              type="submit"
              variant="destructive"
            >
              Store Samples
            </Button>
          </div>
        </Form>
      </div>
      
      <div class="col-span-3"></div>
    </div>
  </div>
</template>
