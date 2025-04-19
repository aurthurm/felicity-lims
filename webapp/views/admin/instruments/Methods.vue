<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent, onMounted } from 'vue';
  import { IMethod } from '@/models/setup'
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  const modal = defineAsyncComponent(
    () => import('@/components/ui/FelModal.vue')
  )
  const MethodForm = defineAsyncComponent(
    () => import('./MethodForm.vue')
  )

  const analysisStore = useAnalysisStore()
  const setupStore = useSetupStore()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  let method = reactive({}) as IMethod;


  const analysesParams = { first: 1000, after: "", text: "", sortBy: ["name"]}
  analysisStore.fetchAnalysesServices(analysesParams);
  const analyses = computed(() => analysisStore.getAnalysesServicesSimple)  

  onMounted(() => setupStore.fetchMethods())  

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

const closeForm = () => {
  showModal.value = false
  setupStore.fetchMethods();
}
</script>

<template>
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none"
        @click="FormManager(true)"
      > Add Method</button>
      <hr>
    </div>
    <hr />

    <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Name</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Instruments</th>
                <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Analyses</th>
                <th class="px-1 py-1 border-b-2 border-border"></th>
            </tr>
            </thead>
            <tbody class="bg-background">
            <tr v-for="meth in methods" :key="meth?.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                  <div class="text-sm leading-5 text-foreground">{{ meth?.name }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                  <div class="text-sm leading-5 text-foreground">{{ meth?.instruments?.map(inst => inst?.name)?.join(",") }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                  <div class="text-sm leading-5 text-primary">{{ getAnalyses(meth) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                    <button @click="FormManager(false, meth)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
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
      <method-form :method="method" :methodUid="method?.uid"  @close="closeForm" />
    </template>
  </modal>

</template>
