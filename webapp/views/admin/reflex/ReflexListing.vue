<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ReflexRuleType } from "@/types/reflex";
import useApiUtil  from "@/composables/api_util";
import { useReflexStore } from "@/stores/reflex";
import { AddReflexRuleDocument, AddReflexRuleMutation, AddReflexRuleMutationVariables, EditReflexRuleDocument, EditReflexRuleMutation, EditReflexRuleMutationVariables } from "@/graphql/operations/reflex.mutations";

const { withClientMutation } = useApiUtil();
const reflexStore = useReflexStore();

let showModal = ref<boolean>(false);
let formTitle = ref<string>("");
let form = reactive({}) as ReflexRuleType;
const formAction = ref<boolean>(true);

onMounted(async () => {
  reflexStore.fetchAllReflexRules();
});

function addReflexRule(): void {
  const payload = { name: form.name, description: form.description };
  withClientMutation<AddReflexRuleMutation, AddReflexRuleMutationVariables>(AddReflexRuleDocument, { payload }, "createReflexRule").then((payload) =>
    reflexStore.addReflexRule(payload)
  );
}

function editReflexRule(): void {
  const payload = { name: form.name, description: form.description };
  withClientMutation<EditReflexRuleMutation, EditReflexRuleMutationVariables>(EditReflexRuleDocument, { uid: form.uid, payload }, "updateReflexRule").then((payload) => reflexStore.updateReflexRule(payload));
}

function FormManager(create: boolean, obj = {} as ReflexRuleType): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "REFLEX RULE";
  if (create) {
    Object.assign(form, {} as ReflexRuleType);
  } else {
    Object.assign(form, { ...obj });
  }
}

function saveForm(): void {
  if (formAction.value === true) addReflexRule();
  if (formAction.value === false) editReflexRule();
  showModal.value = false;
}
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Reflex Rules">
      <fel-button @click="FormManager(true)">Add Reflex Rule</fel-button>
    </fel-heading>

    <div class="rounded-md border border-border bg-card p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold text-foreground">Title</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-foreground">Description</th>
              <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background">
            <tr v-for="rule in reflexStore.reflexRules" :key="rule?.uid" class="hover:bg-muted/50">
              <td class="whitespace-nowrap px-4 py-2 text-sm text-foreground">
                <router-link
                  :to="{ name: 'reflex-detail', params: { uid: rule?.uid } }"
                  class="text-primary hover:text-primary/80"
                >
                  {{ rule?.name }}
                </router-link>
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-sm text-foreground">{{ rule?.description }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  @click="FormManager(false, rule)"
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

  <!-- Reflex Rule Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false" :content-width="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-1 gap-4">
          <label class="block">
            <span class="text-sm font-medium text-foreground">Name</span>
            <input 
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.name" 
              placeholder="Name ..." />
          </label>
          <label class="block">
            <span class="text-sm font-medium text-foreground">Description</span>
            <textarea
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              v-model="form.description"
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
  </fel-modal>
</template>
