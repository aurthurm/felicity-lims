<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent, onMounted, h } from 'vue';
  import { storeToRefs } from 'pinia'
  import { RouterLink } from "vue-router";
  import { useSetupStore } from '@/stores/setup';
  import { useSampleStore } from '@/stores/sample';
  import { useAnalysisStore } from '@/stores/analysis';
  import { IAnalysisProfile, IAnalysisService, IQCRequest, ISample } from '@/models/analysis';
  import * as shield from '@/guards'
  import useApiUtil from '@/composables/api_util';
  import { AddQcRequestDocument, AddQcRequestMutation, AddQcRequestMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { parseDate } from '@/utils';
  const VueMultiselect = defineAsyncComponent(
    () => import('vue-multiselect')
  )
  const DataTable = defineAsyncComponent(
    () => import('@/components/ui/datatable/FelDataTable.vue')
  )
 

  const filterOptions = ref([
    { name: "All", value: "" },
    { name: "Pending", value: "pending" },
    { name: "Awaiting", value: "awaiting" },
    { name: "Approved", value: "approved" }
  ]);
  const tableColumns = ref([
    {
      name: "UID",
      value: "uid",
      sortable: true,
      sortBy: "asc",
      defaultSort: true,
      showInToggler: false,
      hidden: true,
    },
    {
      name: "Date Created",
      value: "createdAt",
      sortable: false,
      defaultSort: true,
      showInToggler: false,
      hidden: false,
      customRender: function (qcset, _) {
        return h('div', parseDate(qcset.createdAt));
      },
    },
    {
      name: "Run Sets (samples)",
      value: "",
      sortable: false,
      sortBy: "asc",
      hidden: false,
      customRender: function (qcset, _) {
        return h('div', qcSetSamples(qcset.samples ?? []));
      },
    },
    {
      name: "Test(s)",
      value: "code",
      sortable: false,
      sortBy: "asc",
      hidden: false,
      customRender: function (qcset, _) {
        return h('div', qcSetProfileAnalyses(qcset.samples ?? []));
      },
    },    {
      name: "Status",
      value: "status",
      sortable: false,
      defaultSort: false,
      showInToggler: true,
    },
    {
      name: "",
      value: "",
      sortable: false,
      hidden: false,
      showInToggler: false,
      customRender: function (qcset, _) {
      return h(RouterLink, {
        to: {
          name:'qc-set-detail', params: { qcSetUid: qcset.uid }
        },
        class:
          "px-2 mr-2 border-primary border text-gray-500rounded-smtransition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none",
        innerHTML: 'View Run Set',
      });
    },
    }
  ]);

  const sampleStore = useSampleStore();
  const analysisStore = useAnalysisStore();
  const setupStore = useSetupStore();
  const { withClientMutation } = useApiUtil()

  const { qcSets, fetchingQCSets } = storeToRefs(sampleStore)

  let analysesParams = reactive({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  });
  analysisStore.fetchAnalysesServices(analysesParams);
  analysisStore.fetchQCLevels()
  analysisStore.fetchQCTemplates();
  analysisStore.fetchAnalysesProfiles();
  setupStore.fetchDepartments({});
  sampleStore.resetQCSets()

  let qcSetBatch = ref<number>(25);
  let qcSetCount = computed(() => `Showing ${qcSets?.value?.length} of ${sampleStore.getQCSetCount} QC Sets`);
  let qcSetParams = reactive({ 
    first: qcSetBatch.value, 
    after: "",
    status: "", 
    sortBy: ["-uid"],
    filterAction: false
  });
  sampleStore.fetchQCSets(qcSetParams);

  function searchQCSets(opts: any): void {
    qcSetParams.first = 25;
    qcSetParams.after = "";
    qcSetParams.status = opts.filterStatus;
    qcSetParams.filterAction = true;
    sampleStore.fetchQCSets(qcSetParams);
  }

  const analysesProfiles = computed<IAnalysisProfile[]>(() => analysisStore.getAnalysesProfiles);
  const analysesServices = computed<IAnalysisService[]>(() => {
    const services: IAnalysisService[] = analysisStore.getAnalysesServicesSimple;
    let s = new Set<IAnalysisService>();
    services.forEach((service: IAnalysisService) => {
      if(service.profiles?.length === 0){
        s.add(service)
      }
    })
    return [...s];
  });


  // QC Request
  let showModal = ref<boolean>(false);
  let formAction = ref<boolean>(true);
  let form = reactive({ 
    departmentUid: undefined,
    samples: [] as IQCRequest[]
  });
  // initialise with 1 set
  onMounted(() => addQCSet())

  function addQCSet(): void {
    form.samples?.push({
      qcTemplate: undefined,
      qcLevels: [],
      analysisProfiles: [],
      analysisServices: []
    });
  }

  function addQCRequest(): void {
    const _samples = form.samples?.map((sample: IQCRequest) => {
      return {
        qcTemplateUid: sample.qcTemplate?.uid,
        qcLevels: sample.qcLevels?.map(l => l.uid),
        analysisProfiles: sample.analysisProfiles?.map(p => p.uid),
        analysisServices: sample.analysisServices?.map(s => s.uid)
      }
    });
    withClientMutation<AddQcRequestMutation, AddQcRequestMutationVariables>(AddQcRequestDocument, { samples: _samples }, "createQcSet")
    .then((result) => sampleStore.addQCSets(result?.qcSets ));
  }

  function removeQCSet(index: number): void {
      form.samples?.splice(index, 1);
  }

  function FormManager(create: boolean, obj: IQCRequest):void {
    formAction.value = create;
    showModal.value = true;
    if (create) {
      Object.assign(form, {} as IQCRequest);
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm(): void {
    if (formAction.value === true) addQCRequest();
    showModal.value = false;
  }

  const pageInfo = computed(() => sampleStore.getQCSetPageInfo);

  function showMoreQCSets(): void {
    qcSetParams.first = +qcSetBatch.value;
    qcSetParams.after = pageInfo?.value?.pageInfo?.endCursor ?? "";
    qcSetParams.text = "";
    qcSetParams.filterAction = false;
    sampleStore.fetchQCSets(qcSetParams);
  }

  function qcSetSamples(samples: ISample[]): string {
    let ids:string[] = [];
    let levels:string[] = [];
    samples?.forEach((sample: ISample) => {
      let sampleId = sample?.sampleId + ' (' + sample.status + ')';
      if(!ids.includes(sampleId)){
        ids.push(sampleId)
      }
      let level = sample?.qcLevel?.level?.match(/\b([A-Z])/g)!.join('') + ' (' + sample.status + ')';
      if(!levels.includes(level)){
        levels.push(level)
      }
    })
    return levels.join(', ');
  }

  function qcSetProfileAnalyses(samples: ISample[]): string {
    let names: string[] = [];
    samples?.forEach((sample: ISample) => {
        sample?.profiles?.forEach(p => {
          if(!names.includes(p.name!)){
            names.push(p.name!)
          }
        });
    })
    samples?.forEach(sample => {
        sample?.analyses?.forEach(a => {
          if(!names.includes(a.name!)){
            names.push(a.name!)
          }
        });
    })
    return names.join(', ');
  }

  const departments = computed(() => setupStore.getDepartments)
  const qcTemplates = computed(() => analysisStore.getQCTemplates)
  const qcLevels = computed(() => analysisStore.getQCLevels)
</script>

<template>
  <fel-heading title="Reference Runs (QC)">
    <div class="flex justify-start items-start gap-x-4">
      <fel-button
        v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SAMPLE)"
        @click.prevent="showModal = !showModal">
        Add Reference Runs
      </fel-button>
      <router-link to="/quality-control/charts" id="control-charts"
      class="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50">
        View Run Charts
      </router-link>
    </div>
  </fel-heading>

  <div class="rounded-lg border border-border bg-card shadow-sm p-6">
    <DataTable 
    :columns="tableColumns" 
    :data="qcSets" 
    :toggleColumns="true" 
    :loading="fetchingQCSets" 
    :paginable="true"
    :pageMeta="{
        fetchCount: qcSetParams.first,
        hasNextPage: pageInfo?.pageInfo?.hasNextPage,
        qcSetCount,
    }" 
    :searchable="false"
    @onSearch="searchQCSets" 
    :filterable="true" 
    :filterMeta="{  
        defaultFilter: qcSetParams.status,
        filters: filterOptions,
    }" 
    @onPaginate="showMoreQCSets" 
    :selectable="false">
      <template v-slot:footer> </template>
    </DataTable>
  </div>

  <fel-modal v-if="showModal" @close="showModal = false" :contentWidth="'w-4/5'">
    <template v-slot:header>
      <h3>Create QC Analyses Requests</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="mb-8 bg-background">
         <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1">
              <span class="text-foreground">Department</span>
              <select 
              name="clientContacts" 
              id="clientContacts" 
              v-model="form.departmentUid"
              class="form-input mt-1 block w-full">
                <option value=""></option>
                <option  
                v-for="department in departments"
                :key="department.uid"
                :value="department.uid">{{ department.name }}</option>
            </select>
          </label>
        </div> 
        <section id="samples">
            <hr>
            <div class="flex justify-between items-center py-2">
              <h5>Add Control Samples</h5>
              <button
                v-if="form.samples?.length < 20"
                @click.prevent="addQCSet()"
                class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Add QCSet</button>
            </div>
            <hr class="mb-4">
            <div v-for="(sample, index) in form.samples" :key="index">
                <div class="flex items-center justify-between">
                    <div class="">
                        <div class="grid grid-cols-4 gap-x-4">
                            <label class="block col-span-1 mb-2">
                              <span class="text-foreground">QC Template</span>
                              <VueMultiselect
                              class="max-w-[300px]"
                              v-model="sample.qcTemplateUid"
                              :options="qcTemplates"
                              :multiple="false"
                              :searchable="true"
                              label="name"
                              track-by="uid">
                              </VueMultiselect>
                            </label>
                            <label class="block col-span-1 mb-2">
                              <span class="text-foreground">QC Levels</span>
                              <VueMultiselect
                              class="max-w-[300px]"
                              v-model="sample.qcLevels"
                              :options="qcLevels"
                              :multiple="true"
                              :searchable="true"
                              label="level"
                              track-by="uid">
                              </VueMultiselect>
                            </label>
                            <label class="block col-span-1 mb-2">
                              <span class="text-foreground">Analysis Profiles</span>
                              <VueMultiselect
                              class="max-w-[300px]"
                              v-model="sample.analysisProfiles"
                              :options="analysesProfiles"
                              :multiple="true"
                              :searchable="true"
                              label="name"
                              track-by="uid">
                              </VueMultiselect>
                            </label>
                            <label class="block col-span-1 mb-2">
                              <span class="text-foreground">Analysis Services</span>
                              <VueMultiselect
                              class="max-w-[300px]"
                              v-model="sample.analysisServices"
                              :options="analysisStore.getAnalysesServicesSimple"
                              :multiple="true"
                              :searchable="true"
                              label="name"
                              track-by="uid">
                              </VueMultiselect>
                            </label>
                        </div>
                    </div>
                    <div class="ml-4">
                      <button @click.prevent="removeQCSet(index)"
                        class="px-2 py-1 mr-2 border-destructive border text-orange-600rounded-smtransition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none">Remove</button>
                    </div>
                </div>
                <hr>
            </div>

        </section>
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
  </fel-modal>


</template>

