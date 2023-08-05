<script setup lang="ts">
import VueMultiselect from "vue-multiselect";
import { useField, useForm } from "vee-validate";
import { object, string, number, date } from "yup";
import { IStockItem, IStockProduct } from '../../models/inventory';
import { ADD_STOCK_PRODUCT, EDIT_STOCK_PRODUCT } from '../../graphql/operations/inventory.mutations';
import { useApiUtil } from "../../composables";
import { useInventoryStore, useStorageStore, useSetupStore, useUserStore } from "../../stores";
import { defineAsyncComponent, PropType, ref } from "vue";
const LoadingMessage = defineAsyncComponent(
  () => import("../../components/Spinners/LoadingMessage.vue")
)

const props = defineProps({
  product: Object as PropType<IStockProduct>,
});

const emit = defineEmits(["close"])

const inventoryStore = useInventoryStore()
const setupStore = useSetupStore()
const storageStore = useStorageStore()
const userStore = useUserStore()
const { withClientMutation } = useApiUtil();
// 
const addingProduct = ref(false);

const stockSchema = object({
  uid: string(),
  name: string().nullable(),
  stockItem: object().required("StockItem is required"),
  departmentUid: string().nullable(),
  supplierUid: string().required(),
  categoryUid: string().required(),
  hazardUid: string().required("Hazard type is required"),
  storeRoomUid: string().required("Store room is required"),
  lotNumber: string().required(),
  batch: string().required(),
  size: number().required(),
  unitUid: string().required(),
  packagingUid: string().required(),
  price: number().nullable(),
  quantityReceived: number().required("Quantity received is required"),
  remaining: number().nullable(),
  dateReceived: date().required("Date received is required"),
  expiryDate: date().required("Date expiring is required"),
  receivedByUid: string().required("Receiver is required"),
});

const { handleSubmit, errors } = useForm({
  validationSchema: stockSchema,
  initialValues: {
    uid: props.product?.uid,
    name: props.product?.name,
    stockItem: props.product?.stockItem,
    departmentUid: props.product?.departmentUid,
    supplierUid: props.product?.supplierUid,
    categoryUid: props.product?.categoryUid,
    hazardUid: props.product?.hazardUid,
    storeRoomUid: props.product?.storeRoomUid,
    lotNumber: props.product?.lotNumber,
    batch: props.product?.batch,
    size: props.product?.size,
    unitUid: props.product?.unitUid,
    packagingUid: props.product?.packagingUid,
    price: props.product?.price,
    quantityReceived: props.product?.quantityReceived,
    expiryDate: props.product?.expiryDate,
    dateReceived: props.product?.dateReceived,
    receivedByUid: props.product?.receivedByUid,
  } as any,
});

const { value: name } = useField<string>("name");
const { value: stockItem } = useField<IStockItem>("stockItem");
const { value: departmentUid } = useField<string>("departmentUid");
const { value: supplierUid } = useField<string>("supplierUid");
const { value: categoryUid } = useField<string>("categoryUid");
const { value: hazardUid } = useField<string>("hazardUid");
const { value: storeRoomUid } = useField<string>("storeRoomUid");
const { value: lotNumber } = useField<string>("lotNumber");
const { value: batch } = useField<string>("batch");
const { value: size } = useField<number>("size");
const { value: unitUid } = useField<string>("unitUid");
const { value: packagingUid } = useField<string>("packagingUid");
const { value: price } = useField<number>("price");
const { value: quantityReceived } = useField<number>("quantityReceived");
const { value: dateReceived } = useField<Date>("dateReceived");
const { value: expiryDate } = useField<Date>("expiryDate");
const { value: receivedByUid } = useField<string>("receivedByUid");

const submitStockForm = handleSubmit((values) => {
  if (!values?.uid) addStockProduct(values as IStockProduct);
  // if (values?.uid) updateStockProduct(values as IStockProduct);
});

function addStockProduct(payload: IStockProduct) {
  addingProduct.value = true;
  withClientMutation(
    ADD_STOCK_PRODUCT,
    {
      payload: {
        name: payload.name,
        stockItemUid: payload.stockItem.uid,
        departmentUid: payload.departmentUid,
        supplierUid: payload.supplierUid,
        categoryUid: payload.categoryUid,
        hazardUid: payload.hazardUid,
        storeRoomUid: payload.storeRoomUid,
        lotNumber: payload.lotNumber,
        batch: payload.batch,
        size: payload.size,
        unitUid: payload.unitUid,
        packagingUid: payload.packagingUid,
        price: payload.price,
        quantityReceived: payload.quantityReceived,
        dateReceived: payload.dateReceived,
        expiryDate: payload.expiryDate,
        receivedByUid: payload.receivedByUid,
      },
    },
    "createStockProduct"
  ).then((result) => {
    inventoryStore.addStockProduct(result);
  }).finally(() => {
    addingProduct.value = false;
    emit("close")
  })
}

