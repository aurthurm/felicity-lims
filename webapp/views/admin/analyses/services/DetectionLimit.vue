<script setup lang="ts">
  import { computed, ref, reactive, toRefs, watch, defineAsyncComponent } from 'vue';
  import { AddAnalysisDetectionLimitDocument, AddAnalysisDetectionLimitMutation, AddAnalysisDetectionLimitMutationVariables,
    EditAnalysisDetectionLimitDocument, EditAnalysisDetectionLimitMutation, EditAnalysisDetectionLimitMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { IAnalysisDetectionLimit } from '@/models/analysis';
  import { IInstrument, IMethod } from '@/models/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const analysisStore = useAnalysisStore()
  const  setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()

  const props = defineProps({
      analysis: {
          type: Object,
          required: true,
          default: () => ({}),
      },
      analysisUid: {
          type: String,
          required: true,
          default: 0,
      },
  })

  const { analysis } = toRefs(props);
  let showModal = ref(false);
  let formTitle = ref('');
  let form = reactive({}) as IAnalysisDetectionLimit;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  setupStore.fetchInstruments();
  const instruments = computed<IInstrument[]>(() => setupStore.getInstruments)

  setupStore.fetchMethods();
  const methods = computed<IMethod[]>(() => setupStore.getMethods)

  function addAnalysisDetectionLimit(): void {
      const payload = { ...form, analysisUid: analysis?.value?.uid }
      withClientMutation<AddAnalysisDetectionLimitMutation, AddAnalysisDetectionLimitMutationVariables>(AddAnalysisDetectionLimitDocument, { payload }, "createAnalysisDetectionLimit")
      .then((result) => analysisStore.addAnalysisDetectionLimit(result));
  }

  function editAnalysisDetectionLimit(): void {
      const payload: any = { ...form };
      delete payload['uid']
      delete payload['__typename']

      withClientMutation<EditAnalysisDetectionLimitMutation, EditAnalysisDetectionLimitMutationVariables>(EditAnalysisDetectionLimitDocument, { uid : form.uid,  payload }, "updateAnalysisDetectionLimit")
      .then((result) => analysisStore.updateAnalysisDetectionLimit(result));
  }

  function FormManager(create: boolean, obj = {} as IAnalysisDetectionLimit):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS DETECTION_LIMIT";
      if (create) {
          Object.assign(form, { lowerLimit: null, upperLimit: null, instrumentUid: null , methodUid: null });
      } else {
          Object.assign(form, { ...obj });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addAnalysisDetectionLimit();
      if (formAction.value === false) editAnalysisDetectionLimit();
      showModal.value = false;
  }

  const instrumentName = (uid: string): string => {
    const index = instruments?.value?.findIndex(item => item.uid === uid)
    return instruments?.value[index]?.name || "unknown";
  }

  const methodName = (uid: string): string => {
    const index = methods?.value?.findIndex(item => item.uid === uid)
    return methods?.value[index]?.name || "unknown";
  }

</script>

<template>
     <button
        class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >Add Detection Limit</button>
    <hr>
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Intrument</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Method</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Lower Limit</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-gray-800 tracking-wider">Upper Limit</th>
                <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="limit in analysis?.detectionLimits"  :key="limit?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-gray-800">{{ instrumentName(limit?.instrumentUid) }}</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-primary">{{ methodName(limit?.instrumentUid) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-primary">{{ limit.lowerLimit  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-primary">{{ limit.upperLimit  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button @click="FormManager(false, limit)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Detection Limit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body >
      <form action="post" class="p-1">
        <div class="grid grid-cols-4 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Instrument</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="form.instrumentUid">
                <option></option>
                <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid"> {{ instrument?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2" >
            <span class="text-gray-700 w-4/12">Method</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="form.methodUid">
                <option></option>
                <option v-for="method in methods" :key="method?.uid" :value="method.uid"> {{ method?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Lower Limit</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.lowerLimit"
              placeholder="Value ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Upper Limit</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.upperLimit"
              placeholder="Value ..."
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

