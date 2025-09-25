<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { CodingStandardType } from '@/types/gql'
  import { AddCodingStandardDocument, AddCodingStandardMutation, AddCodingStandardMutationVariables,
    EditCodingStandardDocument, EditCodingStandardMutation, EditCodingStandardMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)

  const analyisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  let form = reactive({}) as CodingStandardType;
  const formAction = ref<boolean>(true);

  analyisStore.fetchCodingStandards();
  const codindStandards = computed(() => analyisStore.getCodingStandards)

  function FormManager(create: boolean, obj = {} as CodingStandardType):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "CODING STANDARD";
    if (create) {
      Object.assign(form, {} as CodingStandardType);
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    const payload = { name: form.name, description: form.description}

    if (formAction.value === true) {
      withClientMutation<AddCodingStandardMutation, AddCodingStandardMutationVariables>(AddCodingStandardDocument, { payload }, "createCodingStandard")
      .then((result) => analyisStore.addCodingStandard(result));
    };

    if (formAction.value === false) {
      withClientMutation<EditCodingStandardMutation, EditCodingStandardMutationVariables>(EditCodingStandardDocument, { uid: form.uid, payload }, "updateCodingStandard")
      .then((result) => analyisStore.updateCodingStandard(result));
    };

    showModal.value = false;
  }

</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Coding Standards">
      <fel-button @click="FormManager(true)">Add Coding Standard</fel-button>
    </fel-heading>

    <div class="rounded-lg border border-border bg-card p-6">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="px-4 py-3 text-left text-sm font-medium text-foreground">Standard</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-foreground">Description</th>
              <th class="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="standard in codindStandards" :key="standard?.uid" class="hover:bg-accent/50">
              <td class="px-4 py-3">
                <div class="text-sm text-foreground">{{ standard?.name }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-muted-foreground">{{ standard?.description }}</div>
              </td>
              <td class="px-4 py-3 text-right">
                <button 
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  @click="FormManager(false, standard)">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal -->
    <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/6'">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

      <template v-slot:body>
        <form class="space-y-6">
          <div class="space-y-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Standard Name</span>
              <input
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                v-model="form.name"
                placeholder="Name ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Description</span>
              <textarea
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                v-model="form.description"
                placeholder="Description ..."
              />
            </label>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              @click.prevent="saveForm()"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              Save Form
            </button>
          </div>
        </form>
      </template>
    </fel-modal>
  </div>
</template>

