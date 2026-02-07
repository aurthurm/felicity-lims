<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import {AbxHostType} from "@/types/gql";
import {
  AddAbxHostDocument,
  AddAbxHostMutation,
  AddAbxHostMutationVariables,
  EditAbxHostDocument,
  EditAbxHostMutation,
  EditAbxHostMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxHostAllQuery, GetAbxHostAllQueryVariables, GetAbxHostAllDocument } from '@/graphql/operations/microbiology.queries';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import PageHeading from "@/components/common/PageHeading.vue"
const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const hostSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: hostSchema,
  initialValues: {
    name: '',
    description: '',
  },
});
const abxHosts = ref<AbxHostType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxHostAllQuery, GetAbxHostAllQueryVariables>(
      GetAbxHostAllDocument, {}, "abxHostAll"
  ).then((result) => {
    if (result) {
      abxHosts.value = result as AbxHostType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxHostType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx Host";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
      description: obj.description ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    name: formValues.name,
    description: formValues.description,
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxHostMutation, AddAbxHostMutationVariables>(
        AddAbxHostDocument, {payload}, "createAbxHost"
    ).then((result) => {
      if (result) {
        abxHosts.value.unshift(result as AbxHostType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxHostMutation, EditAbxHostMutationVariables>(EditAbxHostDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxHost")
        .then((result) => {
          if (result) {
            const idx = abxHosts.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxHosts.value = [
                ...abxHosts.value.map((item, index) => index === idx ? result : item),
              ] as AbxHostType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Antibiotic Host"></PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="host in abxHosts" :key="host?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ host?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ host?.description }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right text-sm">
                <!-- <button @click="FormManager(false, host)"
                        class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Edit
                </button> -->
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxHosts || abxHosts.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No hosts found</EmptyTitle>
                    <EmptyDescription>Add a host to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Location Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Begin typing ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <hr class="border-border"/>
        <Button type="submit" class="w-full">
          Save Abx Host
        </Button>
      </form>
    </template>
  </Modal>

</template>


<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
