<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { usePatientStore } from '@/stores/patient';
import  useApiUtil  from '@/composables/api_util';
import { IdentificationType } from '@/types/gql'
import { AddIdentificationDocument, AddIdentificationMutation, AddIdentificationMutationVariables,
  EditIdentificationDocument, EditIdentificationMutation, EditIdentificationMutationVariables } from '@/graphql/operations/patient.mutations';
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

import PageHeading from "@/components/common/PageHeading.vue"
const patientStore = usePatientStore();
const { withClientMutation } = useApiUtil();

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const identificationSchema = yup.object({
  name: yup.string().trim().required('Identification name is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: identificationSchema,
  initialValues: {
    name: '',
  },
});

patientStore.fetchIdentifications();

function addIdentification(payload: { name: string }): void {
  withClientMutation<AddIdentificationMutation, AddIdentificationMutationVariables>(AddIdentificationDocument, payload, "createIdentification")
    .then((result) => patientStore.addIdentification(result));
}

function editIdentification(payload: { name: string }): void {
  if (!currentUid.value) return;
  withClientMutation<EditIdentificationMutation, EditIdentificationMutationVariables>(EditIdentificationDocument, { uid: currentUid.value, ...payload }, "updateIdentification")
    .then((result) => patientStore.updateIdentification(result));
}

function FormManager(create: boolean, obj = {} as IdentificationType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "PERSON IDENTIFICATION";
  if (create) {
    currentUid.value = null;
    resetForm({ values: { name: '' } });
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
    });
  }
}

const saveForm = handleSubmit((values) => {
  const payload = { name: values.name };
  if (formAction.value === true) addIdentification(payload);
  if (formAction.value === false) editIdentification(payload);
  showModal.value = false;
});

const identifications = computed(() => patientStore.getIdentifications)
</script>


<template>
  <div class="space-y-6">
    <PageHeading title="Person Identifications">
      <Button @click="FormManager(true)">Add Person Identification</Button>
    </PageHeading>

    <div class="rounded-md border border-border p-6 bg-card">
      <div class="overflow-x-auto">
        <Table class="min-w-full divide-y divide-border">
          <TableHeader>
            <TableRow>
              <TableHead class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</TableHead>
              <TableHead class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="divide-y divide-border bg-background">
            <TableRow v-for="identification in identifications" :key="identification?.uid" class="hover:bg-muted/50">
              <TableCell class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ identification?.name }}</TableCell>
              <TableCell class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <Button variant="outline" size="sm" @click="FormManager(false, identification)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Identification Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-1 gap-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Identification Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <hr class="border-border"/>
        
        <Button type="submit" class="w-full">
          Save Identification
        </Button>
      </Form>
    </template>
  </Modal>
</template>
