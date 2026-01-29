<script setup lang="ts">
import {defineAsyncComponent, onMounted, ref} from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import { AbxClassType, AbxOrderType } from "@/types/gql";
import {
  AddAbxOrderDocument,
  AddAbxOrderMutation,
  AddAbxOrderMutationVariables,
  EditAbxOrderDocument,
  EditAbxOrderMutation,
  EditAbxOrderMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxClassAllDocument,
  GetAbxClassAllQuery,
  GetAbxClassAllQueryVariables,
  GetAbxOrderAllDocument,
  GetAbxOrderAllQuery,
  GetAbxOrderAllQueryVariables
} from "@/graphql/operations/microbiology.queries";

const VueMultiselect = defineAsyncComponent(
  () => import('vue-multiselect')
)
const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const orderSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
  class_: yup.object().required('Class is required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: orderSchema,
  initialValues: {
    name: '',
    class_: null,
  },
});
const { value: name } = useField<string>('name');
const { value: classField } = useField<AbxClassType | null>('class_');

const abxClasses = ref<AbxClassType[]>([]);
const abxOrders = ref<AbxOrderType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxOrderAllQuery, GetAbxOrderAllQueryVariables>(
      GetAbxOrderAllDocument, {}, "abxOrderAll"
  ).then((result) => {
    if (result) {
      abxOrders.value = result as AbxOrderType[]
    }
  })
  withClientQuery<GetAbxClassAllQuery, GetAbxClassAllQueryVariables>(
      GetAbxClassAllDocument, {}, "abxClassAll"
  ).then((result) => {
    if (result) {
      abxClasses.value = result as AbxClassType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxOrderType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "Order";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
      class_: obj.class_ ?? null,
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    name: formValues.name,
    classUid: formValues.class_?.uid
  }

  if (formAction.value === true) {
    withClientMutation<AddAbxOrderMutation, AddAbxOrderMutationVariables>(
        AddAbxOrderDocument, {payload}, "createAbxOrder"
    ).then((result) => {
      if (result) {
        abxOrders.value.unshift(result as AbxOrderType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxOrderMutation, EditAbxOrderMutationVariables>(EditAbxOrderDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxOrder")
        .then((result) => {
          if (result) {
            const idx = abxOrders.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxOrders.value = [
                ...abxOrders.value.map((item, index) => index === idx ? result : item),
              ] as AbxOrderType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Orders">
      <fel-button @click="FormManager(true)">Add Order</fel-button>
    </fel-heading>

    <div class="rounded-lg border border-border shadow-sm bg-card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border fel-table">
          <thead>
            <tr>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Class</th>
              <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background">
            <tr v-for="guideline in abxOrders" :key="guideline?.uid" class="hover:bg-muted/50">
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.name }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ guideline?.class_?.name }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  @click="FormManager(false, guideline)"
                  class="text-primary hover:text-primary/80">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Order Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Order Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="name" 
              placeholder="Name ..." />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Class</span>
            <VueMultiselect
              v-model="classField"
              :options="abxClasses"
              :multiple="false"
              :searchable="true"
              label="name"
              class="mt-1 multiselect-blue"
            />
            <p v-if="errors.class_" class="text-sm text-destructive">{{ errors.class_ }}</p>
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Order
        </button>
      </form>
    </template>
  </fel-modal>
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