function updateStockProduct(payload: IStockProduct) {
  withClientMutation(
    EDIT_STOCK_PRODUCT,
    {
      uid: payload.uid,
      payload: {
        name: payload.name,
        stockItem: payload.stockItem,
        departmentUid: payload.departmentUid,
        supplierUid: payload.supplierUid,
        categoryUid: payload.categoryUid,
        hazardUid: payload.hazardUid,
        storeRoomUid: payload.storeRoomUid,
        lotNumber: payload.lotNumber,
        batch: payload.batch,
        size: payload.size,
        unitUid: payload.unitUid,
        packagingUid: payload.packagingUid,
        dateReceived: payload.dateReceived,
        price: payload.price,
        expiryDate: payload.expiryDate,
        receivedByUid: payload.receivedByUid,
      },
    },
    "updateStockProduct"
  ).then((result) => {
    // inventoryStore.updateStockProduct(result);
  });
}

</script>

<template>
  <form @submit.prevent="submitStockForm" class="rounded-sm py-2" autocomplete="off" :inert="addingProduct">

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Stock Item</span>
      <div class="w-full">
        <VueMultiselect placeholder="Select a Stock Item" v-model="stockItem" :options="inventoryStore.stockItems"
          :searchable="true" label="name" track-by="uid">
        </VueMultiselect>
        <div class="text-orange-600 w-4/12">{{ errors.stockItem }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Name</span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" v-model="name" placeholder="Product Name..." />
        <div class="text-orange-600 w-4/12">{{ errors.name }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Department</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="departmentUid">
        <option value="null"></option>
        <option v-for="department in setupStore.departments" :key="department.uid" :value="department.uid">
          {{ department.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.departmentUid }}</div>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Category</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="categoryUid">
        <option value="null"></option>
        <option v-for="category in inventoryStore.categories" :key="category.uid" :value="category.uid">
          {{ category.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.categoryUid }}</div>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Hazard</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="hazardUid">
        <option value="null"></option>
        <option v-for="hazard in inventoryStore.hazards" :key="hazard.uid" :value="hazard.uid">
          {{ hazard.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.hazardUid }}</div>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Store Room</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="storeRoomUid">
        <option value="null"></option>
        <option v-for="storeRoom in storageStore.storeRooms" :key="storeRoom.uid" :value="storeRoom.uid">
          {{ storeRoom.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.storeRoomUid }}</div>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Supplier</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="supplierUid">
        <option value="null"></option>
        <option v-for="supplier in setupStore.suppliers" :key="supplier.uid" :value="supplier.uid">
          {{ supplier.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.supplierUid }}</div>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Lot Number</span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" v-model="lotNumber" placeholder="Lot Number..." />
        <div class="text-orange-600 w-4/12">{{ errors.lotNumber }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Batch</span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" v-model="batch" placeholder="Batch Number..." />
        <div class="text-orange-600 w-4/12">{{ errors.batch }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Size</span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" type="number" v-model="size" placeholder="Size..." />
        <div class="text-orange-600 w-4/12">{{ errors.size }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Unit</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="unitUid">
        <option value="null"></option>
        <option v-for="unit in inventoryStore.units" :key="unit.uid" :value="unit.uid">
          {{ unit.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.unitUid }}</div>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Packaging</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="packagingUid">
        <option value="null"></option>
        <option v-for="packaging in inventoryStore.packages" :key="packaging.uid" :value="packaging.uid">
          {{ packaging.name }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.packagingUid }}</div>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Quantity Received</span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" type="number" v-model="quantityReceived"
          placeholder="Quantity Received..." />
        <div class="text-orange-600 w-4/12">{{ errors.quantityReceived }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Price </span>
      <div class="w-full">
        <input class="form-input mt-1 block w-full" type="number" v-model="price" placeholder="Price..." />
        <div class="text-orange-600 w-4/12">{{ errors.price }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Received Date</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" type="date" v-model="dateReceived" placeholder="Received Date" />
        <div class="text-orange-600 w-4/12">{{ errors.dateReceived }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Expiry Date</span>
      <div class="w-full">
        <input class="form-input mt-1 w-full" type="date" v-model="expiryDate" placeholder="Expiry Date" />
        <div class="text-orange-600 w-4/12">{{ errors.expiryDate }}</div>
      </div>
    </label>

    <label class="flex items-center whitespace-nowrap w-full">
      <span class="text-gray-700 w-4/12">Received By</span>
      <select class="form-select ml-1 mt-1 w-full" v-model="receivedByUid">
        <option value="null"></option>
        <option v-for="user in userStore.users" :key="user.uid" :value="user.uid">
          {{ user.firstName }} {{ user.lastName }}
        </option>
      </select>
    </label>
    <div class="text-orange-600 w-4/12">{{ errors.receivedByUid }}</div>

    <hr class="my-4" />

    <button type="submit"
      class="-mb-4 w-1/5 border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
      v-show="!addingProduct">
      Save
    </button>
    <LoadingMessage message="Adding Inventory ..." v-show="addingProduct" />
  </form>
</template>