<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { UnitType } from '@/types/gql'
  import { AddUnitDocument, AddUnitMutation, AddUnitMutationVariables,
    EditUnitDocument, EditUnitMutation, EditUnitMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'UnitsView' })
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  setupStore.fetchUnits();    
  const units = computed(() => setupStore.getUnits);

  const unitSchema = yup.object({
    name: yup.string().trim().required('Name is required'),
    description: yup.string().trim().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: unitSchema,
    initialValues: {
      name: '',
      description: '',
    },
  });

  const currentUid = ref<string | null>(null);

  function addUnit(payload: { name: string; description: string | null }): void {
    withClientMutation<AddUnitMutation, AddUnitMutationVariables>(AddUnitDocument, { payload }, "createUnit")
    .then((result) => setupStore.addUnit(result));
  }

  function editUnit(payload: { name: string; description: string | null }): void {
    if (!currentUid.value) return;
    withClientMutation<EditUnitMutation, EditUnitMutationVariables>(EditUnitDocument, { uid: currentUid.value, payload }, "updateUnit")
    .then((result) => setupStore.updateUnit(result));
  }

  function FormManager(create: boolean, obj = {} as UnitType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "UNIT";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: '',
          description: '',
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? '',
        description: obj.description ?? '',
      });
    }
  }

  const saveForm = handleSubmit((values) => {
    const payload = {
      name: values.name,
      description: values.description ?? null,
    };
    if (formAction.value === true) addUnit(payload);
    if (formAction.value === false) editUnit(payload);
    showModal.value = false;
  });
  
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Units">
      <Button @click="FormManager(true)"> Add Unit</Button>
    </PageHeading>

    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
              <TableHead class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="px-4 py-2 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="unit in units" :key="unit?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-2 align-middle">{{ unit?.name }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-primary">{{ unit?.description }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, unit)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!units || units.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No units found</EmptyTitle>
                    <EmptyDescription>Add a unit to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Unit Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="space-y-4">
        <div class="space-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter unit name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </Form>
    </template>
  </Modal>
</template>
