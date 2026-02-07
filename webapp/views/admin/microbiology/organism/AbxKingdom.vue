<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { onMounted, ref} from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

import useApiUtil from '@/composables/api_util';
import { AbxKingdomType } from "@/types/gql";
import {
  AddAbxKingdomDocument,
  AddAbxKingdomMutation,
  AddAbxKingdomMutationVariables,
  EditAbxKingdomDocument,
  EditAbxKingdomMutation,
  EditAbxKingdomMutationVariables
} from "@/graphql/operations/microbiology.mutations";
import {
  GetAbxKingdomAllDocument,
  GetAbxKingdomAllQuery,
  GetAbxKingdomAllQueryVariables
} from "@/graphql/operations/microbiology.queries";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
const {withClientMutation, withClientQuery} = useApiUtil()

let showModal = ref<boolean>(false);
let formTitle = ref<string>('');
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const kingdomSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: kingdomSchema,
  initialValues: {
    name: '',
  },
});
const { value: name } = useField<string>('name');

const abxKingdoms = ref<AbxKingdomType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxKingdomAllQuery, GetAbxKingdomAllQueryVariables>(
      GetAbxKingdomAllDocument, {}, "abxKingdomAll"
  ).then((result) => {
    if (result) {
      abxKingdoms.value = result as AbxKingdomType[]
    }
  })
})

function FormManager(create: boolean, obj = {} as AbxKingdomType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? 'Create' : 'Edit') + ' ' + "kingdom";
  if (create) {
    currentUid.value = null;
    resetForm();
  } else {
    currentUid.value = obj.uid ?? null;
    setValues({
      name: obj.name ?? '',
    });
  }
}

const saveForm = handleSubmit((formValues) => {
  const payload = {
    name: formValues.name,
  };

  if (formAction.value === true) {
    withClientMutation<AddAbxKingdomMutation, AddAbxKingdomMutationVariables>(
        AddAbxKingdomDocument, {payload}, "createAbxKingdom"
    ).then((result) => {
      if (result) {
        abxKingdoms.value.unshift(result as AbxKingdomType);
      }
    });
  }

  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditAbxKingdomMutation, EditAbxKingdomMutationVariables>(EditAbxKingdomDocument, {
      uid: currentUid.value,
      payload
    }, "updateAbxKingdom")
        .then((result) => {
          if (result) {
            const idx = abxKingdoms.value.findIndex(item => item.uid == result.uid);
            if (idx > -1) {
              abxKingdoms.value = [
                ...abxKingdoms.value.map((item, index) => index === idx ? result : item),
              ] as AbxKingdomType[];
            }
          }
        });
  }

  showModal.value = false;
});

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Kingdoms">
      <Button @click="FormManager(true)">Add Kingdom</Button>
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="guideline in abxKingdoms" :key="guideline?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ guideline?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <button 
                  @click="FormManager(false, guideline)"
                  class="text-primary hover:text-primary/80">
                  Edit
                </button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxKingdoms || abxKingdoms.length === 0" :colspan="2">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No kingdoms found</EmptyTitle>
                    <EmptyDescription>Add a kingdom to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Kingdom Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-2 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Kingdom Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="name" 
              placeholder="Name ..." />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </label>
        </div>

        <hr class="border-border"/>
        
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Kingdom
        </button>
      </form>
    </template>
  </Modal>
</template>


<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: hsl(var(--success));
}

.toggle-checkbox:checked + .toggle-label {
  background-color: hsl(var(--success));
}
</style>
