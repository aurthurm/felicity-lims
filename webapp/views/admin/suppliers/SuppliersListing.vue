<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { SupplierType } from '@/types/gql'
  import { AddSupplierDocument, AddSupplierMutation, AddSupplierMutationVariables,
    EditSupplierDocument, EditSupplierMutation, EditSupplierMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useForm } from "vee-validate";
  import { object, string } from "yup";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import PageHeading from "@/components/common/PageHeading.vue"
  const setupStore = useSetupStore();
  const { withClientMutation } = useApiUtil();
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  const formAction = ref<boolean>(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    name: string().required("Name is required"),
    description: string().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      description: "",
    },
  });

  setupStore.fetchSuppliers();
  const suppliers = computed(() => setupStore.getSuppliers)

  function addSupplier(payload: { name: string; description?: string | null }): void {
    withClientMutation<AddSupplierMutation, AddSupplierMutationVariables>(AddSupplierDocument, { payload }, "createSupplier")
    .then((result) => setupStore.addSupplier(result));
  }

  function editSupplier(payload: { name: string; description?: string | null }): void {
    if (!currentUid.value) {
      return;
    }
    withClientMutation<EditSupplierMutation, EditSupplierMutationVariables>(EditSupplierDocument, { uid: currentUid.value, payload }, "updateSupplier")
    .then((result) => setupStore.updateSupplier(result));
  }

  function FormManager(create: boolean, obj = {} as SupplierType ):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "SUPPLIER";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          description: "",
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? "",
        description: obj.description ?? "",
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    const payload = { name: values.name, description: values.description };
    if (formAction.value === true) addSupplier(payload);
    if (formAction.value === false) editSupplier(payload);
    showModal.value = false;
  });
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Suppliers">
      <Button @click="FormManager(true)"> Add Supplier</Button>
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Supplier</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="supplier in suppliers" :key="supplier?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle text-sm">{{ supplier?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ supplier?.description }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, supplier)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Supplier Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-4">
        <div class="space-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Enter supplier name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Enter supplier description..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </template>
  </Modal>
</template>


<style scoped>
  .toggle-checkbox:checked {
    right: 0;
    border-color: hsl(var(--success));
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: hsl(var(--success));
  }
</style>
