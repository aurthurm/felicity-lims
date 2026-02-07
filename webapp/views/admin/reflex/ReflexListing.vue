<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ref, onMounted } from "vue";
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { ReflexRuleType } from "@/types/reflex";
import useApiUtil  from "@/composables/api_util";
import { useReflexStore } from "@/stores/reflex";
import { AddReflexRuleDocument, AddReflexRuleMutation, AddReflexRuleMutationVariables, EditReflexRuleDocument, EditReflexRuleMutation, EditReflexRuleMutationVariables } from "@/graphql/operations/reflex.mutations";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
const { withClientMutation } = useApiUtil();
const reflexStore = useReflexStore();

let showModal = ref<boolean>(false);
let formTitle = ref<string>("");
const formAction = ref<boolean>(true);
const currentUid = ref<string | null>(null);

const reflexRuleSchema = yup.object({
  name: yup.string().trim().required('Name is required'),
});

const { handleSubmit, resetForm, setValues, errors } = useForm({
  validationSchema: reflexRuleSchema,
  initialValues: {
    name: '',
    description: '',
  },
});
const { value: name } = useField<string>('name');
const { value: description } = useField<string>('description');

onMounted(async () => {
  reflexStore.fetchAllReflexRules();
});

function FormManager(create: boolean, obj = {} as ReflexRuleType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "REFLEX RULE";
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
  const payload = { name: formValues.name, description: formValues.description };
  if (formAction.value === true) {
    withClientMutation<AddReflexRuleMutation, AddReflexRuleMutationVariables>(
      AddReflexRuleDocument,
      { payload },
      "createReflexRule"
    ).then((result) => {
      reflexStore.addReflexRule(result);
    });
  }
  if (formAction.value === false && currentUid.value) {
    withClientMutation<EditReflexRuleMutation, EditReflexRuleMutationVariables>(
      EditReflexRuleDocument,
      { uid: currentUid.value, payload },
      "updateReflexRule"
    ).then((result) => reflexStore.updateReflexRule(result));
  }
  showModal.value = false;
});
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Reflex Rules">
      <Button @click="FormManager(true)">Add Reflex Rule</Button>
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="rule in reflexStore.reflexRules" :key="rule?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">
                <router-link
                  :to="{ name: 'reflex-detail', params: { uid: rule?.uid } }"
                  class="text-primary hover:text-primary/80"
                >
                  {{ rule?.name }}
                </router-link>
              </TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ rule?.description }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right text-sm">
                <Button variant="outline" size="sm" @click="FormManager(false, rule)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!reflexStore.reflexRules || reflexStore.reflexRules.length === 0" :colspan="3">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No reflex rules yet</EmptyTitle>
                    <EmptyDescription>Create a rule to automate reflex testing.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Reflex Rule Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Name</span>
            <input
              v-model="name"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Name ..."
            />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Description</span>
            <textarea
              v-model="description"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Description ..."
              rows="3"
            />
          </label>
        </div>

        <hr class="border-border"/>

        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground rounded-md px-4 py-2 transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Save Reflex Rule
        </button>
      </form>
    </template>
  </Modal>
</template>
