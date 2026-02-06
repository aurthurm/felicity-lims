<script setup lang="ts">
import { computed, ref } from 'vue';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import {
  AddStockUnitDocument,
  AddStockUnitMutation,
  AddStockUnitMutationVariables,
  EditStockUnitDocument,
  EditStockUnitMutation,
  EditStockUnitMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockUnitType } from '@/types/gql';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

defineOptions({ name: 'StockUnit' });

const inventoryStore = useInventoryStore();
const { withClientMutation } = useApiUtil();

const showModal = ref(false);
const formTitle = ref('');
const formAction = ref(true);
const currentUid = ref<string | null>(null);

const unitSchema = yup.object({
  name: yup.string().trim().required('Stock unit name is required'),
});

const defaultValues = { name: '' };
const modalFormInitialValues = ref<Record<string, unknown>>({ ...defaultValues });

inventoryStore.fetchUnits();
const stockUnits = computed(() => inventoryStore.getUnits);

function addStockUnit(payload: { name: string }): void {
  withClientMutation<AddStockUnitMutation, AddStockUnitMutationVariables>(
    AddStockUnitDocument,
    { payload },
    'createStockUnit',
  ).then((result) => inventoryStore.addUnit(result));
}

function editStockUnit(payload: { name: string }): void {
  if (!currentUid.value) return;
  withClientMutation<EditStockUnitMutation, EditStockUnitMutationVariables>(
    EditStockUnitDocument,
    { uid: currentUid.value, payload },
    'updateStockUnit',
  ).then((result) => inventoryStore.updateUnit(result as StockUnitType));
}

function FormManager(create: boolean, obj: StockUnitType | null): void {
  formAction.value = create;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' STOCK UNIT';
  if (create) {
    currentUid.value = null;
    modalFormInitialValues.value = { ...defaultValues };
  } else {
    currentUid.value = obj?.uid ?? null;
    modalFormInitialValues.value = { name: obj?.name ?? '' };
  }
  showModal.value = true;
}

function onModalFormSubmit(values: Record<string, unknown>): void {
  const payload = { name: values.name as string };
  if (formAction.value === true) addStockUnit(payload);
  if (formAction.value === false) editStockUnit(payload);
  showModal.value = false;
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Stock Units</h2>
      <Button @click="FormManager(true, null)">Add Stock Unit</Button>
    </div>

    <div class="rounded-md border border-border bg-card p-6">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Unit Name
              </TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <template v-if="stockUnits.length === 0">
              <TableEmpty :colspan="2">
                <Empty class="border-0 bg-transparent p-0">
                  <EmptyContent>
                    <EmptyHeader>
                      <EmptyTitle>No units defined</EmptyTitle>
                      <EmptyDescription>Add stock units to standardize quantities.</EmptyDescription>
                    </EmptyHeader>
                  </EmptyContent>
                </Empty>
              </TableEmpty>
            </template>
            <TableRow
              v-for="unit in stockUnits"
              v-else
              :key="unit?.uid"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell class="p-4 align-middle">{{ unit?.name }}</TableCell>
              <TableCell class="p-4 text-right align-middle">
                <Button variant="outline" size="sm" @click="FormManager(false, unit)">Edit</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <Modal v-if="showModal" @close="showModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>
      <template #body>
        <Form
          :initial-values="modalFormInitialValues"
          :validation-schema="unitSchema"
          @submit="onModalFormSubmit"
          class="space-y-6"
        >
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Stock Unit Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter unit name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="w-full">Save Changes</Button>
        </Form>
      </template>
    </Modal>
  </div>
</template>
