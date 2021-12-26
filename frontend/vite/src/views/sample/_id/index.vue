<template>

  <div class="flex justify-between">
    <h3 class="my-4 font-bold">Sample Detail</h3>
    <router-link
      v-if="sample?.analysisRequest?.patient?.uid"
     :to="{ name: 'patient-detail', params: { patientUid: sample?.analysisRequest?.patient?.uid } }" 
      class="p-2 my-2 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100">
      ... other samples
    </router-link>
  </div>

  <hr>

  <div class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4" >
    <div class="grid grid-cols-12 gap-3">
      <!-- Summary Column -->
      <div class="col-span-12 px-3 sm:px-0">
        <div class="mb-2 flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold">
          <div>
              <span v-if="sample?.priority! < 1"
                :class="[
                    'font-small',
                    { 'text-red-700': sample?.priority! < 1 },
                ]">
                    <i class="fa fa-star"></i>
              </span>
              {{ sample?.sampleId }} 
              <!-- <button
                class="ml-4 text-xs inline-flex items-center justify-center w-6 h-6 mr-2 border-blue-500 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
              >
                <i class="fa fa-pen"></i>
              </button> -->
              <span v-if="sample?.analysisRequest?.patient?.uid && childSample?.uid">
                  <font-awesome-icon icon="angle-double-right" class="mx-2" />
                  <router-link :to="{ name: 'sample-detail', params: { patientUid: sample?.analysisRequest?.patient?.uid, sampleUid: childSample?.uid } }" 
                    class="p-2 my-2 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100">
                    {{ childSample?.sampleId }}
                  </router-link>
              </span>
            </div>
          <span>{{ profileAnalysesText(sample?.profiles!, sample?.analyses!) }}</span>
          <!-- <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ sample?.status }}</button> -->
          <div >
            <div
              @click="dropdownOpen = !dropdownOpen"
              class="hidden md:block md:flex md:items-center ml-2 mt-2" >
              <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ sample?.status }}</button>
              <div class="ml-2"><font-awesome-icon icon="chevron-down" class="text-gray-400" /></div>
            </div>
            <div
              v-show="dropdownOpen"
              @click="dropdownOpen = false"
              class="fixed inset-0 h-full w-full z-10" ></div>
            <div
              v-show="dropdownOpen"
              class="absolute mt-4 py-0 bg-gray-300 rounded-md shadow-xl z-20" >
              <div
                v-show="canReceive"
                @click="receiveSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-blue-400 hover:text-white"
                >Receive</div>
              <div
                v-show="canVerify"
                @click="verifySample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-blue-400 hover:text-white"
                >Verify</div>
              <div
                v-show="canReject"
                @click="rejectSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-red-400 hover:text-white"
                >Reject</div>
              <div
                v-show="canCancel"
                @click="cancelSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-red-400 hover:text-white"
                >Cancel</div>
              <div
                v-show="canReinstate"
                @click="reInstateSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-red-400 hover:text-white"
                >Reinstate</div>
              <div
                v-show="canInvalidate"
                @click="invalidateSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-gray-400 hover:text-white"
                >Invalidate</div>
            </div>
          </div>
        </div>
        <hr />
        <div class="grid grid-cols-2 mt-2">
          <div class="col-span-1">
            <!-- Client Details -->
            <div class="flex">
              <span class="text-gray-800 text-sm font-semibold w-1/6">Requests:</span>
              <span class="text-gray-600 text-sm md:text-md">{{ profileAnalysesText(sample?.profiles!, sample?.analyses!) }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-800 text-sm font-semibold w-1/6">Client Request ID:</span>
              <span class="text-gray-600 text-sm md:text-md">{{ sample?.analysisRequest?.clientRequestId }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-800 text-sm font-semibold w-1/6">Sample Type:</span>
              <span class="text-gray-600 text-sm md:text-md">{{ sample?.sampleType!.name }}</span>
            </div>
          </div>
          <div class="col-span-1">
            <!-- Communication Details -->
            <div class="flex">
              <span class="text-gray-800 text-sm font-semibold w-1/6">Client:</span>
              <span class="text-gray-600 text-sm md:text-md">{{ sample?.analysisRequest?.client?.name }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-800 text-sm font-semibold w-1/6">Cliet Contact:</span>
              <span class="text-gray-600 text-sm md:text-md">Sister in Charge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div 
    v-show="sample?.status ==='rejected'"
    class="bg-red-200 rounded-sm shadow-md duration-500 px-4 sm:px-6 md:px-2 py-4 my-4" >
    <!-- <h3 clas="font-bold text-gray-800 text-md">This sample was rejected because of the following reason(s):</h3> -->
    <ul>
      <li v-for="reason in sample?.rejectionReasons">{{ reason.reason }}</li>
    </ul>
  </div>


  <router-view />

</template>

<script lang="ts">
import { defineComponent, computed, toRefs, reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { useQuery } from '@urql/vue';
import { IAnalysisProfile, IAnalysisService, ISample } from '../../../models/analysis';
import useSampleComposable from '../../../modules/samples';

import { GET_SAMPLE_BY_PARENT_ID } from '../../../graphql/analyses.queries';
import { ActionTypes } from '../../../store/modules/sample';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: "sample-single",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    store.dispatch(ActionTypes.RESET_SAMPLE);

    const { cancelSamples, reInstateSamples, receiveSamples, invalidateSamples, verifySamples }  = useSampleComposable();

    const state = reactive({
      dropdownOpen: false,
      sample: computed<ISample>(() => store.getters.getSample),
      childSample: {} as ISample,
    }); 

    const sampleAcquire = useQuery({
      query: GET_SAMPLE_BY_PARENT_ID,
      variables: { parentId: +route.params.sampleUid },
      requestPolicy: 'network-only',
    });

    watch(() => state.sample, (sample, _) => {
      if(!sample) return;
      if(sample.status !== 'invalidated') {
        state.childSample = {} as ISample
        return
      };
      sampleAcquire.executeQuery({requestPolicy: 'network-only'}).then(resp => {
        const samples = resp.data.value?.sampleByParentId;
        if(samples?.length > 0) {
          state.childSample = samples[0]
        };
        
      });
    })

    function profileAnalysesText(profiles: IAnalysisProfile[], analyses: IAnalysisService[]): string {
        let names: string[] = [];
        profiles?.forEach(p => names.push(p.name!));
        analyses?.forEach(a => names.push(a.name!));
        return names.join(', ');
    }

    return { 
        ...toRefs(state),
        profileAnalysesText,
        canReceive: computed(() => {
          if(["due"].includes(state.sample?.status?.toLowerCase())) return true;
          return false
        }),
        receiveSample: async () => receiveSamples([state.sample?.uid]),
        canCancel: computed(() => {
          if(["received", "due"].includes(state.sample?.status?.toLowerCase())) return true;
          return false
        }),
        cancelSample: async () => cancelSamples([state.sample?.uid]),
        canReinstate: computed(() => {
          if(["cancelled"].includes(state.sample?.status?.toLowerCase())) return true;
          return false
        }),
        reInstateSample: async () => reInstateSamples([state.sample?.uid]),
        canVerify: computed(() => {
          if(state.sample?.status?.toLowerCase() === "to_be_verified") return true;
          return false
        }),
        verifySample: async () => verifySamples([state.sample?.uid]),
        canInvalidate: computed(() => {
          if(state.sample?.status?.toLowerCase() === "published") return true;
          return false
        }),
        invalidateSample: async () => invalidateSamples([state.sample?.uid]).then((res: ISample[]) => {
          let inv = res?.filter(s => s.uid !== state.sample?.uid)
          if(inv.length > 0) state.childSample = inv[0];

        }),
        canReject: computed(() => {
          if(["received", "due"].includes(state.sample?.status?.toLowerCase())) return true;
          return false
        }),
        rejectSample: async () =>  router.push({ name: "reject-samples", params: { samples: JSON.stringify([state.sample]) }})
    };
  },
});
</script>