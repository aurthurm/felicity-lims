<script setup lang="ts">
import { computed, ref } from 'vue';
import * as yup from 'yup';
import Modal from '@/components/ui/Modal.vue';
import {
  AddHazardDocument,
  AddHazardMutation,
  AddHazardMutationVariables,
  EditHazardDocument,
  EditHazardMutation,
  EditHazardMutationVariables,
} from '@/graphql/operations/inventory.mutations';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { useInventoryStore } from '@/stores/inventory';
import useApiUtil from '@/composables/api_util';
import { HazardInputType, HazardType } from '@/types/gql';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

defineOptions({ name: 'Hazard' });

const inventoryStore = useInventoryStore();
const { withClientMutation } = useApiUtil();

const showModal = ref(false);
const formTitle = ref('');
const formAction = ref(true);
const currentUid = ref<string | null>(null);

const hazardSchema = yup.object({
  name: yup.string().trim().required('Hazard name is required'),
  description: yup.string().trim().nullable(),
});

const defaultValues = { name: '', description: '' };
const modalFormInitialValues = ref<Record<string, unknown>>({ ...defaultValues });

inventoryStore.fetchHazards();
const hazards = computed(() => inventoryStore.getHazards);

function addHazard(payload: HazardInputType): void {
  withClientMutation<AddHazardMutation, AddHazardMutationVariables>(AddHazardDocument, { payload }, 'createHazard').then(
    (result) => inventoryStore.addHazard(result),
  );
}

function editHazard(payload: HazardInputType): void {
  if (!currentUid.value) return;
  withClientMutation<EditHazardMutation, EditHazardMutationVariables>(
    EditHazardDocument,
    { uid: currentUid.value, payload },
    'updateHazard',
  ).then((result) => inventoryStore.updateHazard(result));
}

function FormManager(create: boolean, obj: HazardType | null): void {
  formAction.value = create;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' A HAZARD';
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
  } as HazardInputType;
  if (formAction.value === true) addHazard(payload);
  if (formAction.value === false) editHazard(payload);
  showModal.value = false;
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-semibold text-foreground">Hazards</h2>
      <Button @click="FormManager(true, null)">Add Hazard</Button>
    </div>

    <div class="rounded-md border border-border bg-card p-6">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Hazard Name
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
            <template v-if="hazards.length === 0">
              <TableEmpty :colspan="3">
                <Empty class="border-0 bg-transparent p-0">
                  <EmptyContent>
                    <EmptyHeader>
                      <EmptyTitle>No hazards found</EmptyTitle>
                      <EmptyDescription>Add hazards to tag stock items safely.</EmptyDescription>
                    </EmptyHeader>
                  </EmptyContent>
                </Empty>
              </TableEmpty>
            </template>
            <TableRow
              v-for="hazard in hazards"
              v-else
              :key="hazard?.uid"
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <TableCell class="p-4 align-middle">{{ hazard?.name }}</TableCell>
              <TableCell class="p-4 align-middle text-primary">{{ hazard?.description }}</TableCell>
              <TableCell class="p-4 text-right align-middle">
                <Button variant="outline" size="sm" @click="FormManager(false, hazard)">Edit</Button>
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
          :validation-schema="hazardSchema"
          @submit="onModalFormSubmit"
          class="space-y-6"
        >
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Hazard Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter hazard name..." />
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
