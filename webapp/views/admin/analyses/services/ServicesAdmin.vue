<script setup lang="ts">
import { Button } from "@/components/ui/button";
  import { ref, reactive, computed, defineAsyncComponent, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { AnalysisType } from '@/types/gql';
  import { AddAnalysisMappingDocument, AddAnalysisMappingMutation, AddAnalysisMappingMutationVariables,
    AddAnalysisServiceDocument, AddAnalysisServiceMutation, AddAnalysisServiceMutationVariables,
    EditAnalysisMappingDocument, EditAnalysisMappingMutation, EditAnalysisMappingMutationVariables,
    EditAnalysisServiceDocument, EditAnalysisServiceMutation, EditAnalysisServiceMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import { useSampleStore } from '@/stores/sample';
  import  useApiUtil  from '@/composables/api_util';
import { mutateForm, resetForm } from '@/utils';
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeading from "@/components/common/PageHeading.vue"
  const VueMultiselect = defineAsyncComponent(
    () => import('vue-multiselect')
  )
  const ResultOptions = defineAsyncComponent(
    () => import('./ResultOptions.vue')
  )
  const InterimFields = defineAsyncComponent(
    () => import('./InterimFields.vue')
  )
  const CorrectionFactor = defineAsyncComponent(
    () => import('./CorrectionFactor.vue')
  )
  const AnalysisUncertainty = defineAsyncComponent(
    () => import('./Uncertainty.vue')
  )
  const DetectionLimits = defineAsyncComponent(
    () => import('./DetectionLimit.vue')
  )
  const AnalysisSpecifications = defineAsyncComponent(
    () => import('./Specifications.vue')
  )
  const Billing = defineAsyncComponent(
    () => import('../Billing.vue')
  )
  const SmsTemplates = defineAsyncComponent(
    () => import('./SmsTemplate.vue')
  )


  const route = useRoute();
  const analysisStore = useAnalysisStore()
  const sampleStore = useSampleStore()
  const  setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  let currentTab = ref('summary');
  const tabList = [
    { id: 'summary', label: 'Summary' },
    { id: 'uncertainities', label: 'Uncertainties' },
    { id: 'result-options', label: 'Result options' },
    { id: 'interims', label: 'Interims' },
    { id: 'correction-factor', label: 'Correction factor' },
    { id: 'detection-limits', label: 'Detection limits' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'mappings', label: 'Mappings' },
    { id: 'billing', label: 'Billing' },
    { id: 'sms-templates', label: 'SMS templates' },
  ];
  
  let showModal = ref(false);
  let formTitle = ref('');
  let analysisService = reactive({}) as AnalysisType; 
  const formAction = ref(true);

  const sampleTypes = computed<any[]>(() => sampleStore.getSampleTypes);
  const departments = computed<any[]>(() => setupStore.getDepartments);

  setupStore.fetchMethods();
  const methods = computed<any[]>(() => setupStore.getMethods);

  setupStore.fetchUnits();    
  const units = computed(() => setupStore.getUnits);

  analysisStore.fetchAnalysesCategories();
  const analysesCategories = computed(() => analysisStore.getAnalysesCategories)
  const analysesServices = computed(() => analysisStore.getAnalysesServices)

  watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.item) {
      const service = analysisStore.analysesServices.find(an => an.name === newQuery.item)
      mutateForm(analysisService, service)
    }
  },
  { immediate: true }
);

  let analysesParams = reactive({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  });
  analysisStore.fetchAnalysesServices(analysesParams);

  function addAnalysisService(): void {
    const payload = { 
      name: analysisService.name, 
      keyword: analysisService.keyword, 
      description: analysisService.description, 
      categoryUid: analysisService.categoryUid, 
      departmentUid: analysisService.departmentUid, 
      unitUid: analysisService.unitUid,
      sortKey: analysisService.sortKey,
      active: analysisService.active, 
      internalUse: analysisService.internalUse, 
      sampleTypes: analysisService.sampleTypes?.map(item => item.uid),
      methods: analysisService.methods?.map(item => item.uid),
      tatLengthMinutes: analysisService.tatLengthMinutes,
      precision: analysisService.precision,
      requiredVerifications: analysisService.requiredVerifications,
      selfVerification: analysisService.selfVerification,
    }
    withClientMutation<AddAnalysisServiceMutation, AddAnalysisServiceMutationVariables>(AddAnalysisServiceDocument, { payload }, "createAnalysis")
    .then((result) => analysisStore.addAnalysesService(result));
  }

  function editAnalysisService(): void {
    const payload = { 
      name: analysisService.name, 
      keyword: analysisService.keyword, 
      description: analysisService.description, 
      departmentUid: analysisService.departmentUid, 
      categoryUid: analysisService.categoryUid, 
      unitUid: analysisService.unitUid,
      sortKey: analysisService.sortKey,
      active: analysisService.active, 
      internalUse: analysisService.internalUse, 
      sampleTypes: analysisService.sampleTypes?.map(item => item.uid),
      methods: analysisService.methods?.map(item => item.uid),
      tatLengthMinutes: analysisService.tatLengthMinutes,
      precision: analysisService.precision,
      requiredVerifications: analysisService.requiredVerifications,
      selfVerification: analysisService.selfVerification,
    }
    withClientMutation<EditAnalysisServiceMutation, EditAnalysisServiceMutationVariables>(EditAnalysisServiceDocument, {  uid: analysisService.uid,  payload }, "updateAnalysis")
    .then((result) => analysisStore.updateAnalysisService(result));
  }

  function selectAnalysisService(service: AnalysisType):void {
    mutateForm(analysisService, service)
  }

  function FormManager(create: boolean):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES SERVICE";

    if (create) resetForm(analysisService);
  }

  function saveForm():void {
    if (formAction.value === true) addAnalysisService();
    if (formAction.value === false) editAnalysisService();
    showModal.value = false;
  }

