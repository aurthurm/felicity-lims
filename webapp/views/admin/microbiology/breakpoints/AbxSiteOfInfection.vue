<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import {AbxSiteOfInfectionType} from "@/types/gql";
import {
  AddAbxSiteOfInfectionDocument,
  AddAbxSiteOfInfectionMutation,
  AddAbxSiteOfInfectionMutationVariables,
  EditAbxSiteOfInfectionDocument,
  EditAbxSiteOfInfectionMutation,
  EditAbxSiteOfInfectionMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxSiteOfInfectionAllQuery, GetAbxSiteOfInfectionAllQueryVariables, GetAbxSiteOfInfectionAllDocument } from '@/graphql/operations/microbiology.queries';
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

const siteOfInfectionSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: siteOfInfectionSchema,
  initialValues: {
    name: '',
    description: '',
  },
});
const abxSiteOfInfections = ref<AbxSiteOfInfectionType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxSiteOfInfectionAllQuery, GetAbxSiteOfInfectionAllQueryVariables>(
      GetAbxSiteOfInfectionAllDocument, {}, "abxSiteOfInfectionAll"
  ).then((result) => {
    if (result) {
      abxSiteOfInfections.value = result as AbxSiteOfInfectionType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxSiteOfInfectionType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx SiteOfInfection";
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
    withClientMutation<AddAbxSiteOfInfectionMutation, AddAbxSiteOfInfectionMutationVariables>(
        AddAbxSiteOfInfectionDocument, {payload}, "createAbxSiteOfInfection"
    ).then((result) => {
      if (result) {
        abxSiteOfInfections.value.unshift(result as AbxSiteOfInfectionType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxSiteOfInfectionMutation, EditAbxSiteOfInfectionMutationVariables>(EditAbxSiteOfInfectionDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxSiteOfInfection")
        .then((result) => {
          if (result) {
            const idx = abxSiteOfInfections.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxSiteOfInfections.value = [
                ...abxSiteOfInfections.value.map((item, index) => index === idx ? result : item),
              ] as AbxSiteOfInfectionType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Site of Infection"></PageHeading>

    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card shadow-dashboard rounded-lg p-6">
        <Table class="min-w-full divide-y divide-border">
          <TableHeader>
            <TableRow>
              <TableHead class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</TableHead>
              <TableHead class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Description</TableHead>
              <TableHead class="px-3 py-3.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="bg-background divide-y divide-border">
            <TableRow v-for="soi in abxSiteOfInfections" :key="soi?.uid">
              <TableCell class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ soi?.name }}</TableCell>
              <TableCell class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ soi?.description }}</TableCell>
              <TableCell class="px-3 py-3.5 whitespace-nowrap text-right text-sm">
                <!-- <button @click="FormManager(false, soi)"
                        class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Edit
                </button> -->
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxSiteOfInfections || abxSiteOfInfections.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No sites of infection found</EmptyTitle>
                    <EmptyDescription>Add a site to get started.</EmptyDescription>
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
          Save Abx SiteOfInfection
        </Button>
      </form>
    </template>
  </Modal>
</template>

<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
