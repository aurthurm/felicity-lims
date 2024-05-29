<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { useField, useForm } from "vee-validate";
import { object, string, number, date } from "yup";
import { IStockItemVariant, IStockReceive } from '../../models/inventory';
import { GET_ALL_STOCK_PRODUCTS } from "../../graphql/operations/inventory.queries";
import { RECEIVE_STOCK_PRODUCT } from '../../graphql/operations/inventory.mutations';
import { useApiUtil } from "../../composables";
import { useInventoryStore, useStorageStore, useSetupStore, useUserStore } from "../../stores";
import { defineAsyncComponent, ref } from "vue";
const LoadingMessage = defineAsyncComponent(
  () => import("../../components/Spinners/LoadingMessage.vue")
)

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
  withClientMutation(RECEIVE_STOCK_PRODUCT, { payload: receivable },  "createStockReceipt").then((result) => {
    // inventoryStore.addStockProduct(result);
    console.log(result)
  }).finally(() => {
    addingProduct.value = false;
    emit("close")
  })
}

const findProduct = async (search: string) => {
  if (search.length > 3) {
    const params ={ first: 50, after: '', text: search, sortBy: ['name']}
    withClientQuery(GET_ALL_STOCK_PRODUCTS, params, "stockProductAll").then((paging) => {
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
  <form @submit.prevent="submitStockForm" class="rounded-sm py-2" autocomplete="off" :inert="addingProduct">
    {{ errors }}
    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Reveice Type</span>
      <select class="col-span-4 form-select ml-1 mt-1 w-full" v-model="receiptType">
        <option value="null"></option>
        <option value="purchase">Purchased</option>
        <option value="pushed">Pushed</option>
        <option value="transfer_in">Transfer In</option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.receiptType }}</div>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Stock Item</span>
      <div class="w-full col-span-4">
        <VueMultiselect 
        placeholder="Select a Stock Item" 
        v-model="stockItemVariant" 
        :options="stockItems"
        :searchable="true" 
        track-by="uid"
        :customLabel="customLabel"
        @search-change="findProduct">
        <!-- <template v-slot:option="slotProps">
          {{ `${slotProps.option?.stockItem?.name} ${slotProps.option?.name}` }}
        </template> -->
        </VueMultiselect>
        <div class="text-orange-600 w-4/12">{{ errors.stockItemVariantUid }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Supplier</span>
      <select class="col-span-4 form-select ml-1 mt-1 w-full" v-model="supplierUid">
        <option value="null"></option>
        <option v-for="supplier in setupStore.suppliers" :key="supplier.uid" :value="supplier.uid">
          {{ supplier.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.supplierUid }}</div>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Unit (Single)</span>
      <select class="col-span-4 form-select ml-1 mt-1 w-full" v-model="unitUid">
        <option value="null"></option>
        <option v-for="unit in inventoryStore.units" :key="unit.uid" :value="unit.uid">
          {{ unit.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.unitUid }}</div>

    <!-- <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Store Room</span>
      <select class="col-span-4 form-select ml-1 mt-1 w-full" v-model="storeRoomUid">
        <option value="null"></option>
        <option v-for="storeRoom in storageStore.storeRooms" :key="storeRoom.uid" :value="storeRoom.uid">
          {{ storeRoom.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.storeRoomUid }}</div> -->

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Lot Number</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 block w-full" v-model="lotNumber" placeholder="Lot Number..." />
        <div class="text-orange-600 w-4/12">{{ errors.lotNumber }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Packages Received</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 block w-full" type="number" v-model="packagesReceived"
          placeholder="Quantity Received..." @keyup="updateQuantityReceived" @focus="(e: any) => (e.target.select())"/>
        <div class="text-orange-600 w-4/12">{{ errors.packagesReceived }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Package Factor</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 block w-full" type="number" v-model="packageFactor"
          placeholder="Quantity Received..."  @keyup="updateQuantityReceived" @focus="(e: any) => (e.target.select())" />
        <div class="text-orange-600 w-4/12">{{ errors.packageFactor }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Singles Received</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 block w-full" type="number" v-model="singlesReceived"
          placeholder="Quantity Received..." @keyup="updateQuantityReceived" @focus="(e: any) => (e.target.select())" />
        <div class="text-orange-600 w-4/12">{{ errors.singlesReceived }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Quantity Received</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 block w-full" type="number" v-model="quantityReceived" disabled/>
        <div class="text-orange-600 w-4/12">{{ errors.quantityReceived }}</div>
      </div>
    </label>

    <!-- <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Unit Price</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 block w-full" type="number" v-model="unitPrice" placeholder="Size..." />
        <div class="text-orange-600 w-4/12">{{ errors.unitPrice }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Total Price</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 block w-full" type="number" v-model="totalPrice"
          placeholder="Quantity Received..." />
        <div class="text-orange-600 w-4/12">{{ errors.totalPrice }}</div>
      </div>
    </label> -->

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Expiry Date</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 w-full" type="date" v-model="expiryDate" placeholder="Expiry Date" />
        <div class="text-orange-600 w-4/12">{{ errors.expiryDate }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Received Date</span>
      <div class="w-full col-span-4">
        <input class=" form-input mt-1 w-full" type="date" v-model="receiptDate" placeholder="Expiry Date" />
        <div class="text-orange-600 w-4/12">{{ errors.receiptDate }}</div>
      </div>
    </label>

    <label class="mt-2 grid grid-cols-6 whitespace-nowrap w-full">
      <span class="col-span-2 text-gray-700 w-4/12">Received By</span>
      <select class="col-span-4 form-select ml-1 mt-1 w-full" v-model="receiptByUid">
        <option value="null"></option>
        <option v-for="user in userStore.users" :key="user.uid" :value="user.uid">
          {{ user.firstName }} {{ user.lastName }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.receiptByUid }}</div>
    
    <hr class="my-4" />

    <button type="submit"
      class="-mb-4 w-1/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
      v-show="!addingProduct">
      Save
    </button>
    <LoadingMessage message="Adding Inventory ..." v-show="addingProduct" />
  </form>
</template>