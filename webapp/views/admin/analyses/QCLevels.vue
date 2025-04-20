<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IQCLevel } from '@/models/analysis';
  import { AddQcLevelDocument, AddQcLevelMutation, AddQcLevelMutationVariables,
    EditQcLevelDocument, EditQcLevelMutation, EditQcLevelMutationVariables } from '@/graphql/operations/analyses.mutations';

  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const analysisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({}) as IQCLevel;
  const formAction = ref(true);

  analysisStore.fetchQCLevels();
  const qcLevels = computed(() => analysisStore.getQCLevels)

  function addQCLevel(): void {
    withClientMutation<AddQcLevelMutation, AddQcLevelMutationVariables>(AddQcLevelDocument, { level: form.level }, "createQcLevel")
    .then((result) => analysisStore.addQcLevel(result));
  }

  function editQCLevel(): void {
    withClientMutation<EditQcLevelMutation, EditQcLevelMutationVariables>(EditQcLevelDocument, { uid: form.uid, level: form.level },"updateQcLevel")
    .then((result) => analysisStore.updateQcLevel(result));
  }

  function FormManager(create: boolean, obj: IQCLevel = {}):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Level";
    if (create) {
      Object.assign(form, { ...({} as IQCLevel) });
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    if (formAction.value === true) addQCLevel();
    if (formAction.value === false) editQCLevel();
    showModal.value = false;
  }
</script>

<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add QC Level</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Level</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="level in qcLevels"  :key="level?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="flex items-center">
                          <div>
                          <div class="text-sm leading-5 text-gray-800">{{ level?.level }}</div>
                          </div>
                      </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, level)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>

      <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">QC Level</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.level"
              placeholder="Level/Name ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>


<style scoped>
  /* CHECKBOX TOGGLE SWITCH */
  /* @apply rules for documentation, these do not work as inline style */
  .toggle-checkbox:checked {
    @apply: right-0 border-sky-800;
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply: bg-sky-800;
    background-color: #68D391;
  }
</style>
