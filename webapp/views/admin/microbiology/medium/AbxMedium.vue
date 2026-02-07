<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import {AbxMediumType} from "@/types/gql";
import {
  AddAbxMediumDocument,
  AddAbxMediumMutation,
  AddAbxMediumMutationVariables,
  EditAbxMediumDocument,
  EditAbxMediumMutation,
  EditAbxMediumMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables, GetAbxMediumAllDocument } from '@/graphql/operations/microbiology.queries';
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

const mediumSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  description: yup.string().trim().nullable(),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: mediumSchema,
  initialValues: {
    name: '',
    description: '',
  },
});
const abxMediums = ref<AbxMediumType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxMediumAllQuery, GetAbxMediumAllQueryVariables>(
      GetAbxMediumAllDocument, {}, "abxMediumAll"
  ).then((result) => {
    if (result) {
      abxMediums.value = result as AbxMediumType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxMediumType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx Medium";
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
    description: formValues.description ?? null,
  };

  if (formAction.value === true) {
    withClientMutation<AddAbxMediumMutation, AddAbxMediumMutationVariables>(
        AddAbxMediumDocument, {payload}, "createAbxMedium"
    ).then((result) => {
      if (result) {
        abxMediums.value.unshift(result as AbxMediumType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxMediumMutation, EditAbxMediumMutationVariables>(EditAbxMediumDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxMedium")
        .then((result) => {
          if (result) {
            const idx = abxMediums.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxMediums.value = [
                ...abxMediums.value.map((item, index) => index === idx ? result : item),
              ] as AbxMediumType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>

  <div class="space-y-6">
    <PageHeading title="Antibiotic Medium">
      <!-- <Button @click="FormManager(true)">Add Medium</Button> -->
    </PageHeading>

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
            <TableRow v-for="medium in abxMediums" :key="medium?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ medium?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ medium?.description }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-right text-sm">
              <!-- <button @click="FormManager(false, medium)"
                      class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                Edit
              </button> -->
            </TableCell>
          </TableRow>
          <TableEmpty v-if="!abxMediums || abxMediums.length === 0" :colspan="3">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No media found</EmptyTitle>
                  <EmptyDescription>Add a medium to get started.</EmptyDescription>
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
          Save Abx Medium
        </Button>
      </form>
    </template>
  </Modal>

</template>


<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
