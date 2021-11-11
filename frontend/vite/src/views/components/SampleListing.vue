<template>
  <div class="">
    <div class="my-4 flex sm:flex-row flex-col">
        <div class="flex flex-row mb-1 sm:mb-0">
            <div class="relative">
                <select v-model="filterStatus"
                class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                   <option value="">All</option>
                    <option value="due">Due</option>
                    <option value="received">Received</option>
                    <option value="to_be_verified">To be Verified</option>
                    <option value="verified">Verified</option>
                    <option value="invalidated">Invalidated</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
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
                v-model="filterText"
                class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
        </div><button @click.prevent="filterSamples()"
      class="px-2 py-1 ml-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Filter ...</button>
      
    </div>

    <hr>
    <router-link to="/patients/search" class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add Laboratory Request</router-link>
    <hr>

    <!-- Sampe Table View -->
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">
                    <input type="checkbox" @change="toggleCheckAll()" v-model="allChecked">
                </th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider"></th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left leading-4 text-black-500 tracking-wider">Sampe ID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Test(s)</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Patient</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client Patient ID</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Client</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Created</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Creator</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Status</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr
                v-for="sample in samples" :key="sample.uid"
            >
                <td>
                    <input type="checkbox" v-model="sample.checked" @change="checkCheck(sample)">
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <span v-if="sample.priority > 1"
                    :class="[
                        'font-small',
                        { 'text-red-700': sample.priority > 1 },
                    ]">
                        <i class="fa fa-star"></i>
                    </span>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="flex items-center">
                    <div class="text-sm leading-5 text-gray-800">
                      <router-link :to="{ name: 'sample-detail', params: { patientUid: sample?.analysisrequest?.patient?.uid, sampleUid:sample?.uid  }}">{{ sample.sampleId }}</router-link>
                    </div>
                </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ profileAnalysesText(sample.profiles, sample.analyses) }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ sample?.analysisrequest?.patient?.firstName }} {{ sample?.analysisrequest?.patient?.lastName }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ sample?.analysisrequest?.patient?.clientPatientId }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{ sample?.analysisrequest?.client?.name }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">10/10/2020</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">Amos T ...</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ sample.status }}</button>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <!-- <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">View</button> -->
                    <button class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">View</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>


  <section class="flex justify-between items-center">
    <div>
         <button 
         v-show="can_cancel" 
         @click.prevent="cancelSamples_()" 
         class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Cancel</button>
         <button 
         v-show="can_reinstate" 
         @click.prevent="reInstateSamples_()" 
         class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">ReInstate</button>
         <button 
         v-show="can_receive" 
         @click.prevent="receiveSamples_()" 
         class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Reveive</button>
         <button v-show="can_reject" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Reject</button>
         <button v-show="can_copy_to" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Copy to New</button>
         <button v-show="can_print" class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Print</button>
    </div>
    <div class="my-4 flex sm:flex-row flex-col">
      <button 
      @click.prevent="showMoreSamples()"
      v-show="pageInfo?.hasNextPage"
      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
      >Show More</button>
      <div class="flex flex-row mb-1 sm:mb-0">
          <div class="relative">
              <select class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
               v-model="sampleBatch" :disabled="!pageInfo?.hasNextPage">
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
          <input :placeholder="sampleCount"
              class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" disabled/>
      </div>
    </div>
  </section>



  </div>

  <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Patient</span>
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Client Request ID</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="CRID ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Clinical Data</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="form.description"
              placeholder="Clinical Data ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Client</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Client Contact</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Priority</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
        </div>
        <section id="samples">
            <hr>
            <div class="flex justify-between items-center py-2">
                <h5>Samples</h5>
                <button
                v-if="form.samples?.length <= 2"
                @click.prevent="addSample()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add Sample</button>
            </div>
            <hr class="mb-4">
            <div v-for="(sample, index) in form.samples" :key="index">
                <div class="flex items-center justify-between">
                    <div class="">
                        <div class="grid grid-cols-6 gap-x-4">
                            <label class="block col-span-2 mb-2">
                                <span class="text-gray-700">Sample Type</span>
                                <input
                                class="form-input mt-1 block w-full"
                                v-model="form.name"
                                placeholder="Sample Type ..."
                                />
                            </label>
                            <label class="block col-span-2 mb-2">
                                <span class="text-gray-700">Analysis Profiles</span>
                                <input
                                class="form-input mt-1 block w-full"
                                v-model="form.name"
                                placeholder="Analysis Profiles ..."
                                />
                            </label>
                            <label class="block col-span-2 mb-2">
                                <span class="text-gray-700">Analysis Services</span>
                                <input
                                class="form-input mt-1 block w-full"
                                v-model="form.name"
                                placeholder="Analysis Services ..."
                                />
                            </label>
                        </div>
                    </div>
                    <div class="">
                        <button
                        @click.prevent="removeSample(index)"
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
import modal from '../../components/SimpleModal.vue';

