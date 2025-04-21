<script setup lang="ts">
  import { computed, ref, reactive, toRefs, watch, defineAsyncComponent } from 'vue';
  import { AddAnalysisSpecificationDocument, AddAnalysisSpecificationMutation, AddAnalysisSpecificationMutationVariables,
    EditAnalysisSpecificationDocument, EditAnalysisSpecificationMutation, EditAnalysisSpecificationMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { AnalysisSpecificationType, MethodType } from '@/types/gql';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
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
  let form = reactive({}) as AnalysisSpecificationType;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  setupStore.fetchMethods();
  const methods = computed<MethodType[]>(() => setupStore.getMethods)

  function addAnalysisSpecification(): void {
      const payload = { ...form, analysisUid: analysis?.value?.uid }
      withClientMutation<AddAnalysisSpecificationMutation, AddAnalysisSpecificationMutationVariables>(AddAnalysisSpecificationDocument, { payload }, "createAnalysisSpecification")
      .then((result) => analysisStore.addAnalysisSpecification(result));
  }

  function editAnalysisSpecification(): void {
      const payload: any = { ...form };
      delete payload['uid']
      delete payload['__typename']
      delete payload['unit']

      withClientMutation<EditAnalysisSpecificationMutation, EditAnalysisSpecificationMutationVariables>(EditAnalysisSpecificationDocument, { uid : form.uid,  payload }, "updateAnalysisSpecification")
      .then((result) => analysisStore.updateAnalysisSpecification(result));
  }

  function FormManager(create: boolean, obj = {} as AnalysisSpecificationType):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSIS SPECIFICATION";
      if (create) {
          Object.assign(form, {
            analysisUid: null,
            min: null,
            max: null,
            minWarn: null,
            maxWarn: null,
            minReport: null,
            maxReport: null,
            warnValues: null,
            warnReport: null,
            gender: null,
            ageMin: null,
            ageMax: null,
            methodUid: null,
          });
      } else {
          Object.assign(form, { ...obj });
      }
  }

  function saveForm():void {
      if (formAction.value === true) addAnalysisSpecification();
      if (formAction.value === false) editAnalysisSpecification();
      showModal.value = false;
  }

  const methodName = (uid: string | undefined): string => {
    if (!uid || !methods.value) return '';
    const index = methods.value.findIndex(item => item.uid === uid);
    return methods.value[index]?.name || '';
  }

</script>

<template>
    <fel-heading title="Specifications">
      <fel-button @click="FormManager(true)">Add Specification</fel-button>
    </fel-heading>
    
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-destructive">Min Report</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-warning">Min Warn</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Min</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Max</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-warning">Max Warn</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-destructive">Max Report</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Warn Texts</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Text Report</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Method</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Gender</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Age Min</th>
                <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-foreground">Age Max</th>
                <th class="px-4 py-2 border-b border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-card">
            <tr v-for="specification in analysis?.specifications" :key="specification?.uid" class="hover:bg-accent/50">
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-destructive">{{ specification.minReport }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-warning">{{ specification.minWarn }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.min }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.max }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-warning">{{ specification.maxWarn }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-destructive">{{ specification.maxReport }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.warnValues }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.warnReport }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ methodName(specification?.methodUid) || '' }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.gender }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.ageMin }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                  <div class="text-sm text-foreground">{{ specification.ageMax }}</div>
                </td>
                <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                    <button @click="FormManager(false, specification)" class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Detection Limit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/4'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">
        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Numerical Results</h4>
          <hr class="border-border">
          <div class="grid grid-cols-6 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-destructive">Min Report</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.minReport"
                placeholder="Value ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-warning">Min Warn</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.minWarn"
                placeholder="Value ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Min</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.min"
                placeholder="Value ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Max</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.max"
                placeholder="Value ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-warning">Max Warn</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.maxWarn"
                placeholder="Value ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-destructive">Max Report</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.maxReport"
                placeholder="Value ..."
              />
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Textual Results</h4>
          <hr class="border-border">
          <div class="grid grid-cols-2 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Textual Results (comma separated)</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.warnValues"
                placeholder="Value ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Report Message</span>
              <input
                type="text"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.warnReport"
                placeholder="Value ..."
              />
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-lg font-semibold text-foreground">Conditions if Any</h4>
          <hr class="border-border">
          <div class="grid grid-cols-4 gap-4">
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Method</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.methodUid"
              >
                <option value="">Select Method</option>
                <option v-for="method in methods" :key="method?.uid" :value="method.uid">
                  {{ method?.name }}
                </option>
              </select>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Gender</span>
              <select 
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.gender"
              >
                <option value="all">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Age Min</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.ageMin"
                placeholder="Value ..."
              />
            </label>
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">Age Max</span>
              <input
                type="number"
                class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                v-model="form.ageMax"
                placeholder="Value ..."
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
