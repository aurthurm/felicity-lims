<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {defineAsyncComponent, onMounted, ref} from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import { AbxFamilyType, AbxGenusType } from "@/types/gql";
import {
  AddAbxGenusDocument,
  AddAbxGenusMutation,
  AddAbxGenusMutationVariables,
  EditAbxGenusDocument,
  EditAbxGenusMutation,
  EditAbxGenusMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxFamilyAllDocument,
  GetAbxFamilyAllQuery,
  GetAbxFamilyAllQueryVariables,
  GetAbxGenusAllDocument,
  GetAbxGenusAllQuery,
  GetAbxGenusAllQueryVariables
} from "@/graphql/operations/microbiology.queries";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)
const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const genusSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  family: yup.object().required('Family is required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: genusSchema,
  initialValues: {
    name: '',
    family: null,
  },
});
const { value: name } = useField<string>('name');
const { value: family } = useField<AbxFamilyType | null>('family');

const abxGenuss = ref<AbxGenusType[]>([]);
const abxFamilys = ref<AbxFamilyType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxGenusAllQuery, GetAbxGenusAllQueryVariables>(
      GetAbxGenusAllDocument, {}, "abxGenusAll"
  ).then((result) => {
    if (result) {
      abxGenuss.value = result as AbxGenusType[]
    }
  })
  withClientQuery<GetAbxFamilyAllQuery, GetAbxFamilyAllQueryVariables>(
      GetAbxFamilyAllDocument, {}, "abxFamilyAll"
  ).then((result) => {
    if (result) {
      abxFamilys.value = result as AbxFamilyType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxGenusType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Genus";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
      family: obj.family ?? null,
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    name: formValues.name,
    familyUid: formValues.family?.uid
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxGenusMutation, AddAbxGenusMutationVariables>(
        AddAbxGenusDocument, {payload}, "createAbxGenus"
    ).then((result) => {
      if (result) {
        abxGenuss.value.unshift(result as AbxGenusType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxGenusMutation, EditAbxGenusMutationVariables>(EditAbxGenusDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxGenus")
        .then((result) => {
          if (result) {
            const idx = abxGenuss.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxGenuss.value = [
                ...abxGenuss.value.map((item, index) => index === idx ? result : item),
              ] as AbxGenusType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Genera">
      <Button @click="FormManager(true)">Add Genus</Button>
    </PageHeading>

    <div class="rounded-md border border-border shadow-sm bg-card p-6">
      <div class="overflow-x-auto">
        <Table class="min-w-full divide-y divide-border">
          <TableHeader>
            <TableRow>
              <TableHead class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</TableHead>
              <TableHead class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Family</TableHead>
              <TableHead class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="divide-y divide-border bg-background">
            <TableRow v-for="guideline in abxGenuss" :key="guideline?.uid" class="hover:bg-muted/50">
              <TableCell class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.name }}</TableCell>
              <TableCell class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.family?.name }}</TableCell>
              <TableCell class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  @click="FormManager(false, guideline)"
                  class="text-primary hover:text-primary/80">
                  Edit
                </button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxGenuss || abxGenuss.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No genera found</EmptyTitle>
                    <EmptyDescription>Add a genus to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Genus Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Genus Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="name" 
              placeholder="Name ..." />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Family</span>
            <VueMultiselect
              v-model="family"
              :options="abxFamilys"
              :multiple="false"
              :searchable="true"
              label="name"
              class="mt-1 multiselect-blue"
            />
            <p v-if="errors.family" class="text-sm text-destructive">{{ errors.family }}</p>
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Genus
        </button>
      </form>
    </template>
  </Modal>
</template>

<style scoped>
@reference "@/assets/css/style.css";
.multiselect-blue {
  @apply rounded-md border-border shadow-sm focus:border-primary focus:ring focus:ring-primary/50;
}

.multiselect-blue :deep(.multiselect__tags) {
  @apply border-border rounded-md;
}

.multiselect-blue :deep(.multiselect__single) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__input) {
  @apply text-foreground;
}

.multiselect-blue :deep(.multiselect__option) {
  @apply text-foreground hover:bg-primary/10;
}

.multiselect-blue :deep(.multiselect__option--highlight) {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue :deep(.multiselect__option--selected) {
  @apply bg-primary/20 text-foreground;
}

.toggle-checkbox:checked {
  right: 0;
  border-color: hsl(var(--success));
}

.toggle-checkbox:checked + .toggle-label {
  background-color: hsl(var(--success));
}
</style>
