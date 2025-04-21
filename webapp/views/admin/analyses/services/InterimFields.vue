<script setup lang="ts">
  import { computed, ref, reactive, toRefs, watch, defineAsyncComponent } from 'vue';
  import { AddAnalysisInterimDocument, AddAnalysisInterimMutation, AddAnalysisInterimMutationVariables,
    EditAnalysisInterimDocument, EditAnalysisInterimMutation, EditAnalysisInterimMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisInterimType, InstrumentType } from '@/types/gql';
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
  let form = reactive({}) as AnalysisInterimType;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
  })

  setupStore.fetchInstruments();
  const instruments = computed<InstrumentType[]>(() => setupStore.getInstruments)

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

  function FormManager(create: boolean, obj = {} as AnalysisInterimType):void {
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
    <fel-heading title="Interim Fields">
      <fel-button @click="FormManager(true)">Add Interim Field</fel-button>
    </fel-heading>

    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Interim Key</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Result Value</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Instrument</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="interim in analysis?.interims" :key="interim?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ interim?.key }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ interim?.value }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ instrumentName(interim?.instrumentUid) }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <button 
                      @click="FormManager(false, interim)" 
                      class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
                    >
                      Edit
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Result Options Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Instrument</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.instrumentUid"
              >
                <option value="">Select Instrument</option>
                <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid">
                  {{ instrument?.name }}
                </option>
              </select>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Interim</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.key"
                placeholder="Interim Key ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Result</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.value"
                placeholder="Result Value ..."
              />
            </label>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="button"
            @click.prevent="saveForm()"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Form
          </button>
        </div>
      </form>
    </template>
  </modal>

</template>
