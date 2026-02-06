<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import {AbxTestMethodType} from "@/types/gql";
import {
  AddAbxTestMethodDocument,
  AddAbxTestMethodMutation,
  AddAbxTestMethodMutationVariables,
  EditAbxTestMethodDocument,
  EditAbxTestMethodMutation,
  EditAbxTestMethodMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables, GetAbxTestMethodAllDocument } from '@/graphql/operations/microbiology.queries';
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

const testMethodSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: testMethodSchema,
  initialValues: {
    name: '',
    description: '',
  },
});
const abxTestMethods = ref<AbxTestMethodType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxTestMethodAllQuery, GetAbxTestMethodAllQueryVariables>(
      GetAbxTestMethodAllDocument, {}, "abxTestMethodAll"
  ).then((result) => {
    if (result) {
      abxTestMethods.value = result as AbxTestMethodType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxTestMethodType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx TestMethod";
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
    withClientMutation<AddAbxTestMethodMutation, AddAbxTestMethodMutationVariables>(
        AddAbxTestMethodDocument, {payload}, "createAbxTestMethod"
    ).then((result) => {
      if (result) {
        abxTestMethods.value.unshift(result as AbxTestMethodType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxTestMethodMutation, EditAbxTestMethodMutationVariables>(EditAbxTestMethodDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxTestMethod")
        .then((result) => {
          if (result) {
            const idx = abxTestMethods.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxTestMethods.value = [
                ...abxTestMethods.value.map((item, index) => index === idx ? result : item),
              ] as AbxTestMethodType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Antibiotic Test Method"></PageHeading>

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
            <TableRow v-for="testmeth in abxTestMethods" :key="testmeth?.uid">
              <TableCell class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ testmeth?.name }}</TableCell>
              <TableCell class="px-3 py-3.5 whitespace-nowrap text-sm text-foreground">{{ testmeth?.description }}</TableCell>
              <TableCell class="px-3 py-3.5 whitespace-nowrap text-right text-sm">
                <!-- <button @click="FormManager(false, testmeth)"
                        class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Edit
                </button> -->
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxTestMethods || abxTestMethods.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No test methods found</EmptyTitle>
                    <EmptyDescription>Add a test method to get started.</EmptyDescription>
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
          Save Abx TestMethod
        </Button>
      </form>
    </template>
  </Modal>
</template>

<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
