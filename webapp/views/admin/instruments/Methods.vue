<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IMethod } from '../../../models/setup'
  import { useAnalysisStore, useSetupStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
  const modal = defineAsyncComponent(
    () => import('../../../components/SimpleModal.vue')
  )
  const MethodForm = defineAsyncComponent(
    () => import('./MethodForm.vue')
  )

  const analysisStore = useAnalysisStore()
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  let method = reactive({}) as IMethod;


  const analysesParams = { first: 1000, after: "", text: "", sortBy: ["name"]}
  analysisStore.fetchAnalysesServices(analysesParams);
  const analyses = computed(() => analysisStore.getAnalysesServicesSimple)  

  setupStore.fetchMethods();  
  const methods = computed(() => setupStore.getMethods)  

  function FormManager(create: boolean, obj = {} as IMethod): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES METHOD";
    if (create) {
      Object.assign(method, { ...{} as IMethod });
    } else {
      Object.assign(method, { ...obj });
    }
  }

  function getAnalyses(method :IMethod) {
    let final: string[] = [];
    analyses.value?.forEach(an => {
      if(an?.methods?.some(m => m.uid == method?.uid)) {
        final.push(an?.name!)
      }
    })
    return final.join(', ');
  }


</script>

<template>
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      > Add Method</button>
      <hr>
    </div>
    <hr />

    <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Instruments</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Analyses</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="meth in methods" :key="meth?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-gray-800">{{ meth?.name }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-gray-800">{{ meth?.instruments?.map(inst => inst?.name)?.join(",") }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ getAnalyses(meth) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button @click="FormManager(false, meth)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- AnaltsisProfile Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <method-form :method="method" :methodUid="method?.uid"  @close="showModal = false" />
    </template>
  </modal>

</template>
