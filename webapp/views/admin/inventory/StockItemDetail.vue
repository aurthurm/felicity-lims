<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import {
  AddStockItemVariantDocument,
  AddStockItemVariantMutation,
  AddStockItemVariantMutationVariables,
  EditStockItemVariantDocument,
  EditStockItemVariantMutation,
  EditStockItemVariantMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import type { StockItemVariantInputType, StockItemVariantType, StockItemType } from '@/types/gql';
import { Button } from '@/components/ui/button';
import {FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

defineOptions({ name: 'StockItemDetail' });

const props = defineProps<{
  stockItem?: StockItemType | null;
}>();

const inventoryStore = useInventoryStore();
const { withClientMutation } = useApiUtil();

watch(
  () => props.stockItem?.uid,
  async (newUid) => {
    if (newUid) await inventoryStore.fetchItemVariants(newUid);
  },
);

const showModal = ref(false);
const formTitle = ref('');
const formAction = ref(true);
const currentUid = ref<string | null>(null);

const variantSchema = yup.object({
  name: yup.string().trim().required('Variant name is required'),
  description: yup.string().trim().nullable(),
  minimumLevel: yup.number().nullable(),
  maximumLevel: yup.number().nullable(),
});

const defaultValues = {
  name: '',
  description: '',
  minimumLevel: '' as number | '',
  maximumLevel: '' as number | '',
};
const { handleSubmit, setValues } = useForm({
  validationSchema: variantSchema,
  initialValues: { ...defaultValues },
});

function addStockItemVariant(payload: StockItemVariantInputType): void {
  const stockItemUid = props.stockItem?.uid;
  if (!stockItemUid) return;
  withClientMutation<AddStockItemVariantMutation, AddStockItemVariantMutationVariables>(
    AddStockItemVariantDocument,
    { stockItemUid, payload },
    'createStockItemVariant',
  ).then((result) => inventoryStore.addItemVariant(result));
}

function editStockItemVariant(payload: StockItemVariantInputType): void {
  if (!currentUid.value) return;
  withClientMutation<EditStockItemVariantMutation, EditStockItemVariantMutationVariables>(
    EditStockItemVariantDocument,
    { uid: currentUid.value, payload },
    'updateStockItemVariant',
  ).then((result) => inventoryStore.updateItemVariant(result));
}

function FormManager(create: boolean, obj: StockItemVariantType | null): void {
  formAction.value = create;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' A VARIANT';
  if (create) {
    currentUid.value = null;
    setValues({ ...defaultValues });
  } else {
    currentUid.value = obj?.uid ?? null;
    setValues({
      name: obj?.name ?? '',
      description: obj?.description ?? '',
      minimumLevel: obj?.minimumLevel ?? '',
      maximumLevel: obj?.maximumLevel ?? '',
    });
  }
  showModal.value = true;
}

const onModalFormSubmit = handleSubmit((values): void => {
  const payload = {
    name: values.name as string,
    description: (values.description as string) ?? null,
    minimumLevel: values.minimumLevel === '' ? null : Number(values.minimumLevel),
    maximumLevel: values.maximumLevel === '' ? null : Number(values.maximumLevel),
  } as StockItemVariantInputType;
  if (formAction.value === true) addStockItemVariant(payload);
  if (formAction.value === false) editStockItemVariant(payload);
  showModal.value = false;
});
</script>

<template>
  <div class="space-y-6">
    <section class="space-y-2">
      <h2 class="text-2xl font-semibold text-foreground">{{ stockItem?.name }}</h2>
      <p class="text-sm text-muted-foreground">{{ stockItem?.description }}</p>
    </section>

    <div class="flex items-center justify-between">
      <h3 class="text-xl font-semibold text-foreground">Item Variants</h3>
      <Button @click="FormManager(true, null)">Add New {{ stockItem?.name }}</Button>
    </div>

    <div class="rounded-md border border-border bg-card p-6">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Variant Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <template v-if="!stockItem?.variants?.length">
              <TableEmpty :colspan="3">
                <Empty class="border-0 bg-transparent p-0">
                  <EmptyContent>
                    <EmptyHeader>
                      <EmptyTitle>No variants yet</EmptyTitle>
                      <EmptyDescription>Add a variant to manage stock levels.</EmptyDescription>
                    </EmptyHeader>
                  </EmptyContent>
                </Empty>
              </TableEmpty>
            </template>
            <TableRow
              v-for="variant in stockItem?.variants"
              v-else
              :key="variant?.uid"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell class="p-4 align-middle">{{ variant?.name }}</TableCell>
              <TableCell class="p-4 align-middle text-primary">{{ variant?.description }}</TableCell>
              <TableCell class="p-4 text-right align-middle">
                <Button variant="outline" size="sm" @click="FormManager(false, variant)">Edit</Button>
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
        <form
          @submit.prevent="onModalFormSubmit"
          class="space-y-6"
        >
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Variant Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter variant name..." />
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
          <Button type="submit" class="w-full">Save Changes</Button>
        </form>
      </template>
    </Modal>
  </div>
</template>