import Swal from 'sweetalert2';
import { useMutation } from '@urql/vue';
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes as SampleActionTypes } from '../../store/modules/sample';
import { ActionTypes } from '../../store/modules/analysis';
import { IAnalysisRequest, ISample } from '../../models/analysis';
import { 
  ADD_ANALYSIS_SERVICE, 
  EDIT_ANALYSIS_SERVICE,
  REINSTATE_SAMPLES,
  RECEIVE_SAMPLES,
  CANCEL_SAMPLES,
  } from '../../graphql/analyses.mutations';
import { ifZeroEmpty } from '../../utils'

export default defineComponent({
  name: "Samples",
  components: {
      modal,
  },
  setup() {    
    const store = useStore();
    let route = useRoute();
    
    let showModal = ref(false);
    let formTitle = ref('');
    let form = reactive({}) as IAnalysisRequest;
    const formAction = ref(true);
    let pageInfo = computed(() => store.getters.getSamplePageInfo)
    let filterText = ref("");
    let filterStatus = ref("");

    store.dispatch(SampleActionTypes.RESET_SAMPLES);
    store.dispatch(SampleActionTypes.FETCH_SAMPLE_TYPES);

    let analysesParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"]
    });
    store.dispatch(ActionTypes.FETCH_ANALYSES_SERVICES, analysesParams);
    store.dispatch(ActionTypes.FETCH_ANALYSES_PROFILES);


    let sampleBatch = ref(50);
    let sampleParams = reactive({ 
      first: sampleBatch.value, 
      after: "",
      status: "", 
      text: "", 
      sortBy: ["uid"],
      clientUid: +ifZeroEmpty(route?.query?.clientUid),
      filterAction: false
    });
    store.dispatch(SampleActionTypes.FETCH_SAMPLES, sampleParams);
    const samples = computed(() =>store.getters.getSamples)

    // const { executeMutation: createAnalysisCategory } = useMutation(ADD_ANALYSIS_SERVICE);
    // const { executeMutation: updateAnalysisCategory } = useMutation(EDIT_ANALYSIS_SERVICE);

    // function addAnalysesCategory(): void {
    //   console.log(form)
    //   createAnalysisCategory({ name: form.name, description: form.description, active: form.active}).then((result) => {
    //    store.dispatch(ActionTypes.ADD_ANALYSES_CATEGORY, result);
    //   });
    // }

    // function editAnalysesCategory(): void {
    //   updateAnalysisCategory({ uid: form.uid, name: form.name, description: form.description, active: form.active}).then((result) => {
    //     store.dispatch(ActionTypes.UPDATE_ANALYSES_CATEGORY, result);
    //   });
    // }

    function profileAnalysesText(profiles: IProfile[], analyses: IAnalysis[]): string {
        let names = [];
        profiles.forEach(p => names.push(p.name));
        analyses.forEach(a => names.push(a.name));
        return names.join(', ');
    }

    function addSample(): void {
        form.samples?.push(new AnalysisRequest());
    }

    function removeSample(index): void {
        form.samples?.splice(index, 1);
    }

    function showMoreSamples(): void {
      sampleParams.first = +sampleBatch.value;
      sampleParams.after = pageInfo?.value?.endCursor;
      sampleParams.text = filterText.value;
      sampleParams.status = filterStatus.value;
      sampleParams.filterAction = false;
      store.dispatch(SampleActionTypes.FETCH_SAMPLES, sampleParams);
    }

    function filterSamples(): void {
      sampleBatch.value = 50;
      sampleParams.first = 50;
      sampleParams.after = "";
      sampleParams.text = filterText.value;
      sampleParams.status = filterStatus.value;
      sampleParams.filterAction = true;
      store.dispatch(SampleActionTypes.FETCH_SAMPLES, sampleParams);
    }

    function FormManager(create: boolean, obj: IAnalysisCategory):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES ANALYSIS REQUEST";
      if (create) {
        const request = new AnalysisRequest();
        request.samples = [];
        request.samples.push(new Sample())
        Object.assign(form, { ...request });
      } else {
        Object.assign(form, { ...obj });
      }
    }

    function saveForm():void {
      if (formAction.value === true) addAnalysesCategory();
      if (formAction.value === false) editAnalysesCategory();
      showModal.value = false;
    }

    // user actions perms
    let can_cancel = ref(false);
    let can_receive = ref(false);
    let can_reinstate = ref(false);
    let can_print = ref(false);
    let can_reject = ref(false);
    let can_copy_to = ref(false);

    let allChecked = ref(false); 
    
    function check(sample): void {
      sample.checked = true;
      checkUserActionPermissios()
    }

    function unCheck(sample): void {
      sample.checked = false;
      checkUserActionPermissios()
    }

    async function toggleCheckAll(): void {
      await samples?.value?.forEach(sample => allChecked.value ? check(sample) : unCheck(sample));
      checkUserActionPermissios()
    }
    
    function areAllChecked(): Boolean {
      return samples?.value?.every(item => item.checked === true);
    }

    function checkCheck(sample): void {
     if(areAllChecked()) {
        allChecked.value = true;
     } else {
        allChecked.value = false;
     }
      checkUserActionPermissios()
    }

    function getSamplesChecked(): any {
      let box = [];
      samples?.value?.forEach(sample => {
        if (sample.checked) box.push(sample);
      });
      return box;
    }

    function checkUserActionPermissios(): void {
      // reset
      can_cancel.value = false;
      can_receive.value = false;
      can_reinstate.value = false;

      const checked = getSamplesChecked();
      if(checked.length === 0) return;

      // can_receive
      if(checked.every(result => result.status === 'due')){
        can_receive.value = true;
      }

      // can_cancel
      if(checked.every(result => ["received", "due"].includes(result.status))){
        can_cancel.value = true;
      }

      // can_reinstate
      if(checked.every(result => result.status === 'cancelled')){
        can_reinstate.value = true;
      }
    }

    function getSampleUids(): string[] {
      const items = getSamplesChecked();
      let ready = [];
      items?.forEach(item => ready.push(item.uid))
      return ready;
    }

    const { executeMutation: cancelSamples } = useMutation(CANCEL_SAMPLES); 

    // function cancelSelectedSamples(analyses): void {
    //   cancelSamples({ analyses }).then(_ => {});
    // } 

    const cancelSamples_ = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to cancel these samples",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, cancel now!',
          cancelButtonText: 'No, do not cancel!',
        }).then((result) => {
          if (result.isConfirmed) {
            // cancelSelectedSamples(getSampleUids())
            let samples = getSampleUids()
            cancelSamples({ samples }).then(_ => {});

            Swal.fire(
              'Its Happening!',
              'Your samples have been cancelled.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }

    const { executeMutation: reinstateSamples } = useMutation(REINSTATE_SAMPLES); 

    function reInstateSelectedSamples(samples): void {
      reinstateSamples({ samples }).then(_ => {});
    }

    const reInstateSamples_ = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to reinstate samples",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, reinstate now!',
          cancelButtonText: 'No, do not reinstate!',
        }).then((result) => {
          if (result.isConfirmed) {
            reInstateSelectedSamples(getSampleUids());

            Swal.fire(
              'Its Happening!',
              'Your samples have been reinstated.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }


    const { executeMutation: receiveSamples } = useMutation(RECEIVE_SAMPLES); 

    function receiveSelectedSamples(samples): void {
      receiveSamples({ samples }).then(_ => {});
    }  

    const receiveSamples_ = async () => {
      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to receive samples",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, receice now!',
          cancelButtonText: 'No, do not receive!',
        }).then((result) => {
          if (result.isConfirmed) {
            receiveSelectedSamples(getSampleUids());

            Swal.fire(
              'Its Happening!',
              'Your analystes have been received.',
              'success'
            ).then(_ => location.reload())

          }
        })
      } catch (error) {
        logger.log(error)
      }
    }


    return {
      showModal, 
      analysesCategories: computed(() =>store.getters.getAnalysesCategories),
      patients: computed(() =>store.getters.getPatients),
      FormManager,
      form,
      formTitle,
      saveForm,
      addSample,
      removeSample,
      samples,
      sampleCount: computed(() => store.getters.getSamples?.length + " of " + store.getters.getSampleCount + " samples"),
      showMoreSamples,
      filterSamples,
      sampleBatch,
      filterStatus,
      filterText,
      profileAnalysesText,
      pageInfo,
      allChecked,
      toggleCheckAll,
      checkCheck,
      can_cancel,
      can_receive,
      can_reinstate,
      can_print,
      can_reject,
      can_copy_to,
      cancelSamples_,
      reInstateSamples_,
      receiveSamples_,
    };
  },
});
</script>
