<template>

  <div class="w-3/6 mt-4 py-4">
    <h5 class="mb-4">Add Analysis Request</h5>
      <form action="post" class="p-4 mb-8 bg-white">
        <div class="">

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Client Request ID</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.clientRequestId"
              placeholder="CRID ..."
            />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Clinical Data</span>
            <textarea
            cols="2"
              class="form-input mt-1 w-full"
              v-model="form.clinicalData"
              placeholder="Clinical Data ..."
            />
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Client</span>
            <input
              class="form-input mt-1 w-full"
              v-model="form.client.name"
              placeholder="Name ..."
              list="ice-cream-flavors"
              @change="getClientContacts()"
            />
            <datalist id="ice-cream-flavors" >
                <option value="" />
                <option v-for="client in clients" :key="client.uid" :value="client.name" :data-client="client"></option>
            </datalist>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
              <span class="text-gray-700 w-4/12">Client Contacts</span>
              <select 
              name="clientContacts" 
              id="clientContacts" 
              v-model="form.client.clientContact"
              class="form-input mt-1 block w-full">
                <option value=""></option>
                <option  
                v-for="contact in clientContacts"
                :key="contact.uid"
                :value="contact.uid" >{{ contact.firstName }} {{ contact.lastName }}</option>
            </select>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Priority</span>
            <input
              type="number"
              min="0"
              max="2"
              class="form-input mt-1 block w-full"
              v-model="form.priority"
            />
          </label>

        </div>

        <section id="samples">
            <hr>
            <div class="flex justify-between items-center py-2">
                <h5>Samples</h5>
                <button
                v-if="form.samples?.length !== 20"
                @click.prevent="addSample()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add Sample</button>
            </div>
            <hr class="mb-4">

            <div v-for="(sample, index) in form.samples" :key="index">
                <div class="flex items-center justify-between">
                    <div class="flex items-top gap-x-4">
                        <label class="flex flex-col whitespace-nowrap mb-2">
                          <span class="text-gray-700">Sample Type</span>
                            <select 
                            name="sampleTypes" 
                            id="sampleTypes" 
                            v-model="sample.sampleType"
                            class="form-input mt-1" >
                              <option value=""></option>
                              <option  
                              v-for="sampleType in sampleTypes"
                              :key="sampleType.uid"
                              :value="sampleType.uid" >{{ sampleType.name }}</option>
                          </select>
                        </label>

                        <label class="flex flex-col whitespace-nowrap mb-2">
                            <span class="text-gray-700">Analysis Profiles</span>
                            <select 
                            name="analysisProfiles" 
                            id="analysisProfiles" 
                            v-model="sample.profiles"
                            class="form-input mt-1" multiple>
                              <option value=""></option>
                              <option  
                              v-for="(profile, index) in analysesProfiles"
                              :key="profile.uid"
                              :value="profile.uid" >{{ profile.name }}</option>
                          </select>
                        </label>

                        <label class="flex flex-col whitespace-nowrap mb-2">
                            <span class="text-gray-700">Analysis Services</span>
                            <select 
                            name="analysesServices" 
                            id="analysesServices" 
                            v-model="sample.analyses"
                            class="form-input mt-1" multiple>
                              <option value=""></option>
                              <option  
                              v-for="(service, index) in analysesServices"
                              :key="service.uid"
                              :value="service.uid" >{{ service.name }}</option>
                          </select>
                        </label>
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
  </div>
</template>

<script lang="ts">

import { useMutation } from '@urql/vue';
import { defineComponent, ref, toRefs, reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes as SampleActionTypes } from '../../store/modules/sample';
import { ActionType } from '../../store/modules/analysis';
import { IAnalysisRequest, ISample } from '../../models/analysis';
import { ADD_ANALYSIS_SERVICE, EDIT_ANALYSIS_SERVICE, ADD_ANALYSIS_REQUEST  } from '../../graphql/analyses.mutations';
import { IPatient } from '../../models/patient';
import { ActionTypes as PatientActionTypes } from '../../store/modules/patient';
import { ActionTypes as ClientActionTypes } from '../../store/modules/client';
import { isNullOrWs } from '../../utils';

export default defineComponent({
  name: "add-sample",
  props: {
    patient: {
    type: Object
  }
  },
  setup(props) {    
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    let formTitle = ref('');
    let formAction = ref(true);
    let form = reactive({ ...({} as IAnalysisRequest), priority: 0 });
    let clientQuery = ref('');

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

    store.dispatch(SampleActionTypes.FETCH_SAMPLE_TYPES);

    let analysesParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"]
    });
    store.dispatch(ActionTypes.FETCH_ANALYSES_SERVICES, analysesParams);
    store.dispatch(ActionTypes.FETCH_ANALYSES_PROFILES);

    let clientParams = reactive({ 
      first: undefined, 
      after: "",
      text: "", 
      sortBy: ["name"]
    });
    store.dispatch(ClientActionTypes.FETCH_CLIENTS, clientParams);

    const patient = computed(() => store.getters.getPatient)
    const clients = computed(() => store.getters.getClients)

    const { executeMutation: createAnalysisRequest } = useMutation(ADD_ANALYSIS_REQUEST);

    function addAnalysesRequest(): void {
      createAnalysisRequest({ clientRequestId: form.clientRequestId, clientUid: form.client.uid, patientUid: form.patient.uid, samples: form.samples}).then((result) => {
      //  store.dispatch(SampleActionTypes.ADD_SAMPLES, result);
      });
      router.push({ name: "patient-detail", params: { patientUid: form.patient.uid }});
    }

    function addSample(): void {
      form.samples?.push(new Sample());
    }

    function removeSample(index): void {
        form.samples?.splice(index, 1);
    }

    function setSampleType(sample: ISample, event: Event): void {
      sample.sampleType = store.getters.getSampleTypeByName(event.target.value);
    }

    function FormManager(create: boolean, obj: IAnalysisCategory):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES ANALYSIS REQUEST";
      if (create) {
        let ar = new AnalysisRequest();
        ar.patient = patient.value;
        Object.assign(form, { ...ar });
      } else {
        Object.assign(form, { ...obj });
      }
    }

    function getClientContacts(): void {
      if(!isNullOrWs(form.client.name)) {
        const clt = store.getters.getClientByName(form.client.name);
        store.dispatch(ClientActionTypes.FETCH_CLIENT_CONTACTS, clt?.uid);
        form.client = clt;
      }
    }

    function saveForm(): void {
      form.patient = patient.value;
      const clt = store.getters.getClientByName(form.client?.name);
      form.client = clt;
      if (formAction.value === true) addAnalysesRequest();
    }

    return {
      analysesCategories: computed(() =>store.getters.getAnalysesCategories),
      sampleTypes: computed(() => store.getters.getSampleTypes),
      analysesProfiles,
      analysesServices,
      clients,
      patient,
      FormManager,
      form,
      formTitle,
      saveForm,
      addSample,
      removeSample,
      setSampleType,
      getClientContacts,
      clientContacts: computed(() => store.getters.getClientContacts),
    };
  },
});
</script>
