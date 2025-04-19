<script setup lang="ts">
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { IReflexRule } from "@/models/reflex";
import useApiUtil  from "@/composables/api_util";
import { useReflexStore } from "@/stores/reflex";
import { AddReflexRuleDocument, AddReflexRuleMutation, AddReflexRuleMutationVariables, EditReflexRuleDocument, EditReflexRuleMutation, EditReflexRuleMutationVariables } from "@/graphql/operations/reflex.mutations";
const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)

const { withClientMutation } = useApiUtil();
const reflexStore = useReflexStore();

let showModal = ref<boolean>(false);
let formTitle = ref<string>("");
let form = reactive({}) as IReflexRule;
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

function FormManager(create: boolean, obj = {} as IReflexRule): void {
  formAction.value = create;
  showModal.value = true;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + "REFLEX RULE";
  if (create) {
    Object.assign(form, {} as IReflexRule);
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
  <h4>Reflex Rules</h4>

  <div class="container w-full my-4">
    <hr />
    <button
      @click="FormManager(true)"
      class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
    >
      Add Reflex Rule
    </button>
    <hr />

    <div class="overflow-x-auto mt-4">
      <div
        class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg"
      >
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Title
              </th>
              <th
                class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Description
              </th>
              <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr v-for="rule in reflexStore.reflexRules" :key="rule?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <router-link
                  :to="{ name: 'reflex-detail', params: { uid: rule?.uid } }"
                  class="text-sm leading-5 text-gray-800"
                  >{{ rule?.name }}</router-link
                >
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-primary">{{ rule?.description }}</div>
              </td>
              <td
                class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5"
              >
                <button
                  @click="FormManager(false, rule)"
                  class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Refecx Rule Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
              cols="2"
              class="form-input mt-1 block w-full"
              v-model="form.description"
              placeholder="Description ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>
