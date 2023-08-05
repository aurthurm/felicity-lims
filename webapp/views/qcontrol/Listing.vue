<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { storeToRefs } from 'pinia'
  import { useSampleStore, useAnalysisStore, useSetupStore } from '../../stores';
  import { IAnalysisProfile, IAnalysisService, IQCRequest, ISample } from '../../models/analysis';
  import { ADD_QC_REQUEST } from '../../graphql/operations/analyses.mutations';
  import { useApiUtil } from '../../composables'
  import * as shield from '../../guards'
  const LoadingMessage = defineAsyncComponent(
    () => import("../../components/Spinners/LoadingMessage.vue")
  )
  const modal = defineAsyncComponent(
    () => import('../../components/SimpleModal.vue')
  )

  const sampleStore = useSampleStore();
  const analysisStore = useAnalysisStore();
  const setupStore = useSetupStore();
  const { withClientMutation } = useApiUtil()

  const { qcSets, fetchingQCSets } = storeToRefs(sampleStore)

  let showModal = ref<boolean>(false);

  let formAction = ref<boolean>(true);
  let form = reactive({ 
    departmentUid: undefined,
    samples: [{}] as IQCRequest[]
  });

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
  let qcSetParams = reactive({ 
    first: qcSetBatch.value, 
    after: "",
    text: "", 
    sortBy: ["uid"],
    filterAction: false
  });
  sampleStore.fetchQCSets(qcSetParams);

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

  function addQCRequest(): void {
    withClientMutation(ADD_QC_REQUEST, { samples: form.samples }, "createQcSet")
    .then((result) => sampleStore.addQCSet(result));
  }

  function addQCSet(): void {
    form.samples?.push({} as IQCRequest);
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
        sample.profiles!.forEach(p => {
          if(!names.includes(p.name!)){
            names.push(p.name!)
          }
        });
    })
    samples?.forEach(sample => {
        sample.analyses!.forEach(a => {
          if(!names.includes(a.name!)){
            names.push(a.name!)
          }
        });
    })
    return names.join(', ');
  }

  const drillDown = ref(false)
  const departments = computed(() => setupStore.getDepartments)
  const qcTemplates = computed(() => analysisStore.getQCTemplates)
  const qcLevels = computed(() => analysisStore.getQCLevels)
  const qcSetCount = computed(() => sampleStore.getQCSets?.length + " of " + sampleStore.getQCSetCount + " QC Sets")
</script>

