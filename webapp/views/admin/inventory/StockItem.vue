<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref } from 'vue';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import Drawer from '@/components/ui/Drawer.vue';
import {
  AddStockItemDocument,
  AddStockItemMutation,
  AddStockItemMutationVariables,
  EditStockItemDocument,
  EditStockItemMutation,
  EditStockItemMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockItemInputType, StockItemType } from '@/types/gql';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

defineOptions({ name: 'StockItem' });

const StockItemDetail = defineAsyncComponent(() => import('./StockItemDetail.vue'));

const inventoryStore = useInventoryStore();
const { withClientMutation } = useApiUtil();

const showModal = ref(false);
const formTitle = ref('');
const formAction = ref(true);
const currentUid = ref<string | null>(null);

const stockItemSchema = yup.object({
  name: yup.string().trim().required('Stock item name is required'),
  description: yup.string().trim().nullable(),
  hazardUid: yup.string().trim().nullable(),
  categoryUid: yup.string().trim().nullable(),
  minimumLevel: yup.number().nullable(),
  maximumLevel: yup.number().nullable(),
});

const defaultValues = {
  name: '',
  description: '',
  hazardUid: '',
  categoryUid: '',
  minimumLevel: '' as number | '',
  maximumLevel: '' as number | '',
};
const modalFormInitialValues = ref<Record<string, unknown>>({ ...defaultValues });

const itemParams = reactive({
  first: 50,
  after: '',
  text: '',
  sortBy: ['-uid'],
});

inventoryStore.fetchAllDependencies();
inventoryStore.fetchItems(itemParams);
const stockItems = computed(() => inventoryStore.getStockItems);
const hazards = computed(() => inventoryStore.getHazards);
const categories = computed(() => inventoryStore.getCategories);

function addStockItem(payload: StockItemInputType): void {
  withClientMutation<AddStockItemMutation, AddStockItemMutationVariables>(
    AddStockItemDocument,
    { payload },
    'createStockItem',
  ).then((result) => inventoryStore.addItem(result as StockItemType));
}

function editStockItem(payload: StockItemInputType): void {
  if (!currentUid.value) return;
  withClientMutation<EditStockItemMutation, EditStockItemMutationVariables>(
    EditStockItemDocument,
    { uid: currentUid.value, payload },
    'updateStockItem',
  ).then((result) => inventoryStore.updateItem(result as StockItemType));
}

function FormManager(create: boolean, obj: StockItemType | null): void {
  formAction.value = create;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' STOCK ITEM';
  if (create) {
    currentUid.value = null;
    modalFormInitialValues.value = { ...defaultValues };
  } else {
    currentUid.value = obj?.uid ?? null;
    modalFormInitialValues.value = {
      name: obj?.name ?? '',
      description: obj?.description ?? '',
      hazardUid: obj?.hazardUid ?? '',
      categoryUid: obj?.categoryUid ?? '',
      minimumLevel: obj?.minimumLevel ?? '',
      maximumLevel: obj?.maximumLevel ?? '',
    };
  }
  showModal.value = true;
}

function onModalFormSubmit(values: Record<string, unknown>): void {
  const payload = {
    name: values.name as string,
    description: (values.description as string) ?? null,
    hazardUid: values.hazardUid ? (values.hazardUid as string) : null,
    categoryUid: values.categoryUid ? (values.categoryUid as string) : null,
    minimumLevel: values.minimumLevel === '' ? null : Number(values.minimumLevel),
    maximumLevel: values.maximumLevel === '' ? null : Number(values.maximumLevel),
  } as StockItemInputType;
  if (formAction.value === true) addStockItem(payload);
  if (formAction.value === false) editStockItem(payload);
  showModal.value = false;
}

const openDrawer = ref(false);
const stockItem = ref<StockItemType | undefined>();
function viewStockItem(item: StockItemType) {
  stockItem.value = item;
  openDrawer.value = true;
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Stock Items</h2>
      <Button @click="FormManager(true, null)">Add Stock Item</Button>
    </div>

    <div class="rounded-md border border-border bg-card p-6">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Hazard</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <template v-if="!stockItems?.length">
              <TableEmpty :colspan="5">
                <Empty class="border-0 bg-transparent p-0">
                  <EmptyContent>
                    <EmptyHeader>
                      <EmptyTitle>No stock items found</EmptyTitle>
                      <EmptyDescription>Add a stock item to get started.</EmptyDescription>
                    </EmptyHeader>
                  </EmptyContent>
                </Empty>
              </TableEmpty>
            </template>
            <TableRow
              v-for="item in stockItems"
              v-else
              :key="item?.uid"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell class="p-4 align-middle">{{ item?.name }}</TableCell>
              <TableCell class="p-4 align-middle text-primary">{{ item?.category?.name }}</TableCell>
              <TableCell class="p-4 align-middle text-primary">{{ item?.hazard?.name }}</TableCell>
              <TableCell class="p-4 align-middle text-primary">{{ item?.description }}</TableCell>
              <TableCell class="p-4 text-right align-middle">
                <div class="flex justify-end gap-2">
                  <Button variant="outline" size="sm" @click="FormManager(false, item)">Edit</Button>
                  <Button variant="outline" size="sm" @click="viewStockItem(item)">View</Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <Drawer :show="openDrawer" @close="openDrawer = false">
      <template #header>
        <h3 class="text-lg font-semibold text-foreground">Stock Item Detail</h3>
      </template>
      <template #body>
        <StockItemDetail :stock-item="stockItem" />
      </template>
    </Drawer>

    <Modal v-if="showModal" @close="showModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>
      <template #body>
        <Form
          :initial-values="modalFormInitialValues"
          :validation-schema="stockItemSchema"
          @submit="onModalFormSubmit"
          class="space-y-6"
        >
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Stock Item Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter item name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="grid grid-cols-2 gap-4">
            <FormField name="minimumLevel" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Minimum Level</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="0" placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="maximumLevel" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Maximum Level</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" type="number" min="0" placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" class="min-h-[80px]" placeholder="Enter description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="grid grid-cols-2 gap-4">
            <FormField name="hazardUid" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Hazard</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a hazard..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select a hazard...</SelectItem>
                      <SelectItem v-for="h in hazards" :key="h.uid" :value="h?.uid ?? ''">
                        {{ h.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="categoryUid" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select a category...</SelectItem>
                      <SelectItem v-for="c in categories" :key="c.uid" :value="c?.uid ?? ''">
                        {{ c.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <Button type="submit" class="w-full">Save Changes</Button>
        </Form>
      </template>
    </Modal>
  </div>
</template>
