<script setup lang="ts">
import { computed, ref } from 'vue';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import {
  AddStockCategoryDocument,
  AddStockCategoryMutation,
  AddStockCategoryMutationVariables,
  EditStockCategoryDocument,
  EditStockCategoryMutation,
  EditStockCategoryMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { StockCategoryInputType, StockCategoryType } from '@/types/gql';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

defineOptions({ name: 'StockCategory' });

const inventoryStore = useInventoryStore();
const { withClientMutation } = useApiUtil();

const showModal = ref(false);
const formTitle = ref('');
const formAction = ref(true);
const currentUid = ref<string | null>(null);

const categorySchema = yup.object({
  name: yup.string().trim().required('Category name is required'),
  description: yup.string().trim().nullable(),
});

const defaultValues = { name: '', description: '' };
const modalFormInitialValues = ref<Record<string, unknown>>({ ...defaultValues });

inventoryStore.fetchCategories();
const stockCategories = computed(() => inventoryStore.getCategories);

function addStockCategory(payload: StockCategoryInputType): void {
  withClientMutation<AddStockCategoryMutation, AddStockCategoryMutationVariables>(
    AddStockCategoryDocument,
    { payload },
    'createStockCategory',
  ).then((result) => inventoryStore.addCategory(result));
}

function editStockCategory(payload: StockCategoryInputType): void {
  if (!currentUid.value) return;
  withClientMutation<EditStockCategoryMutation, EditStockCategoryMutationVariables>(
    EditStockCategoryDocument,
    { uid: currentUid.value, payload },
    'updateStockCategory',
  ).then((result) => inventoryStore.updateCategory(result));
}

function FormManager(create: boolean, obj: StockCategoryType | null): void {
  formAction.value = create;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' STOCK CATEGORY';
  if (create) {
    currentUid.value = null;
    modalFormInitialValues.value = { ...defaultValues };
  } else {
    currentUid.value = obj?.uid ?? null;
    modalFormInitialValues.value = {
      name: obj?.name ?? '',
      description: obj?.description ?? '',
    };
  }
  showModal.value = true;
}

function onModalFormSubmit(values: Record<string, unknown>): void {
  const payload = {
    name: values.name as string,
    description: (values.description as string) ?? null,
  } as StockCategoryInputType;
  if (formAction.value === true) addStockCategory(payload);
  if (formAction.value === false) editStockCategory(payload);
  showModal.value = false;
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Stock Categories</h2>
      <Button @click="FormManager(true, null)">Add Stock Category</Button>
    </div>

    <div class="rounded-md border border-border bg-card p-6">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Category Name
              </TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Description
              </TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <template v-if="stockCategories.length === 0">
              <TableEmpty :colspan="3">
                <Empty class="border-0 bg-transparent p-0">
                  <EmptyContent>
                    <EmptyHeader>
                      <EmptyTitle>No categories found</EmptyTitle>
                      <EmptyDescription>Create a category to organize stock items.</EmptyDescription>
                    </EmptyHeader>
                  </EmptyContent>
                </Empty>
              </TableEmpty>
            </template>
            <TableRow
              v-for="category in stockCategories"
              v-else
              :key="category?.uid"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell class="p-4 align-middle">{{ category?.name }}</TableCell>
              <TableCell class="p-4 align-middle text-primary">{{ category?.description }}</TableCell>
              <TableCell class="p-4 text-right align-middle">
                <Button variant="outline" size="sm" @click="FormManager(false, category)">Edit</Button>
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
          :validation-schema="categorySchema"
          @submit="onModalFormSubmit"
          class="space-y-6"
        >
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter category name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" class="min-h-[80px]" placeholder="Enter description..." />
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