<template>
  <div class="flex items-center justify-between">
    <h1 class="h1 font-bold text-dark-700">QC Analyses Requests</h1>
    <button 
    v-show="shield.hasRights(shield.actions.CREATE, shield.objects.SAMPLE)"
    type="button" 
    class="border border-sky-800 text-sky-800 rounded-sm px-2 py-1 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 hover:text-white focus:outline-none focus:shadow-outline"
    @click.prevent="showModal = !showModal">
      Add New QC Request
    </button>
  </div>
  <hr>

  <!-- <section class="my-4 flex sm:flex-row flex-col">
        <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
                <select
                class="appearance-none h-full rounded-l-sm border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                   <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="resulted">Resulted</option>
                    <option value="to_be_verified">To be Verified</option>
                    <option value="verified">Verified</option>
                </select>
                <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="block relative">
            <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                    <path
                        d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                    </path>
                </svg>
            </span>
            <input placeholder="Search ..."
                
                class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
      </div>
      <button
        class="px-2 py-1 ml-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">
        Filter ...</button>
      
    </section> -->

    <section class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider"></th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">Date Created</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">QCSet (samples)</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Test(s)</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr
                v-for="qcSet in qcSets" :key="qcSet.uid"
            >
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="flex items-center">
                      <div class="text-sm leading-5 text-gray-800">
                        {{ qcSet.createdAt }}
                      </div>
                  </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ qcSetSamples(qcSet.samples ?? []) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-sky-800">{{ qcSetProfileAnalyses(qcSet.samples ?? []) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <router-link 
                    :to="{ name:'qc-set-detail', params: { qcSetUid: qcSet.uid } }"
                    class="px-2 py-1 mr-2 border-sky-800 border text-gray-500rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">View Detail</router-link>
                </td>
            </tr>
            </tbody>
        </table>
        <div v-if="fetchingQCSets" class="py-4 text-center">
          <LoadingMessage message="Fetching QCSets ..." />
        </div>
        </div>
    </section>

    <section class="flex justify-between">
      <div></div>
      <div class="my-4 flex sm:flex-row flex-col">
        <button 
        @click.prevent="showMoreQCSets()"
        v-show="pageInfo?.pageInfo?.hasNextPage"
        class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none"
        >Show More</button>
        <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
                <select class="appearance-none h-full rounded-l-sm border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                v-model="qcSetBatch" :disabled="!pageInfo?.pageInfo?.hasNextPage">
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                    <option value="5000">5000</option>
                    <option value="10000">10000</option>
                </select>
                <div
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="block relative">
            <input :placeholder="qcSetCount"
                class="appearance-none rounded-r-sm rounded-l-sm sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" disabled/>
        </div>
      </div>
    </section>

  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>Create QC Analyses Requests</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="mb-8 bg-white">
         <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1">
              <span class="text-gray-700">Department</span>
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
                <h5>Process Control Samples</h5>
                <span class="cursor-pointer text-xl text-sky-800"
                @click="drillDown = !drillDown">
                  <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                </span>
                <button
                v-if="form.samples?.length < 20"
                @click.prevent="addQCSet()"
                class="px-2 py-1 mr-2 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add QCSet</button>
            </div>
            <hr class="mb-4">
            <div v-for="(sample, index) in form.samples" :key="index">
                <div class="flex items-center justify-between">
                    <div class="">
                        <div class="grid grid-cols-4 gap-x-4">
                            <label class="block col-span-1 mb-2">
                                <span class="text-gray-700">QC Template</span>
                                <select  
                                v-model="sample.qcTemplateUid"
                                class="form-input mt-1 block w-full">
                                  <option value=""></option>
                                  <option  
                                  v-for="(template, index) in qcTemplates"
                                  :key="template.uid"
                                  :value="template.uid" >{{ template.name }}</option>
                              </select>
                            </label>
                            <label class="block col-span-1 mb-2" v-if="drillDown">
                              <span class="text-gray-700">QC Levels</span>
                              <select 
                                v-model="sample.qcLevels"
                                class="form-input mt-1 block w-full" multiple>
                                  <option value=""></option>
                                  <option  
                                  v-for="(level, index) in qcLevels"
                                  :key="level.uid"
                                  :value="level.uid" >{{ level.level }}</option>
                              </select>
                            </label>
                            <label class="block col-span-1 mb-2">
                              <span class="text-gray-700">Analysis Profiles</span>
                              <select  
                                v-model="sample.analysisProfiles"
                                class="form-input mt-1 block w-full" multiple>
                                  <option value=""></option>
                                  <option  
                                  v-for="(profile, index) in analysesProfiles"
                                  :key="profile.uid"
                                  :value="profile.uid" >{{ profile.name }}</option>
                              </select>
                            </label>
                            <label class="block col-span-1 mb-2" v-if="drillDown">
                              <span class="text-gray-700">Analysis Services</span>
                              <select 
                                v-model="sample.analysisServices"
                                class="form-input mt-1 block w-full" multiple>
                                  <option value=""></option>
                                  <option  
                                  v-for="(service, index) in analysesServices"
                                  :key="service.uid"
                                  :value="service.uid" >{{ service.name }}</option>
                              </select>
                            </label>
                        </div>
                    </div>
                    <div class="">
                        <button
                        @click.prevent="removeQCSet(index)"
                        class="px-2 py-1 mr-2 border-orange-600 border text-orange-600rounded-smtransition duration-300 hover:bg-orange-600 hover:text-white focus:outline-none">Remove</button>
                    </div>
                </div>
                <hr>
            </div>

        </section>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>


</template>

