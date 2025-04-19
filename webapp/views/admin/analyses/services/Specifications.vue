<script setup lang="ts">
  import { computed, ref, reactive, toRefs, watch, defineAsyncComponent } from 'vue';
  import { AddAnalysisSpecificationDocument, AddAnalysisSpecificationMutation, AddAnalysisSpecificationMutationVariables,
    EditAnalysisSpecificationDocument, EditAnalysisSpecificationMutation, EditAnalysisSpecificationMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { IAnalysisSpecification } from '@/models/analysis';
  import { IMethod } from '@/models/setup';
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
  let form = reactive({}) as IAnalysisSpecification;
  const formAction = ref(true);

  watch(() => props.analysisUid, (anal, prev) => {
      
  })

  setupStore.fetchMethods();
  const methods = computed<IMethod[]>(() => setupStore.getMethods)

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

  function FormManager(create: boolean, obj = {} as IAnalysisSpecification):void {
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

  const methodName = (uid: string): string => {
    const index = methods?.value?.findIndex(item => item.uid === uid)
    return methods?.value[index]?.name as string;
  }

</script>

<template>
     <button
        class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none"
        @click="FormManager(true)"
      >Add Specification</button>
    <hr class="mt-2">
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-orange-600 tracking-wider">Min Report</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-amber-500 tracking-wider">Min Warn</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-primary tracking-wider">Min</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-primary tracking-wider">Max</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-amber-500 tracking-wider">Max Warn</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-orange-600 tracking-wider">Max Report</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-primary tracking-wider">Warn Texts</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-primary tracking-wider">Text Report</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-black tracking-wider">Method</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-black tracking-wider">Gender</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-black tracking-wider">Age Min</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-black tracking-wider">Age Max</th>
                <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="specification in analysis?.specifications"  :key="specification?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-orange-600">{{ specification.minReport  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-amber-500">{{ specification.minWarn  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-primary">{{ specification.min  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-primary">{{ specification.max  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-amber-500">{{ specification.maxWarn }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-orange-600">{{ specification.maxReport  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-primary">{{ specification.warnValues  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-primary">{{ specification.warnReport  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-black">{{ methodName(specification?.methodUid) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-black">{{ specification.gender  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-black">{{ specification.ageMin  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-black">{{ specification.ageMax  }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button @click="FormManager(false, specification)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>

  <!-- Detection Limit Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-3/4'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body >
      <form action="post" class="p-1">
        <h4 class="font-semibold">Numerical Results</h4>
        <hr class="mb-4">
        <div class="grid grid-cols-6 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-orange-600">Min Report</span>
            <input
             type="text"
              class="form-input mt-1 block w-full"
              v-model="form.minReport"
              placeholder="Value ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-amber-500">Min Warn</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.minWarn"
              placeholder="Value ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-primary">Min</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.min"
              placeholder="Value ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-primary">Max</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.max"
              placeholder="Value ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-amber-500">Max Warn</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.maxWarn"
              placeholder="Value ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-orange-600">Max Report</span>
            <input
             type="text"
              class="form-input mt-1 block w-full"
              v-model="form.maxReport"
              placeholder="Value ..."
            />
          </label>
        </div>
        <h4 class="font-semibold">Textual Results</h4>
        <hr class="mb-4">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2" >
            <span class="text-primary w-4/12">Textual Results (comma seperated)</span>
            <div class="w-full">
            <input
             type="text"
              class="form-input mt-1 block w-full"
              v-model="form.warnValues"
              placeholder="Value ..."
            />
            </div>
          </label>
          <label class="block col-span-1 mb-2" >
            <span class="text-primary w-4/12">Report Message</span>
            <div class="w-full">
            <input
             type="text"
              class="form-input mt-1 block w-full"
              v-model="form.warnReport"
              placeholder="Value ..."
            />
            </div>
          </label>
        </div>
        <h4 class="font-semibold">Conditions if Any</h4>
        <hr class="mb-4">
        <div class="grid grid-cols-4 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2" >
            <span class="text-black w-4/12">Method</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="form.methodUid">
                <option></option>
                <option v-for="method in methods" :key="method?.uid" :value="method.uid"> {{ method?.name }}</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2" >
            <span class="text-black w-4/12">Gender</span>
            <div class="w-full">
              <select class="form-select mt-1 w-full" v-model="form.gender">
                <option value="all" selected>All</option>
                <option value="male">Male</option>
                <option value="male">Female</option>
              </select>
            </div>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-black">Age Min</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.ageMin"
              placeholder="Value ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-black">Age Max</span>
            <input
             type="number"
              class="form-input mt-1 block w-full"
              v-model="form.ageMax"
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

