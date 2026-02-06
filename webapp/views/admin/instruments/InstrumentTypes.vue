<script setup lang="ts">
  import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
  import { useForm } from "vee-validate";
  import { object, string } from "yup";
  import { InstrumentTypeType } from '@/types/gql'
  import { AddInstrumentTypeDocument, AddInstrumentTypeMutation, AddInstrumentTypeMutationVariables,
    EditInstrumentTypeDocument, EditInstrumentTypeMutation, EditInstrumentTypeMutationVariables } from '@/graphql/operations/instrument.mutations';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
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

  onMounted(() => {
    setupStore.fetchInstrumentTypes(); 
  })
   
  const instrumentTypes = computed(() => setupStore.getInstrumentTypes);
  function addInstrumentType(payload: { name: string; description?: string | null }): void {
    withClientMutation<AddInstrumentTypeMutation, AddInstrumentTypeMutationVariables>(AddInstrumentTypeDocument, { payload }, "createInstrumentType")
    .then((result) => setupStore.addInstrumentType(result));
  }

  function editInstrumentType(payload: { name: string; description?: string | null }): void {
    if (!currentUid.value) {
      return;
    }
    withClientMutation<EditInstrumentTypeMutation, EditInstrumentTypeMutationVariables>(EditInstrumentTypeDocument, { uid: currentUid.value, payload }, "updateInstrumentType")
    .then((result) => setupStore.updateInstrumentType(result));
  }

  function FormManager(create: boolean, obj = {} as InstrumentTypeType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "INSTRUMENT TYPE";
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
    if (formAction.value === true) addInstrumentType(payload);
    if (formAction.value === false) editInstrumentType(payload);
    showModal.value = false;
  });
  
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Instrument Types">
      <Button @click="FormManager(true)"> Add Instrument Type</Button>
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
            <TableRow v-for="instype in instrumentTypes" :key="instype?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-2 align-middle">{{ instype?.name }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-primary">{{ instype?.description }}</TableCell>
              <TableCell class="px-4 py-2 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, instype)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!instrumentTypes || instrumentTypes.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No instrument types found</EmptyTitle>
                    <EmptyDescription>Add an instrument type to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Instrument Type Edit Form Modal -->
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
                <Input v-bind="componentField" placeholder="Enter instrument type name..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Enter description..." />
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
