<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { ManufacturerType } from '@/types/gql'
  import { AddManufacturerDocument, AddManufacturerMutation, AddManufacturerMutationVariables,
    EditManufacturerDocument, EditManufacturerMutation, EditManufacturerMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
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
defineOptions({ name: 'ManufacturersView' })
  const setupStore = useSetupStore();
  const { withClientMutation } = useApiUtil()
  
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

  setupStore.fetchManufacturers()
  const manufacturers = computed(() => setupStore.getManufacturers)

  function addManufacturer(payload: { name: string; description?: string | null }): void {
    withClientMutation<AddManufacturerMutation, AddManufacturerMutationVariables>(AddManufacturerDocument, { payload }, "createManufacturer")
    .then((result) => setupStore.addManufacturer(result));
  }

  function editManufacturer(payload: { name: string; description?: string | null }): void {
    if (!currentUid.value) {
      return;
    }
    withClientMutation<EditManufacturerMutation, EditManufacturerMutationVariables>(EditManufacturerDocument, { uid: currentUid.value, payload }, "updateManufacturer")
    .then((result) => setupStore.updateManufacturer(result));
  }

  function FormManager(create: boolean, obj = {} as ManufacturerType):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "MANUFACTURER";
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
    if (formAction.value === true) addManufacturer(payload);
    if (formAction.value === false) editManufacturer(payload);
    showModal.value = false;
  });
</script>


<template>
  <div class="space-y-6">
    <PageHeading title="Manufacturers">
      <Button @click="FormManager(true)"> Add Manufacturer</Button>
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Manufacturer</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="manufacturer in manufacturers" :key="manufacturer?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle text-sm">{{ manufacturer?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ manufacturer?.description }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, manufacturer)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Manufacturer Edit Form Modal -->
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
                <Input v-bind="componentField" placeholder="Enter manufacturer name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Enter manufacturer description..." />
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
