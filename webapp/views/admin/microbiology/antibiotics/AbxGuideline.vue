<script setup lang="ts">
import {defineAsyncComponent, onMounted, ref} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import {AbxGuidelineType} from "@/types/gql";
import {
  AddAbxGuidelineDocument,
  AddAbxGuidelineMutation,
  AddAbxGuidelineMutationVariables,
  EditAbxGuidelineDocument,
  EditAbxGuidelineMutation,
  EditAbxGuidelineMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxGuidelinesAllDocument,
  GetAbxGuidelinesAllQuery,
  GetAbxGuidelinesAllQueryVariables
} from "@/graphql/operations/microbiology.queries";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
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
const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const guidelineSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  code: yup.string().trim().required('Code is required'),
  description: yup.string().trim().nullable(),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: guidelineSchema,
  initialValues: {
    name: '',
    code: '',
    description: '',
  },
});

const abxGuidelines = ref<AbxGuidelineType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxGuidelinesAllQuery, GetAbxGuidelinesAllQueryVariables>(
      GetAbxGuidelinesAllDocument, {}, "abxGuidelinesAll"
  ).then((result) => {
    if (result) {
      abxGuidelines.value = result as AbxGuidelineType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxGuidelineType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Abx Guideline";
  if (create) {
    currentUid.value = null;
    resetForm({
      values: {
        name: '',
        code: '',
        description: '',
      },
    });
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
      code: obj.code ?? '',
      description: obj.description ?? '',
    });
  }
}

const saveForm = handleSubmit((values) => {
  const payload = {
    name: values.name,
    code: values.code,
    description: values.description ?? null,
  };

  if (formAction.value === true) {
    withClientMutation<AddAbxGuidelineMutation, AddAbxGuidelineMutationVariables>(
        AddAbxGuidelineDocument, {payload}, "createAbxGuideline"
    ).then((result) => {
      if (result) {
        abxGuidelines.value.unshift(result as AbxGuidelineType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxGuidelineMutation, EditAbxGuidelineMutationVariables>(EditAbxGuidelineDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxGuideline")
        .then((result) => {
          if (result) {
            const idx = abxGuidelines.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxGuidelines.value = [
                ...abxGuidelines.value.map((item, index) => index === idx ? result : item),
              ] as AbxGuidelineType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Antibiotic Guidelines">
      <Button @click="FormManager(true)">Add Guideline</Button>      
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="guideline in abxGuidelines" :key="guideline?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ guideline?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ guideline?.description }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ guideline?.code }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <Button 
                  variant="outline"
                  size="sm"
                  @click="FormManager(false, guideline)"
                  class="mr-2">
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  size="sm"
                  @click="deleteGuideline(guideline)">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxGuidelines || abxGuidelines.length === 0" :colspan="4">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No guidelines found</EmptyTitle>
                    <EmptyDescription>Add a guideline to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @close="showModal = false">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

      <template v-slot:body>
        <form @submit.prevent="saveForm" class="space-y-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" rows="3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="code" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="flex justify-end space-x-2">
            <Button type="button" variant="outline" @click="showModal = false">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<style lang="postcss" scoped>
@reference "@/assets/css/style.css";
.multiselect-blue {
  @apply rounded-md border border-input bg-background;
}

.multiselect-blue .multiselect__tags {
  @apply border-0 bg-transparent px-3 py-2 text-sm;
}

.multiselect-blue .multiselect__single {
  @apply mb-0 text-sm text-foreground;
}

.multiselect-blue .multiselect__input {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option--highlight {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue .multiselect__option--selected {
  @apply bg-primary/20 text-primary;
}
</style>
