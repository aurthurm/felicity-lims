<script setup lang="ts">
  import { ref, computed, reactive, toRefs, watch, defineAsyncComponent } from 'vue';
  import { AddResultOptionDocument, AddResultOptionMutation, AddResultOptionMutationVariables,
    EditResultOptionDocument, EditResultOptionMutation, EditResultOptionMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { IResultOption } from '@/models/analysis';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSampleStore } from '@/stores/sample';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )
  const VueMultiselect = defineAsyncComponent(
    () => import('vue-multiselect')
  )

  const analysisStore = useAnalysisStore()
  const sampleStore = useSampleStore()
  const { withClientMutation } = useApiUtil()

  const sampleTypes = computed<any[]>(() => sampleStore.getSampleTypes);

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
  let form = reactive({}) as IResultOption;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  function addResultOption(): void {
      form.optionKey = +form.optionKey!;
      const payload = { ...form, 
        analysisUid: analysis?.value?.uid,
        sampleTypes: form.sampleTypes?.map(item => item.uid),
      }
      withClientMutation<AddResultOptionMutation, AddResultOptionMutationVariables>(AddResultOptionDocument, { payload }, "createResultOption")
      .then((result) => analysisStore.addResultOption(result));
  }

  function editResultOption(): void {
      const payload = { ...form, analysisUid: analysis?.value?.uid, sampleTypes: form.sampleTypes?.map(item => item.uid) };
      delete payload['__typename']
      delete payload['uid']
      withClientMutation<EditResultOptionMutation, EditResultOptionMutationVariables>(EditResultOptionDocument, { uid : form.uid,  payload }, "updateResultOption")
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
    <fel-heading title="Result Options">
      <fel-button @click="FormManager(true)">Add Result Option</fel-button>
    </fel-heading>

    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Result Key</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Result Value</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Sample Types</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="option in analysis?.resultOptions" :key="option?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ option?.optionKey }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ option?.value }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="stype of option?.sampleTypes" 
                      :key="stype.uid"
                      class="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-md"
                    >
                      {{ stype.name }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <button 
                      @click="FormManager(false, option)" 
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
              <span class="text-sm font-medium text-muted-foreground">Result Key</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.optionKey"
                placeholder="Key ..."
              />
            </label>
            <label class="col-span-2 space-y-2">
              <span class="text-sm font-medium text-muted-foreground">Result Value</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.value"
                placeholder="Value ..."
              />
            </label>
          </div>

          <div class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Sample Types</span>
            <VueMultiselect
              v-model="form.sampleTypes"
              :options="sampleTypes"
              :multiple="true"
              :searchable="true"
              label="name"
              track-by="uid"
              class="multiselect-primary"
            >
            </VueMultiselect>
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

<style>

</style>