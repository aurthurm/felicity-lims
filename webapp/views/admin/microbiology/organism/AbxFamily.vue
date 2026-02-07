<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {defineAsyncComponent, onMounted, ref} from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import { AbxFamilyType, AbxOrderType } from "@/types/gql";
import {
  AddAbxFamilyDocument,
  AddAbxFamilyMutation,
  AddAbxFamilyMutationVariables,
  EditAbxFamilyDocument,
  EditAbxFamilyMutation,
  EditAbxFamilyMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxFamilyAllDocument,
  GetAbxFamilyAllQuery,
  GetAbxFamilyAllQueryVariables,
  GetAbxOrderAllDocument,
  GetAbxOrderAllQuery,
  GetAbxOrderAllQueryVariables
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

const familySchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  order: yup.object().required('Order is required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: familySchema,
  initialValues: {
    name: '',
    order: null,
  },
});
const { value: name } = useField<string>('name');
const { value: order } = useField<AbxOrderType | null>('order');

const abxFamilys = ref<AbxFamilyType[]>([]);
const abxOrders = ref<AbxOrderType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxOrderAllQuery, GetAbxOrderAllQueryVariables>(
      GetAbxOrderAllDocument, {}, "abxOrderAll"
  ).then((result) => {
    if (result) {
      abxOrders.value = result as AbxOrderType[]
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

function FormManager(create: boolean, obj = {} as AbxFamilyType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Family";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
      order: obj.order ?? null,
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    name: formValues.name,
    orderUid: formValues.order?.uid
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxFamilyMutation, AddAbxFamilyMutationVariables>(
        AddAbxFamilyDocument, {payload}, "createAbxFamily"
    ).then((result) => {
      if (result) {
        abxFamilys.value.unshift(result as AbxFamilyType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxFamilyMutation, EditAbxFamilyMutationVariables>(EditAbxFamilyDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxFamily")
        .then((result) => {
          if (result) {
            const idx = abxFamilys.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxFamilys.value = [
                ...abxFamilys.value.map((item, index) => index === idx ? result : item),
              ] as AbxFamilyType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Families">
      <Button @click="FormManager(true)">Add Family</Button>
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="guideline in abxFamilys" :key="guideline?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ guideline?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ guideline?.order?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <button 
                  @click="FormManager(false, guideline)"
                  class="text-primary hover:text-primary/80">
                  Edit
                </button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxFamilys || abxFamilys.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No families found</EmptyTitle>
                    <EmptyDescription>Add a family to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Family Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Family Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="name" 
              placeholder="Name ..." />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Order</span>
            <VueMultiselect
              v-model="order"
              :options="abxOrders"
              :multiple="false"
              :searchable="true"
              label="name"
              class="mt-1 multiselect-blue"
            />
            <p v-if="errors.order" class="text-sm text-destructive">{{ errors.order }}</p>
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Family
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
