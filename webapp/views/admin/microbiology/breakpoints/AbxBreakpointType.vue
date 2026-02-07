<script setup lang="ts">
import { onMounted, ref} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import {AbxBreakpointTypeType} from "@/types/gql";
import {
  AddAbxBreakpointTypeDocument,
  AddAbxBreakpointTypeMutation,
  AddAbxBreakpointTypeMutationVariables,
  EditAbxBreakpointTypeDocument,
  EditAbxBreakpointTypeMutation,
  EditAbxBreakpointTypeMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import { GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables, GetAbxBreakpointTypeAllDocument } from '@/graphql/operations/microbiology.queries';
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

const breakpointTypeSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: breakpointTypeSchema,
  initialValues: {
    name: '',
    description: '',
  },
});
const abxBreakpointTypes = ref<AbxBreakpointTypeType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxBreakpointTypeAllQuery, GetAbxBreakpointTypeAllQueryVariables>(
      GetAbxBreakpointTypeAllDocument, {}, "abxBreakpointTypeAll"
  ).then((result) => {
    if (result) {
      abxBreakpointTypes.value = result as AbxBreakpointTypeType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxBreakpointTypeType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx BreakpointType";
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
    withClientMutation<AddAbxBreakpointTypeMutation, AddAbxBreakpointTypeMutationVariables>(
        AddAbxBreakpointTypeDocument, {payload}, "createAbxBreakpointType"
    ).then((result) => {
      if (result) {
        abxBreakpointTypes.value.unshift(result as AbxBreakpointTypeType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxBreakpointTypeMutation, EditAbxBreakpointTypeMutationVariables>(EditAbxBreakpointTypeDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxBreakpointType")
        .then((result) => {
          if (result) {
            const idx = abxBreakpointTypes.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxBreakpointTypes.value = [
                ...abxBreakpointTypes.value.map((item, index) => index === idx ? result : item),
              ] as AbxBreakpointTypeType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Antibiotic Breakpoint Type"></PageHeading>

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
            <TableRow v-for="bpt in abxBreakpointTypes" :key="bpt?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ bpt?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ bpt?.description }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right text-sm">
                <!-- <button @click="FormManager(false, bpt)"
                        class="px-3 py-1.5 bg-primary text-primary-foreground rounded-sm transition duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  Edit
                </button> -->
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxBreakpointTypes || abxBreakpointTypes.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No breakpoint types found</EmptyTitle>
                    <EmptyDescription>Add a breakpoint type to get started.</EmptyDescription>
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
          Save Abx BreakpointType
        </Button>
      </form>
    </template>
  </Modal>
</template>

<style scoped>
/* Remove the toggle-checkbox styles as they are not needed */
</style>
