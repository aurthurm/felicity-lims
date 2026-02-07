<script setup lang="ts">
import { Button } from "@/components/ui/button";
  import { ref, reactive, computed, defineAsyncComponent, onMounted } from 'vue';
  import { MethodType } from '@/types/gql'
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSetupStore } from '@/stores/setup';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'MethodsView' })
  const MethodForm = defineAsyncComponent(
    () => import('./MethodForm.vue')
  )

  const analysisStore = useAnalysisStore()
  const setupStore = useSetupStore()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);

  let method = reactive({}) as MethodType;


  const analysesParams = { first: 1000, after: "", text: "", sortBy: ["name"]}
  analysisStore.fetchAnalysesServices(analysesParams);
  const analyses = computed(() => analysisStore.getAnalysesServicesSimple)  

  onMounted(() => setupStore.fetchMethods())  

  const methods = computed(() => setupStore.getMethods)  

  function FormManager(create: boolean, obj = {} as MethodType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES METHOD";
    if (create) {
      Object.assign(method, { ...{} as MethodType });
    } else {
      Object.assign(method, { ...obj });
    }
  }

  function getAnalyses(method :MethodType) {
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
    <PageHeading title="Methods">
      <Button @click="FormManager(true)"> Add Method</Button>
    </PageHeading>
    
    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Instruments</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Analyses</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="meth in methods" :key="meth?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle text-sm">{{ meth?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ meth?.instruments?.map(inst => inst?.name)?.join(", ") }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm text-primary">{{ getAnalyses(meth) }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <button 
                  @click="FormManager(false, meth)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                >
                  Edit
                </button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!methods || methods.length === 0" :colspan="4">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No methods found</EmptyTitle>
                    <EmptyDescription>Add a method to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Method Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <method-form :method="method" :methodUid="method?.uid" @close="closeForm" />
    </template>
  </Modal>
</template>