// Mapping
analysisStore.fetchCodingStandards()
const mappings = computed(() => analysisStore.analysesMapings?.filter(m => m.analysisUid === analysisService?.uid))
let showMappingModal = ref(false);
let mappingFormTitle = ref("");
const mappingFormAction = ref(true);
const mappingForm =  reactive({
  uid: undefined,
  analysisUid: undefined,
  codingStandardUid: undefined,
  name: "",
  code: "",
  description: ""
})

function addMapping(): void {
  const payload = {
    analysisUid: analysisService?.uid,
    codingStandardUid: mappingForm.codingStandardUid,
    name: mappingForm.name,
    code: mappingForm.code,
    description: mappingForm.description,
  };
  withClientMutation<AddAnalysisMappingMutation, AddAnalysisMappingMutationVariables>(AddAnalysisMappingDocument, { payload }, "createAnalysisMapping").then((result) => analysisStore.addAnalysesMapping(result));
}

function updateMapping(): void {
  const payload = {
    analysisUid: analysisService?.uid,
    codingStandardUid: mappingForm.codingStandardUid,
    name: mappingForm.name,
    code: mappingForm.code,
    description: mappingForm.description,
  };
  withClientMutation<EditAnalysisMappingMutation, EditAnalysisMappingMutationVariables>(EditAnalysisMappingDocument, { uid: mappingForm.uid, payload }, "updateAnalysisMapping").then((result) => analysisStore.updateAnalysesMapping(result));
}

function MappingFormManager(create: boolean, obj = {} as any): void {
  mappingFormAction.value = create;
  showMappingModal.value = true;
  mappingFormTitle.value = (create ? "CREATE" : "EDIT") + " " + "CONCEPT MAPPING";
  if (create) { resetForm(mappingForm) } else { mutateForm(mappingForm, obj)}
}

function saveMappingForm(): void {
  if (mappingFormAction.value === true) addMapping();
  if (mappingFormAction.value === false) updateMapping();
  showMappingModal.value = false;
}
</script>

