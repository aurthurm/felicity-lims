<template>
  <div class="flex items-center justify-between">
    <h1 class="h1 font-bold text-dark-700">QC Analyses Requests</h1>
    <button 
    type="button" 
    class="border border-green-500 bg-green-500 text-white rounded-md px-2 py-1 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
    @click.prevent="showModal = !showModal">
      Add New QC Request
    </button>
  </div>
  <hr>

  <section class="my-4 flex sm:flex-row flex-col">
        <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
                <select
                class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
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
                
                class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
      </div>
      <button
        class="px-2 py-1 ml-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">
        Filter ...</button>
      
    </section>

    <section class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">Date Created</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">QCSet (samples)</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Test(s)</th>
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
                  <div class="text-sm leading-5 text-blue-900">{{ qcSetSamples(qcSet.samples) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ qcSetProfileAnalyses(qcSet.samples) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <router-link 
                    :to="{ name:'qc-set-detail', params: { qcSetUid: qcSet.uid } }"
                    class="px-2 py-1 mr-2 border-gray-500 border text-gray-500 rounded transition duration-300 hover:bg-gray-700 hover:text-white focus:outline-none">View Detail</router-link>
                    <button class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">View Chart</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </section>

    <section class="flex justify-between">
    <div></div>
    <div class="my-4 flex sm:flex-row flex-col">
      <button 
      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
      >Show More</button>
      <div class="flex flex-row mb-1 sm:mb-0">
          <div class="relative">
              <select class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
               >
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
          <input 
              class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" disabled/>
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
                <span class="cursor-pointer text-xl text-blue-600"
                @click="drillDown = !drillDown">
                  <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
                </span>
                <button
                v-if="form.samples?.length < 20"
                @click.prevent="addQCSet()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add QCSet</button>
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
                        class="px-2 py-1 mr-2 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none">Remove</button>
                    </div>
                </div>
                <hr>
            </div>

        </section>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>


</template>



<script lang="ts">
import modal from '../_components/SimpleModal.vue';
import { useMutation } from '@urql/vue';
import { defineComponent, ref, toRefs, reactive, computed, watch } from 'vue';
import { ActionTypes as SampleActionTypes } from '../../store/modules/samples';
import { isNullOrWs } from '../../utils';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes, QCRequest, IQCRequest } from '../../store/modules/analyses';
import { ADD_QC_REQUEST } from '../../graphql/analyses.mutations';
import { ActionTypes as SetUpActionTypes } from '../../store/actions';
import { isNullOrWs } from '../../utils';
export default defineComponent({
  name: "quality-control-listing",
  components: {
    modal,
  },
  setup()  {    
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    let showModal = ref(false);

    let formAction = ref(true);
    let form = reactive({ 
      samples: [new QCRequest] as IQCRequest[]
    });

    let analysesParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"]
    });
    store.dispatch(ActionTypes.FETCH_ANALYSES_SERVICES, analysesParams);
    store.dispatch(ActionTypes.FETCH_QC_LEVELS);
    store.dispatch(ActionTypes.FETCH_ANALYSES_QC_TEMPLATES);
    store.dispatch(ActionTypes.FETCH_ANALYSES_PROFILES);
    store.dispatch(SetUpActionTypes.FETCH_DEPARTMENTS);
    store.dispatch(SampleActionTypes.RESET_QC_SET)
    store.dispatch(SampleActionTypes.FETCH_QC_SETS);

    const analysesProfiles = computed(() =>store.getters.getAnalysesProfiles);
    const analysesServices = computed(() => {
      const services = store.getters.getAnalysesServicesSimple;
      let s = new Set();
      services.forEach((service, index) => {
        if(service.profiles?.length === 0){
          s.add(service)
        }
      })
      return [...s];
    });

    const { executeMutation: createQCRequest } = useMutation(ADD_QC_REQUEST);

    function addQCRequest(): void {
      createQCRequest({ samples: form.samples }).then((result) => {
       store.dispatch(SampleActionTypes.ADD_QC_SETS, result);
      });
    }

    function addQCSet(): void {
      form.samples?.push(new QCRequest());
    }

    function removeQCSet(index): void {
        form.samples?.splice(index, 1);
    }

    function FormManager(create: boolean, obj: IQCRequest):void {
      formAction.value = create;
      showModal.value = true;
      if (create) {
        let ar = new QCRequest();
        Object.assign(form, { ...ar });
      } else {
        Object.assign(form, { ...obj });
      }
    }

    function saveForm(): void {
      if (formAction.value === true) addQCRequest();
      showModal.value = false;
    }


    function qcSetSamples(samples: any[]): string {
      let ids = [];
      let levels = [];
      samples?.forEach(sample => {
        let sampleId = sample?.sampleId + ' (' + sample.status + ')';
        if(!ids.includes(sampleId)){
          ids.push(sampleId)
        }
        let level = sample?.qcLevel?.level?.match(/\b([A-Z])/g).join('') + ' (' + sample.status + ')';
        if(!levels.includes(level)){
          levels.push(level)
        }
      })
      return levels.join(', ');
    }

    function qcSetProfileAnalyses(samples: any[]): string {
      let names = [];
      samples?.forEach(sample => {
          sample.profiles.forEach(p => {
            if(!names.includes(p.name)){
              names.push(p.name)
            }
          });
      })
      samples?.forEach(sample => {
          sample.analyses.forEach(a => {
            if(!names.includes(a.name)){
              names.push(a.name)
            }
          });
      })
      return names.join(', ');
    }

    return {
      showModal,
      drillDown: ref(false),
      departments: computed(() => store.getters.getDepartments),
      qcTemplates: computed(() =>store.getters.getQCTemplates),
      qcLevels: computed(() => store.getters.getQCLevels),
      analysesProfiles,
      analysesServices,
      FormManager,
      form,
      saveForm,
      addQCSet,
      removeQCSet,
      qcSets: computed(() => store.getters.getQCSets),
      qcSetSamples,
      qcSetProfileAnalyses,
    };
  },
});
</script>


   