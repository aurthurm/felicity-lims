<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed, reactive, defineAsyncComponent } from "vue";
import { SampleType } from "@/types/gql";
import useShipmentComposable from "@/composables/shipment";
import { useShipmentStore } from "@/stores/shipment";
const FButton = defineAsyncComponent(
  () => import("@/components/ui/buttons/FelButton.vue")
)

const shipmentStore = useShipmentStore();
const route = useRoute();

let allChecked = ref<boolean>(false);
let shipment = computed(() => shipmentStore.getShipment);

const refresh = () => {
  shipmentStore.fetchShipmentByUid(route.params.shipmentUid as string);
};

const form = reactive({
  laboratoryUid: undefined,
  comment: undefined,
  courier: undefined,
});

const applying = ref<boolean>(false);

const applyChanges = () => {
  applying.value = true;
  shipmentStore
    .updateShipment({ uid: route.params.shipmentUid, payload: form })
    .then(() => {
      applying.value = false;
      refresh();
    });
};
//

function areAllChecked(): boolean {
  return shipment.value?.samples?.every((item) => item.checked === true)!;
}

function getSamplesChecked(): any {
  let samples: SampleType[] = [];
  shipment.value?.shippedSamples?.forEach((shipped) => {
    if (shipped?.checked) samples.push(shipped.sample!);
  });
  return samples;
}

function checkCheck(): void {
  if (areAllChecked()) {
    allChecked.value = true;
  } else {
    allChecked.value = false;
  }
  checkUserActionPermissios();
}

function check(sample: SampleType): void {
  if (checkDisabled(sample) || shipment.value?.state !== "preperation") {
    unCheck(sample);
    return;
  }
  sample.checked = true;
  checkUserActionPermissios();
}

function checkDisabled(sample: SampleType): boolean {
  return ["retracted", "approved"].includes(sample.status!);
}

function unCheck(sample: SampleType): void {
  sample.checked = false;
  checkUserActionPermissios();
}

function toggleCheckAll(): void {
  shipment?.value?.samples?.forEach((sample) =>
    allChecked.value ? check(sample) : unCheck(sample)
  );
  checkUserActionPermissios();
}

function getSelectedMetadata(): any[] {
  return getSamplesChecked().map(sample => ({
        sampleUid: sample.uid,
        shipedSampleUid: undefined,
        analyses: []
      })
  )
}

let can_recover = ref<boolean>(false);
let can_recall = ref<boolean>(false);

function checkUserActionPermissios(): void {
  can_recover.value = false;
  can_recall.value = false;
  const checked = getSamplesChecked();
  if (checked.length === 0) return;
  if (checked.every((sample: SampleType) => ["referred", "paired"].includes(sample.status ?? ""))) {
    can_recover.value = true;
  }
  if (checked.every((sample: SampleType) => sample.status === "referred")) {
    can_recall.value = true;
  }
}

const viewShipmentModifier = computed(() => !["cancelled", "dispatched"].includes(shipment.value?.state ?? ""))

const { manageSamples } = useShipmentComposable();

const sampleManager = (action: string) => {
  const samples = getSelectedMetadata();
  manageSamples(shipment?.value?.uid, samples, action)
};
</script>

<template>
  <div class="space-y-6">
    <div v-show="viewShipmentModifier" class="space-y-4" v-motion-slide-left>
      <form action="post" class="space-y-4" v-show="!applying && !shipmentStore.shipment?.incoming">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="flex-1 min-w-[200px]">
            <label class="block space-y-1.5">
              <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Reference Laboratory</span>
              <select
                name="laboratory_uid"
                v-model="form.laboratoryUid"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option v-for="laboratory in shipmentStore.laboratories" :key="laboratory.uid" :value="laboratory.uid">
                  {{ laboratory.name }}
                </option>
              </select>
            </label>
          </div>
          
          <div class="flex-1 min-w-[200px]">
            <label class="block space-y-1.5">
              <span class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Courier</span>
              <input
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.courier"
              />
            </label>
          </div>

          <div>
            <FButton 
              @click.prevent="applyChanges()" 
              :color="'sky-800'" 
              class="h-10 px-4"
            >
              Apply
            </FButton>
          </div>
        </div>
      </form>
      <p v-show="applying" class="text-sm text-muted-foreground">Updating...</p>

      <div>
        <button
          @click.prevent="refresh()"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4"
        >
          Refresh
        </button>
      </div>
    </div>

    <!-- Sample Table View -->
    <div class="rounded-md border border-border">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border bg-muted/50">
              <th
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
                v-show="shipment?.state === 'preperation'"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  @change="toggleCheckAll()"
                  v-model="allChecked"
                />
              </th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"></th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Sample ID</th>
              <th 
                v-show="shipment?.incoming"
                class="h-10 px-4 text-left align-middle font-medium text-muted-foreground"
              >
                External SID
              </th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Client Request Id</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date Collected</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Analysis</th>
              <th class="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="shipped in shipment?.shippedSamples"
              :key="shipped.sampleUid"
              v-motion-slide-right
              class="hover:bg-muted/50"
            >
              <td class="p-4 align-middle" v-show="shipment?.state === 'preperation'">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  v-model="shipped.checked"
                  @change="checkCheck()"
                />
              </td>
              <td class="p-4 align-middle">
                <span
                  v-if="shipped.sample?.priority ?? 0 > 0"
                  :class="[
                    'text-sm',
                    { 'text-destructive': shipped.sample?.priority ?? 0 > 1 }
                  ]"
                >
                  <font-awesome-icon icon="fa-star" />
                </span>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm font-medium">
                  <router-link
                    v-if="shipped.sample?.analysisRequest?.patient?.uid"
                    :to="{
                      name: 'sample-detail',
                      params: {
                        patientUid: shipped.sample?.analysisRequest?.patient?.uid,
                        sampleUid: shipped.sample?.uid,
                      },
                    }"
                    class="text-primary hover:underline"
                  >
                    {{ shipped.sample?.sampleId }}
                  </router-link>
                  <div v-else>{{ shipped.sample?.sampleId }}</div>
                </div>
              </td>
              <td 
                v-show="shipment?.incoming"
                class="p-4 align-middle"
              >
                <div class="text-sm">{{ shipped.extSampleId }}</div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm">{{ shipped.sample?.analysisRequest?.clientRequestId }}</div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm">{{ shipped.sample?.dateCollected }}</div>
              </td>
              <td class="p-4 align-middle">
                <div class="text-sm">tests</div>
              </td>
              <td class="p-4 align-middle">
                <span
                  class="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  {{ shipped.sample?.status || "unknown" }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <section class="flex gap-2">
      <button
        v-show="can_recover"
        @click.prevent="sampleManager('recover')"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4"
      >
        Remove
      </button>
      <button
        v-show="can_recall"
        @click.prevent="sampleManager('recall')"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4"
      >
        Pair
      </button>
    </section>
  </div>
</template>
