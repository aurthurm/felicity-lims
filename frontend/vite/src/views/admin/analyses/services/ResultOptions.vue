<script setup lang="ts">
  import modal from '../../../../components/SimpleModal.vue';
  import { ref, reactive, toRefs, watch } from 'vue';
  import { ADD_RESULT_OPTION, EDIT_RESULT_OPTION  } from '../../../../graphql/analyses.mutations';
  import { IResultOption } from '../../../../models/analysis';
  import { useAnalysisStore } from '../../../../stores';
  import { useApiUtil } from '../../../../composables';

  const analysisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()

  const props = defineProps({
      analysis: {
          type: Object,
          required: true,
          default: () => ({}),
      },
      analysisUid: {
          type: Number,
          required: true,
          default: 0,
      },
  })

  const { analysis } = toRefs(props);
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({}) as IResultOption;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  function addResultOption(): void {
      form.optionKey = +form.optionKey!;
      const payload = { ...form, analysisUid: analysis?.value?.uid }
      withClientMutation(ADD_RESULT_OPTION, { payload }, "createResultOption")
      .then((result) => analysisStore.addResultOption(result));
  }

  function editResultOption(): void {
      const payload = { ...form };
      delete payload['__typename']
      delete payload['uid']

      withClientMutation(EDIT_RESULT_OPTION, { uid : form.uid,  payload }, "updateResultOption")
      .then((result) => analysisStore.updateResultOption(result));
  }

  function FormManager(create: boolean, obj = {} as IResultOption):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "RESULT OPTION";
      if (create) {
          Object.assign(form, { optionKey: null, value: null });
      } else {
          Object.assign(form, { ...obj });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addResultOption();
      if (formAction.value === false) editResultOption();
      showModal.value = false;
  }

</script>

<template>
     <button
        class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >Add Result Option</button>
    <hr>
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Result Key</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Result Value</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="option in analysis?.resultOptions"  :key="option?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">{{ option?.optionKey }}</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ option?.value }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button @click="FormManager(false, option)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Result Options Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body >
      <form action="post" class="p-1">
        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Result Key</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.optionKey"
              placeholder="Key ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Result Value</span>
            <input
             type="text"
              class="form-input mt-1 block w-full"
              v-model="form.value"
              placeholder="Value ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>

