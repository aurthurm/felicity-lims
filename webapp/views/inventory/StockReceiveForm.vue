<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { useField, useForm } from "vee-validate";
import { object, string, number, date } from "yup";
import { IStockItemVariant, IStockReceive } from '@/models/inventory';
import { GetAllStockProductsDocument, GetAllStockProductsQuery, GetAllStockProductsQueryVariables } from "@/graphql/operations/inventory.queries";
import { ReceiveStockProductDocument, ReceiveStockProductMutation, ReceiveStockProductMutationVariables } from '@/graphql/operations/inventory.mutations';
import useApiUtil  from "@/composables/api_util";
import { useInventoryStore } from "@/stores/inventory";
import { useStorageStore } from "@/stores/storage";
import { useSetupStore } from "@/stores/setup";
import { useUserStore } from "@/stores/user";
import { defineAsyncComponent, ref } from "vue";

const emit = defineEmits(["close"])

const inventoryStore = useInventoryStore()
const setupStore = useSetupStore()
const storageStore = useStorageStore()
const userStore = useUserStore()
const { withClientMutation, withClientQuery } = useApiUtil();
// 
const stockItems = ref<IStockItemVariant[]>([])
const addingProduct = ref(false);

const stockSchema = object({
  stockItemVariant: object().required("StockItem is required"),
  supplierUid: string().required(),
  unitUid: string().required(),
  // storeRoomUid: string().required("Store room is required"),
  lotNumber: string().required(),
  unitPrice: number().nullable().default(0.00),
  totalPrice: number().nullable().default(0.00),
  singlesReceived: number().required().default(0),
  packagesReceived: number().required().default(0),
  packageFactor: number().required().default(1),
  quantityReceived: number().default(0),
  receiptType: string().required().default("purchase"),
  receiptDate: date().required("Date received is required"),
  receiptByUid: string().required("Receiver is required"),
  expiryDate: date().required("Date expiring is required"),
});

const { handleSubmit, errors } = useForm<IStockReceive>({
  validationSchema: stockSchema,
  initialValues: {
    singlesReceived: 0,
    packagesReceived: 0,
    packageFactor: 1,
    quantityReceived: 0,
  },
});

const { value: stockItemVariant } = useField<IStockItemVariant>("stockItemVariant");
const { value: supplierUid } = useField<string>("supplierUid");
const { value: unitUid } = useField<string>("unitUid");
// const { value: storeRoomUid } = useField<string>("storeRoomUid");
const { value: lotNumber } = useField<string>("lotNumber");
// const { value: unitPrice } = useField<number>("unitPrice");
// const { value: totalPrice } = useField<number>("totalPrice");
const { value: singlesReceived } = useField<number>("totalPrice");
const { value: packagesReceived } = useField<number>("packagesReceived");
const { value: packageFactor } = useField<number>("packageFactor");
const { value: quantityReceived } = useField<number>("quantityReceived");
const { value: receiptType } = useField<string>("receiptType");
const { value: receiptDate } = useField<Date>("receiptDate");
const { value: receiptByUid } = useField<string>("receiptByUid");
const { value: expiryDate } = useField<Date>("expiryDate");

const submitStockForm = handleSubmit((values) => receiveStockProduct(values as IStockReceive));

function receiveStockProduct(payload: IStockReceive) {
  addingProduct.value = true;
  const  receivable = { 
      ...payload, productUid: stockItemVariant?.value?.uid,
      unitPrice: 0.00,
      totalPrice: 0.00,
   }
   delete receivable["stockItemVariant"];
  withClientMutation<ReceiveStockProductMutation, ReceiveStockProductMutationVariables>(ReceiveStockProductDocument, { payload: receivable },  "createStockReceipt").then((result) => {
    // inventoryStore.addStockProduct(result);
  }).finally(() => {
    addingProduct.value = false;
    emit("close")
  })
}

const findProduct = async (search: string) => {
  if (search.length > 3) {
    const params ={ first: 50, after: '', text: search, sortBy: ['name']}
    withClientQuery<GetAllStockProductsQuery, GetAllStockProductsQueryVariables>(GetAllStockProductsDocument, params, "stockProductAll").then((paging) => {
      stockItems.value = paging?.items;
    })
  }
}

const customLabel = (option: IStockItemVariant, label) => {
  return `${option.stockItem?.name} - ${option.name}`
}

const updateQuantityReceived = () => {
  if (!singlesReceived.value && !packagesReceived.value) quantityReceived.value = 0;
  if (!singlesReceived.value && packagesReceived.value) {
    quantityReceived.value = (packagesReceived.value * packageFactor.value);
  
  }
  if (singlesReceived.value && !packagesReceived.value) {
    quantityReceived.value = singlesReceived.value;
  }
  if (!packagesReceived.value) packagesReceived.value = 0;
  quantityReceived.value = (singlesReceived.value + (packagesReceived.value * packageFactor.value));
}

</script>

