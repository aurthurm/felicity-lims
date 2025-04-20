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
  <div class="space-y-6">
    <fel-heading title="Methods">
      <fel-button @click="FormManager(true)"> Add Method</fel-button>
    </fel-heading>
    
    <div class="border border-border bg-background rounded-lg shadow-sm p-6 overflow-hidden">
      <div class="relative w-full overflow-auto">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&_tr]:border-b">
            <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Instruments</th>
              <th class="px-4 py-2 text-left align-middle font-medium text-muted-foreground">Analyses</th>
              <th class="px-4 py-2 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="[&_tr:last-child]:border-0">
            <tr v-for="meth in methods" :key="meth?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td class="px-4 py-2 align-middle">{{ meth?.name }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ meth?.instruments?.map(inst => inst?.name)?.join(", ") }}</td>
              <td class="px-4 py-2 align-middle text-primary">{{ getAnalyses(meth) }}</td>
              <td class="px-4 py-2 align-middle text-right">
                <button 
                  @click="FormManager(false, meth)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Method Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <method-form :method="method" :methodUid="method?.uid" @close="closeForm" />
    </template>
  </fel-modal>
</template>