<template>
  <div>
    <PageHeading title="Analyses Services">
      <Button @click="FormManager(true)">Add Analyses Service</Button>
    </PageHeading>

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-2">
        <div class="rounded-lg border border-border bg-card">
          <div class="p-6">
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-foreground">Analyses</h3>
              <div class="max-h-[540px] overflow-y-auto space-y-1 pr-1">
                <Collapsible
                  v-for="category in analysesServices"
                  :key="String(category[0])"
                  class="rounded-md border border-border"
                >
                  <CollapsibleTrigger
                    class="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium hover:bg-accent/50 rounded-md transition-colors [&[data-state=open]>svg]:rotate-180"
                  >
                    {{ category[0] }}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="shrink-0 transition-transform"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul class="px-3 pb-2 pt-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1.5">
                      <li
                        v-for="service in category[1]"
                        :key="service?.uid"
                        @click="selectAnalysisService(service)"
                        :class="[
                          'flex items-center gap-2 rounded-sm py-1.5 pr-2 pl-2 text-sm outline-none cursor-pointer select-none min-w-0 transition-colors',
                          service?.uid === analysisService?.uid
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        ]"
                      >
                        <span class="flex-1 truncate">{{ service?.name }}</span>
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="col-span-10" v-if="analysisService?.uid !== undefined">
        <!-- Question Listing Item Card -->
        <div class="bg-card text-card-foreground rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200 px-4 sm:px-6 md:px-2 py-4" >
          <div class="grid grid-cols-12 gap-3">
            <!-- Meta Column -->
            <div class="sm:col-span-2 text-center hidden sm:block">
              <div class="grid grid-rows-2 mx-auto mb-1 py-3 w-4/5 2lg:w-3/5 rounded-lg bg-primary" >
                <p class="font-bold text-primary-foreground">KEYWORD</p>
                <div class="inline-block font-medium text-2xl text-primary-foreground">
                  <font-awesome-icon icon="fa-exclamation-circle" />
                </div>
                <div class="inline-block font-medium text-primary-foreground text-md mt-2">{{ analysisService?.keyword }}</div>
              </div>
            </div>
            <!-- Summary Column -->
            <div class="col-span-12 sm:col-start-3 sm:col-end-13 px-3 sm:px-0">
              <div
                class="flex justify-between sm:text-sm md:text-md lg:text-lg text-foreground font-bold"
              >
                <span>{{ analysisService?.name }}</span>
                <div>
                  <button
                    @click="FormManager(false)"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <hr class="border-border" />
              <div class="grid grid-cols-2 mt-2">
                <div class="col-span-1">
                  <!-- Client Details -->
                  <div class="flex">
                    <span class="text-muted-foreground text-md font-bold w-52">Category:</span>
                    <span class="text-foreground text-md">{{ analysisService?.category?.name || 'un-categprised' }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-muted-foreground text-md font-bold w-52">Unit:</span>
                    <span class="text-foreground text-md">{{ analysisService?.unit?.name }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-muted-foreground text-md font-bold w-52">SortKey:</span>
                    <span class="text-foreground text-md">{{ analysisService?.sortKey || '---' }}</span>
                  </div>
                  <div class="flex mt-2">
                    <span class="text-muted-foreground text-md font-bold w-52">TAT (minutes):</span>
                    <span class="text-foreground text-md mr-2">{{ analysisService?.tatLengthMinutes }}</span>
                  </div>
                  <div class="flex mt-2">
                    <span class="text-muted-foreground text-md font-bold w-52">Precision (decimals):</span>
                    <span class="text-foreground text-md mr-2">{{ analysisService?.precision }}</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="col-span-2 flex mt-2">
                    <span class="text-muted-foreground text-md font-bold w-52">Methods:</span>
                    <span class="text-foreground text-md mr-2">{{ analysisService?.methods?.map(s => s.name)?.join(', ') }}</span>
                  </div>
                  <div class="col-span-2 flex mt-2">
                    <span class="text-muted-foreground text-md font-bold w-52">Sample Types:</span>
                    <span class="text-foreground text-md mr-2">{{ analysisService?.sampleTypes?.map(s => s.name)?.join(', ') }}</span>
                  </div>
                  <div class="flex mt-2">
                    <span class="text-muted-foreground text-md font-bold w-52">Required verifications:</span>
                    <span class="text-foreground text-md mr-2">{{ analysisService?.requiredVerifications }}</span>
                  </div>
                  <div class="col-span-4 flex mt-2">
                    <span class="text-muted-foreground text-md font-bold w-52">Allow self-verification:</span>
                    <span class="text-foreground text-md mr-2">{{ analysisService?.selfVerification }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Service tabs -->
        <Tabs v-model="currentTab" class="flex flex-col mt-2">
          <TabsList class="w-full justify-start rounded-lg flex-wrap h-auto gap-1">
            <TabsTrigger
              v-for="tab in tabList"
              :key="tab.id"
              :value="tab.id"
            >
              {{ tab.label }}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" class="flex-1 outline-none mt-4 p-4">
          <h3 class="text-lg font-bold text-foreground">Summary</h3>
          <p class="text-sm text-muted-foreground mt-1">Overview of configuration across all tabs. Use the tabs above to view or edit each section.</p>
          <hr class="border-border my-4" />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Uncertainties -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-foreground">Uncertainty</h4>
                <span class="text-sm text-muted-foreground">{{ analysisService?.uncertainties?.length ?? 0 }} configured</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Instrument/method variance (min–max ± value).</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'uncertainities'">View tab</Button>
            </div>

            <!-- Correction factors -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-foreground">Correction factor</h4>
                <span class="text-sm text-muted-foreground">{{ analysisService?.correctionFactors?.length ?? 0 }} configured</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Instrument/method correction factors.</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'correction-factor'">View tab</Button>
            </div>

            <!-- Result options -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-foreground">Result options</h4>
                <span class="text-sm text-muted-foreground">{{ analysisService?.resultOptions?.length ?? 0 }} options</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Allowed result values (e.g. Positive, Negative).</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'result-options'">View tab</Button>
            </div>

            <!-- Interim fields -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-foreground">Interim fields</h4>
                <span class="text-sm text-muted-foreground">{{ analysisService?.interims?.length ?? 0 }} fields</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Interim key → result value by instrument.</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'interims'">View tab</Button>
            </div>

            <!-- Detection limits -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-foreground">Detection limits</h4>
                <span class="text-sm text-muted-foreground">{{ analysisService?.detectionLimits?.length ?? 0 }} limits</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Instrument/method lower and upper limits.</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'detection-limits'">View tab</Button>
            </div>

            <!-- Specifications -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-foreground">Specifications</h4>
                <span class="text-sm text-muted-foreground">{{ analysisService?.specifications?.length ?? 0 }} specs</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Method-specific min/max specifications.</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'specifications'">View tab</Button>
            </div>

            <!-- Mappings -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <div class="flex items-center justify-between">
                <h4 class="font-semibold text-foreground">Concept mappings</h4>
                <span class="text-sm text-muted-foreground">{{ mappings?.length ?? 0 }} mappings</span>
              </div>
              <p class="text-sm text-muted-foreground mt-1">Coding standard name, code, description.</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'mappings'">View tab</Button>
            </div>

            <!-- Billing -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <h4 class="font-semibold text-foreground">Billing</h4>
              <p class="text-sm text-muted-foreground mt-1">Vouchers and pricing for this analysis.</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'billing'">View tab</Button>
            </div>

            <!-- SMS templates -->
            <div class="p-4 rounded-lg border border-border bg-muted/30">
              <h4 class="font-semibold text-foreground">SMS templates</h4>
              <p class="text-sm text-muted-foreground mt-1">Templates for result notifications.</p>
              <Button variant="outline" size="sm" class="mt-2" @click="currentTab = 'sms-templates'">View tab</Button>
            </div>
          </div>
          </TabsContent>

          <TabsContent value="uncertainities" class="flex-1 outline-none mt-4">
            <analysis-uncertainty :analysis="analysisService" :analysisUid="analysisService?.uid"/>
          </TabsContent>
          <TabsContent value="correction-factor" class="flex-1 outline-none mt-4">
            <correction-factor :analysis="analysisService" :analysisUid="analysisService?.uid"/>
          </TabsContent>
          <TabsContent value="result-options" class="flex-1 outline-none mt-4">
            <result-options :analysis="analysisService" :analysisUid="analysisService?.uid"/>
          </TabsContent>
          <TabsContent value="interims" class="flex-1 outline-none mt-4">
            <interim-fields :analysis="analysisService" :analysisUid="analysisService?.uid"/>
          </TabsContent>
          <TabsContent value="detection-limits" class="flex-1 outline-none mt-4">
            <detection-limits :analysis="analysisService" :analysisUid="analysisService?.uid"/>
          </TabsContent>
          <TabsContent value="specifications" class="flex-1 outline-none mt-4">
            <analysis-specifications :analysis="analysisService" :analysisUid="analysisService?.uid"/>
          </TabsContent>
          <TabsContent value="mappings" class="flex-1 outline-none mt-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-bold text-foreground">Concept Mappings</h3>
              <button @click="MappingFormManager(true)"
                class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring">Add Mapping</button>
            </div>
            <hr class="border-border my-2" />
            <div class="mt-4 border border-border bg-card rounded-lg shadow-md">
              <div class="relative w-full overflow-auto">
                <Table class="w-full caption-bottom text-sm">
                    <TableHeader class="[&_tr]:border-b">
                    <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Coding Standard</TableHead>
                        <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
                        <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</TableHead>
                        <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</TableHead>
                        <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody class="[&_tr:last-child]:border-0">
                    <TableRow v-for="mapp in mappings" :key="mapp" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <TableCell class="px-4 py-3 align-middle text-sm">
                          <div class="flex items-center">
                            <div class="text-sm text-foreground">{{ mapp.codingStandard?.name }}</div>
                          </div>
                        </TableCell>
                        <TableCell class="px-4 py-3 align-middle text-sm">
                          <div class="text-sm text-foreground">{{ mapp.name }}</div>
                        </TableCell>
                        <TableCell class="px-4 py-3 align-middle text-sm">
                          <div class="text-sm text-foreground">{{ mapp.code }}</div>
                        </TableCell>
                        <TableCell class="px-4 py-3 align-middle text-sm">
                          <div class="text-sm text-foreground">{{ mapp.description }}</div>
                        </TableCell>
                        <TableCell class="px-4 py-3 align-middle text-right">
                            <button @click="MappingFormManager(false, mapp)" class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground">Edit</button>
                        </TableCell>
                    </TableRow>
                    </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="billing" class="flex-1 outline-none mt-4">
            <Billing target="analysis" :targetUid="analysisService.uid" />
          </TabsContent>
          <TabsContent value="sms-templates" class="flex-1 outline-none mt-4">
            <sms-templates targetType="analysis" :targetUid="analysisService.uid" />
          </TabsContent>
        </Tabs>

      </section>
    </div>
  </div>


  <!-- AnaltsisService Form Modal -->
  <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-1/2'">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-4">
        <div class="grid grid-cols-6 gap-x-4 mb-4">
          <label class="block col-span-4 mb-2">
            <span class="text-muted-foreground">Analysis Service Name</span>
            <input v-if="!analysisService.keyword?.includes('felicity')"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="analysisService.name"
              placeholder="Name ..."
            />
            <span class="block mt-2 mb-4 font-bold text-xl text-foreground" v-else>{{ analysisService.name }}</span>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-muted-foreground">keyword</span>
            <input v-if="!analysisService.keyword?.includes('felicity')"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="analysisService.keyword"
              placeholder="Keyword ..."
            />
            <span class="block mt-2 mb-4 italic font-semibold text-foreground" v-else>{{ analysisService.keyword }}</span>
          </label>
          <label class="block col-span-1 mb-2" v-show="!analysisService.keyword?.includes('felicity')">
            <span class="text-muted-foreground">Unit</span>
            <select class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1" v-model="analysisService.unitUid">
               <option></option>
              <option v-for="unit in units" :key="unit.uid" :value="unit?.uid">{{ unit.name }}</option>
            </select>
          </label>
        </div>
    
        <div class="grid grid-cols-6 gap-x-4 mb-4">
          <label class="block col-span-3 mb-2">
            <span class="text-muted-foreground">Sample Types</span>
            <VueMultiselect
            v-model="analysisService.sampleTypes"
            :options="sampleTypes"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="uid"
            class="mt-1">
            </VueMultiselect>
          </label>
          <label class="block col-span-3 mb-2">
            <span class="text-muted-foreground">Methods</span>
            <VueMultiselect
            v-model="analysisService.methods"
            :options="methods"
            :multiple="true"
            :searchable="true"
            label="name"
            track-by="uid"
            class="mt-1">
            </VueMultiselect>
          </label>
          <label class="block col-span-6 mb-2">
            <span class="text-muted-foreground">Description</span>
            <textarea v-if="!analysisService.keyword?.includes('felicity')"
            cols="2"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="analysisService.description"
              placeholder="Description ..."
            />
            <span class="block p-2 mt-2 mb-4 bg-muted text-muted-foreground rounded-lg" v-else>{{ analysisService.description }}</span>
          </label>
        </div>
    
        <div class="grid grid-cols-6 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Department</span>
            <select class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1" v-model="analysisService.departmentUid">
               <option></option>
              <option v-for="department in departments" :key="department.uid" :value="department?.uid">{{ department.name }}</option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Analysis Category</span>
            <select class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1" v-model="analysisService.categoryUid">
               <option></option>
              <option v-for="category in analysesCategories" :key="category.uid" :value="category?.uid">{{ category.name }}</option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Sort Key</span>
            <input
              type="number" default="1"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="analysisService.sortKey"
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">TAT (minutes)</span>
            <input
              type="number" default="240"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="analysisService.tatLengthMinutes"
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Precision</span>
            <input
              type="number" default="4"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="analysisService.precision"
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Required verifications</span>
            <input
              type="number" default="1"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="analysisService.requiredVerifications"
            />
          </label>
        </div>
    
        <div class="col-span-4 flex justify-between">
          <label class="block col-span-2 my-2">
            <Checkbox :checked="analysisService.active" @update:checked="(value) => analysisService.active = value"
            />
            <span class="text-muted-foreground ml-4">Is Active</span>
          </label>
          <label class="block col-span-2 my-2">
            <Checkbox :checked="analysisService.internalUse" @update:checked="(value) => analysisService.internalUse = value"
            />
            <span class="text-muted-foreground ml-4">Internal Use</span>
          </label>
          <label class="block col-span-2 my-2">
            <Checkbox :checked="analysisService.selfVerification" @update:checked="(value) => analysisService.selfVerification = value"
            />
            <span class="text-muted-foreground ml-4">Allow Self Verifaction</span>
          </label>
        </div>
        <hr class="border-border my-4" />
        <button
          type="button"
          @click="saveForm()"
          class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Save Form
        </button>
      </form>
    </template>
  </Modal>



    <!-- MappingForm Modal -->
    <Modal v-if="showMappingModal" @close="showMappingModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ mappingFormTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-4">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Coding Standard</span>
            <select
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="mappingForm.codingStandardUid"
            >
              <option></option>
              <option
                v-for="c_standard in analysisStore.codingStandards"
                :key="c_standard.uid"
                :value="c_standard?.uid"
              >
                {{ c_standard.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Standard Name</span>
            <input
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="mappingForm.name"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Standard Code</span>
            <input
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="mappingForm.code"
              placeholder="Keyword ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-muted-foreground">Standard Description</span>
            <textarea
              cols="2"
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-1"
              v-model="mappingForm.description"
              placeholder="Description ..."
            />
          </label>
        </div>
        <hr class="border-border my-4" />
        <button
          type="button"
          @click="saveMappingForm()"
          class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Save Form
        </button>
      </form>
    </template>
  </Modal>


</template>
