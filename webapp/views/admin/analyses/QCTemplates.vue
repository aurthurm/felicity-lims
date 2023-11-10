<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IQCTemplate, IQCLevel } from '../../../models/analysis';
  import { ADD_QC_TEMPLATE, EDIT_QC_TEMPLATE  } from '../../../graphql/operations/analyses.mutations';
  import { useAnalysisStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
  const modal = defineAsyncComponent(
    () => import('../../../components/SimpleModal.vue')
  )

  const analysisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({}) as IQCTemplate;
  const formAction = ref(true);

  analysisStore.fetchQCLevels();
  analysisStore.fetchQCTemplates();

  const qcTemplates = computed(() => analysisStore.getQCTemplates)
  const qcLevels = computed(() => analysisStore.getQCLevels)

  function addQCTemplate(): void {
    const payload = { name: form.name, description: form.description, levels: levelsUids(form.qcLevels!), departments: form.departments }
    withClientMutation(ADD_QC_TEMPLATE, { payload}, "createQcTemplate")
    .then((result) => analysisStore.addQcTemplate(result));
  }

  function editQCTemplate(): void {
    const payload = { name: form.name, description: form.description, levels: levelsUids(form.qcLevels!), departments: form.departments }
    withClientMutation(EDIT_QC_TEMPLATE,{ uid: form.uid, payload }, "updateQcTemplate")
    .then((result) => analysisStore.updateQcTemplate(result));
  }

  function levelsUids(levels: IQCLevel[]): string[] {
    if (levels?.length <= 0 ) return [];
    let qcLevels: string[] = [];
    levels?.forEach(level => qcLevels.push(level.uid!));
    return qcLevels;
  }

  function FormManager(create: boolean, obj = {} as IQCTemplate): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Template";
    if (create) {
      Object.assign(form, { ...({} as IQCTemplate) });
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function levelsNames(levels: IQCLevel[]): string {
    if (levels?.length <= 0 ) return '';
    let qcLevels: string[] = [];
    levels?.forEach(level => qcLevels.push(level.level!));
    return qcLevels.join(", ");
  }

  function saveForm(): void {
    if (formAction.value === true) addQCTemplate();
    if (formAction.value === false) editQCTemplate();
    showModal.value = false;
  }

</script>

<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add QC Template</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">QC Template Name</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Quality Control level(s)</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Department(s)</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="templt in qcTemplates"  :key="templt?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-gray-800">{{ templt?.name }}</div>
                        </div>
                    </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-gray-800">{{ levelsNames(templt?.qcLevels ?? []) }}</div>
                        </div>
                    </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-sky-800">{{ templt?.category }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, templt)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
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
            <span class="text-gray-700">QC Template Name</span>
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
          <label class="block col-span-2 mb-2">
              <span class="text-gray-700">Quality Control Sample Levels</span>
              <select 
              name="controlLevels" 
              id="controlLevels" 
              v-model="form.qcLevels"
              class="form-input mt-1 block w-full" multiple>
                <option value=""></option>
                <option  
                v-for="level in qcLevels"
                :key="level.uid"
                :value="level" >{{ level.level }}</option>
            </select>
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