<template>
  <form @submit.prevent="submitStockForm" class="rounded-md py-4 space-y-4" autocomplete="off" :inert="addingProduct">
    <div v-if="Object.keys(errors).length > 0" class="p-3 bg-destructive/10 text-destructive rounded-md mb-4">
      <p class="text-sm font-medium">Please correct the following errors:</p>
      <ul class="mt-2 list-disc list-inside text-sm">
        <li v-for="(error, key) in errors" :key="key">{{ error }}</li>
      </ul>
    </div>
    
    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Receipt Type</label>
      <select 
        class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
        v-model="receiptType"
        aria-label="Receipt Type"
      >
        <option value="null"></option>
        <option value="purchase">Purchased</option>
        <option value="pushed">Pushed</option>
        <option value="transfer_in">Transfer In</option>
      </select>
      <div v-if="errors.receiptType" class="text-sm text-destructive">{{ errors.receiptType }}</div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Stock Item</label>
      <div class="w-full">
        <VueMultiselect 
          placeholder="Select a Stock Item" 
          v-model="stockItemVariant" 
          :options="stockItems"
          :searchable="true" 
          track-by="uid"
          :customLabel="customLabel"
          @search-change="findProduct"
          class="multiselect-primary"
        >
        </VueMultiselect>
        <div v-if="errors.stockItemVariantUid" class="text-sm text-destructive">{{ errors.stockItemVariantUid }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Supplier</label>
      <select 
        class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
        v-model="supplierUid"
        aria-label="Supplier"
      >
        <option value="null"></option>
        <option v-for="supplier in setupStore.suppliers" :key="supplier.uid" :value="supplier.uid">
          {{ supplier.name }}
        </option>
      </select>
      <div v-if="errors.supplierUid" class="text-sm text-destructive">{{ errors.supplierUid }}</div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Unit (Single)</label>
      <select 
        class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
        v-model="unitUid"
        aria-label="Unit"
      >
        <option value="null"></option>
        <option v-for="unit in inventoryStore.units" :key="unit.uid" :value="unit.uid">
          {{ unit.name }}
        </option>
      </select>
      <div v-if="errors.unitUid" class="text-sm text-destructive">{{ errors.unitUid }}</div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Lot Number</label>
      <div class="w-full">
        <input 
          class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
          v-model="lotNumber" 
          placeholder="Lot Number..." 
        />
        <div v-if="errors.lotNumber" class="text-sm text-destructive">{{ errors.lotNumber }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Packages Received</label>
      <div class="w-full">
        <input 
          class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
          type="number" 
          v-model="packagesReceived"
          placeholder="Quantity Received..." 
          @keyup="updateQuantityReceived" 
          @focus="(e: any) => (e.target.select())"
        />
        <div v-if="errors.packagesReceived" class="text-sm text-destructive">{{ errors.packagesReceived }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Package Factor</label>
      <div class="w-full">
        <input 
          class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
          type="number" 
          v-model="packageFactor"
          placeholder="Package Factor..." 
          @keyup="updateQuantityReceived" 
          @focus="(e: any) => (e.target.select())" 
        />
        <div v-if="errors.packageFactor" class="text-sm text-destructive">{{ errors.packageFactor }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Singles Received</label>
      <div class="w-full">
        <input 
          class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
          type="number" 
          v-model="singlesReceived"
          placeholder="Quantity Received..." 
          @keyup="updateQuantityReceived" 
          @focus="(e: any) => (e.target.select())" 
        />
        <div v-if="errors.singlesReceived" class="text-sm text-destructive">{{ errors.singlesReceived }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Quantity Received</label>
      <div class="w-full">
        <input 
          class="w-full px-3 py-2 text-foreground bg-muted border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
          type="number" 
          v-model="quantityReceived" 
          disabled
        />
        <div v-if="errors.quantityReceived" class="text-sm text-destructive">{{ errors.quantityReceived }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Expiry Date</label>
      <div class="w-full">
        <input 
          class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
          type="date" 
          v-model="expiryDate" 
          placeholder="Expiry Date" 
        />
        <div v-if="errors.expiryDate" class="text-sm text-destructive">{{ errors.expiryDate }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Received Date</label>
      <div class="w-full">
        <input 
          class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
          type="date" 
          v-model="receiptDate" 
          placeholder="Received Date" 
        />
        <div v-if="errors.receiptDate" class="text-sm text-destructive">{{ errors.receiptDate }}</div>
      </div>
    </div>

    <div class="space-y-2">
      <label class="block text-sm font-medium text-foreground">Received By</label>
      <select 
        class="w-full px-3 py-2 text-foreground bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200" 
        v-model="receiptByUid"
        aria-label="Received By"
      >
        <option value="null"></option>
        <option v-for="user in userStore.users" :key="user.uid" :value="user.uid">
          {{ user.firstName }} {{ user.lastName }}
        </option>
      </select>
      <div v-if="errors.receiptByUid" class="text-sm text-destructive">{{ errors.receiptByUid }}</div>
    </div>
    
    <div class="border-t border-border my-6"></div>

    <div class="flex justify-end">
      <button 
        type="submit"
        class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
        v-show="!addingProduct"
      >
        Save
      </button>
      <fel-loader message="Adding Inventory ..." v-show="addingProduct" />
    </div>
  </form>
</template>

<style scoped>
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}

/* Multiselect styling */
:deep(.multiselect-primary) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__tags) {
  @apply border-border bg-background text-foreground rounded-md transition-colors duration-200;
}

:deep(.multiselect-primary .multiselect__tags:focus-within) {
  @apply ring-2 ring-primary ring-offset-2;
}

:deep(.multiselect-primary .multiselect__single) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__input) {
  @apply bg-background text-foreground;
}

:deep(.multiselect-primary .multiselect__option) {
  @apply bg-background text-foreground hover:bg-muted transition-colors duration-200;
}

:deep(.multiselect-primary .multiselect__option--highlight) {
  @apply bg-primary text-primary-foreground;
}
</style>