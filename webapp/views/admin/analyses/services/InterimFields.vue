<script setup lang="ts">
  import { computed, ref, reactive, toRefs, watch, defineAsyncComponent } from 'vue';
  import { AddAnalysisInterimDocument, AddAnalysisInterimMutation, AddAnalysisInterimMutationVariables,
    EditAnalysisInterimDocument, EditAnalysisInterimMutation, EditAnalysisInterimMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { IAnalysisInterim } from '@/models/analysis';
  import { IInstrument } from '@/models/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )

  const analysisStore = useAnalysisStore()
  const setupStore = useSetupStore()
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
  let form = reactive({}) as IAnalysisInterim;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
  })

  setupStore.fetchInstruments();
  const instruments = computed<IInstrument[]>(() => setupStore.getInstruments)

  function addAnalysisInterim(): void {
      form.key = +form.key!;
      const payload = { ...form, analysisUid: analysis?.value?.uid }
      withClientMutation<AddAnalysisInterimMutation, AddAnalysisInterimMutationVariables>(AddAnalysisInterimDocument, { payload }, "createAnalysisInterim")
      .then((result) => analysisStore.addAnalysisInterim(result));
  }

  function editAnalysisInterim(): void {
      const payload: any = { ...form };
      delete payload['uid']
      delete payload['__typename']

      withClientMutation<EditAnalysisInterimMutation, EditAnalysisInterimMutationVariables>(EditAnalysisInterimDocument, { uid : form.uid,  payload }, "updateAnalysisInterim")
      .then((result) => analysisStore.updateAnalysisInterim(result));
  }

  function FormManager(create: boolean, obj = {} as IAnalysisInterim):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS INTERIM";
      if (create) {
          Object.assign(form, { key: null, value: null });
      } else {
          Object.assign(form, { ...obj });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addAnalysisInterim();
      if (formAction.value === false) editAnalysisInterim();
      showModal.value = false;
  }

  const instrumentName = (uid: string): string => {
    const index = instruments?.value?.findIndex(item => item.uid === uid)
    return instruments?.value[index]?.name || "unknown";
  }

</script>

<template>
     <button
        class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
        @click="FormManager(true)"
      >Add Interim Field</button>
    <hr>
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Interim Key</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Result Value</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Intrument</th>
                <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-background">
            <tr v-for="interim in analysis?.interims"  :key="interim?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                <div class="flex items-center">
                    <div>
                    <div class="text-sm leading-5 text-foreground">{{ interim?.key }}</div>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                  <div class="text-sm leading-5 text-primary">{{ interim?.value }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                  <div class="text-sm leading-5 text-primary">{{ instrumentName(interim?.instrumentUid) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                    <button @click="FormManager(false, interim)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
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
          <label class="block col-span-1 mb-2" >
            <span class="text-foreground w-4/12">Instrument</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="form.instrumentUid">
                <option></option>
                <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid"> {{ instrument?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Interim</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.key"
              placeholder="Interim Key ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Result</span>
            <input
             type="text"
              class="form-input mt-1 block w-full"
              v-model="form.value"
              placeholder="Resut Value ..."
            />
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>

