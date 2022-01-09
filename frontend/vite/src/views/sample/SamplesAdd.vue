<template>

  <div class="w-3/6 mt-4 py-4">
    <h5 class="mb-4">Add Analysis Request</h5>
      <form action="post" class="p-4 mb-8 bg-white" @submit.prevent="submitARForm">
        <div class="">

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Client Request ID</span>
            <div class="w-full">
              <input
                class="form-input mt-1 block w-full"
                v-model="clientRequestId"
                placeholder="CRID ..."
              /><div class="text-red-700 w-4/12">{{ errors.clientRequestId }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Clinical Data</span>
            <div class="w-full">
              <textarea
              cols="2"
                class="form-input mt-1 w-full"
                v-model="clinicalData"
                placeholder="Clinical Data ..."
              />
              <div class="text-red-700 w-4/12">{{ errors.clinicalData }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Client</span>
            <div class="w-full">
              <input
                class="form-input mt-1 w-full"
                v-model="clientName"
                placeholder="Name ..."
                list="ice-cream-flavors"
                @change="getClientContacts()"
              />
              <datalist id="ice-cream-flavors" >
                  <option value="" />
                  <option v-for="client in clients" :key="client.uid" :value="client.name" :data-client="client"></option>
              </datalist>
              <div class="text-red-700 w-4/12">{{ errors.clientName }}</div>
            </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
              <span class="text-gray-700 w-4/12">Client Contacts</span>
              <div class="w-full">
                <select 
                  name="clientContacts" 
                  id="clientContacts" 
                  v-model="clientContactUid"
                  class="form-input mt-1 block w-full">
                    <option value=""></option>
                    <option  
                    v-for="contact in clientContacts"
                    :key="contact.uid"
                    :value="contact.uid" >{{ contact.firstName }} {{ contact.lastName }}</option>
                </select>
                <div class="text-red-700 w-4/12">{{ errors.clientContactUid }}</div>
              </div>
          </label>

          <label class="flex whitespace-nowrap mb-2 w-full">
            <span class="text-gray-700 w-4/12">Priority</span>
            <div class="w-full">
              <input
                type="number"
                min="0"
                max="2"
                class="form-input mt-1 block w-full"
                v-model="priority"
              />
              <div class="text-red-700 w-4/12">{{ errors.priority }}</div>
            </div>
          </label>

        </div>

        <section id="samples">
            <hr>
            <div class="flex justify-between items-center py-2">
                <h5>Samples</h5>
                <span class="text-red-700">{{ errors.samples }}</span>
                <button
                v-if="samples?.length !== 20"
                @click.prevent="addSample()"
                class="px-2 py-1 mr-2 border-green-500 border text-green-500 rounded transition duration-300 hover:bg-green-700 hover:text-white focus:outline-none">Add Sample</button>
            </div>
            <hr class="mb-4">

            

            <div v-for="(sample, index) in samples" :key="index">
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
          type="submit"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
  </div>
</template>

<script setup lang="ts">
  import { useMutation } from '@urql/vue';
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { ActionTypes as SampleActionTypes } from '../../store/modules/sample';
  import { IAnalysisProfile, IAnalysisRequest, IAnalysisService, ISample, ISampleType } from '../../models/analysis';
  import { ADD_ANALYSIS_REQUEST  } from '../../graphql/analyses.mutations';
  import { ActionTypes } from '../../store/modules/analysis';
  import { ActionTypes as ClientActionTypes } from '../../store/modules/client';
  import { isNullOrWs } from '../../utils';

  import { useField, useForm } from 'vee-validate';
  import { object, string, array, number } from 'yup';
  import { IClient } from '../../models/client';
  import useNotifyToast from '../../modules/alert_toast'
  
  const store = useStore();
  const router = useRouter();

  const { gqlResponseHandler, swalError } = useNotifyToast()

  // Patient
  let patient = computed(() => store.getters.getPatient)
 
  // Clients, Cient Contacts
  let clientParams = reactive({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  });
  store.dispatch(ClientActionTypes.FETCH_CLIENTS, clientParams);

  const clients = computed(() => store.getters.getClients)

  const client = ref({} as IClient);

  function getClientContacts(): void {
    if(!isNullOrWs(clientName.value)) {
      const clt = store.getters.getClientByName(clientName.value);
      store.dispatch(ClientActionTypes.FETCH_CLIENT_CONTACTS, clt?.uid);
      client.value = clt;
    }
  }
  const clientContacts = computed(() => store.getters.getClientContacts);

  // Sample Types
  store.dispatch(SampleActionTypes.FETCH_SAMPLE_TYPES);
  const sampleTypes = computed(() => store.getters.getSampleTypes);

  // Analysis Services
  let analysesParams = reactive({ 
    first: undefined, 
    after: "",
    text: "", 
    sortBy: ["name"]
  });
  store.dispatch(ActionTypes.FETCH_ANALYSES_SERVICES, analysesParams);

  const analysesServices = computed<IAnalysisService[]>(() => {
    const services: IAnalysisService[] = store.getters.getAnalysesServicesSimple;
    let s = new Set<IAnalysisService>();
    services.forEach((service: IAnalysisService, index: number) => {
      if(service.profiles?.length === 0){
        s.add(service)
      }
    })
    return [...s];
  });

  // Analysis Profiles
  store.dispatch(ActionTypes.FETCH_ANALYSES_PROFILES);
  const analysesProfiles = computed(() =>store.getters.getAnalysesProfiles);

  // Analysis Request Form
  const arSchema = object({
    clientRequestId: string().required("Client Request ID is Required"),
    clinicalData: string().nullable(),
    clientName: string().required("Client is Required"),
    clientContactUid: number().required("Client Contact is Required"),
    samples: array().required().min(1, "Add at least 1 sample"),
    priority: number(),
  })

  const { handleSubmit, errors } = useForm({
    validationSchema: arSchema,
    initialValues: {
      priority: 0,
      samples: [],
    }
  });

  const { value: clientRequestId } = useField('clientRequestId');
  const { value: clinicalData } = useField<string>('clinicalData');
  const { value: clientName } = useField('clientName');
  const { value: clientContactUid } = useField('clientContactUid');
  const { value: priority } = useField('priority');
  const { value: samples } = useField<ISample[]>('samples');

  const submitARForm = handleSubmit((values) => {

    for(let sample of values.samples || []) {
      if(typeof sample?.sampleType !== 'number') {
        swalError("Samples must have sample types");
        return;
      }
      if(sample?.analyses?.length <= 0 && sample?.profiles?.length <= 0) {
        swalError("Samples must have either profiles/analyses or both");
        return;
      }
    }

    addAnalysesRequest(values as any)
  });

  // Analysis Request Add
  const { executeMutation: arCreator } = useMutation(ADD_ANALYSIS_REQUEST);

  function addAnalysesRequest(request: IAnalysisRequest): void {
    const payload = { 
      patientUid: patient.value?.uid, 
      clientRequestId: request.clientRequestId, 
      clinicalData: request.clinicalData, 
      clientUid: client.value?.uid, 
      clientContactUid: request.clientContactUid, 
      samples: request.samples
    }
    arCreator({payload}).then((result) => {
      const data = gqlResponseHandler(result)
      if(data) store.dispatch(SampleActionTypes.ADD_ANALYSIS_REQUEST, data.createAnalysisRequest);
    });
    router.push({ name: "patient-detail", params: { patientUid: patient.value?.uid }});
  }

  function addSample(): void {
    const sample = {    
      sampleType: {} as ISampleType,
      profiles: [] as IAnalysisProfile[],
      analyses: [] as IAnalysisService[],
    } as ISample
    samples.value.push(sample);
  }

  function removeSample(index: number): void {
    samples.value.splice(index, 1);
  }


</script>
