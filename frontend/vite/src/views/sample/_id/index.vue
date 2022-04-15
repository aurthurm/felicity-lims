<script setup lang="ts">
  import LoadingMessage from "../../../components/Spinners/LoadingMessage.vue"
  import { storeToRefs } from "pinia"
  import { computed, reactive, watch } from 'vue';
  import { IAnalysisProfile, IAnalysisService, ISample } from '../../../models/analysis';
  import { useSampleComposable } from '../../../composables';
  import { useSampleStore } from '../../../stores';
  import { useRoute, useRouter } from 'vue-router';

    const sampleStore = useSampleStore();
    const route = useRoute();
    const router = useRouter();

    sampleStore.resetSample();

    const { cancelSamples, reInstateSamples, receiveSamples, invalidateSamples, verifySamples }  = useSampleComposable();

    const state = reactive({
      dropdownOpen: false,
    }); 

    const { sample, fetchingSample, childSample } = storeToRefs(sampleStore)

    sampleStore.fetchSampleByUid(+route.params.sampleUid)

    watch(() => sample, (sampleIn, _) => {
      if(!sampleIn) return;
      if(sampleIn?.value?.status !== 'invalidated') {
        sampleStore.resetChildSample()
        return
      };
      sampleStore.fetchSampleByParentId(+route.params.sampleUid)
    })

    function profileAnalysesText(profiles: IAnalysisProfile[], analyses: IAnalysisService[]): string {
        let names: string[] = [];
        profiles?.forEach(p => names.push(p.name!));
        analyses?.forEach(a => names.push(a.name!));
        return names.join(', ');
    }

    const canReceive = computed(() => {
      if(["due"].includes(sample?.value?.status?.toLowerCase()!)) return true;
      return false
    })

    const receiveSample = async () => receiveSamples([sample?.value?.uid!]),
    canCancel = computed(() => {
      if(["received", "due"].includes(sample?.value?.status?.toLowerCase()!)) return true;
      return false
    })

    const cancelSample = async () => cancelSamples([sample?.value?.uid!]),
    canReinstate = computed(() => {
      if(["cancelled"].includes(sample?.value?.status?.toLowerCase()!)) return true;
      return false
    })

    const reInstateSample = async () => reInstateSamples([sample?.value?.uid!]),
    canVerify = computed(() => {
      if(sample?.value?.status?.toLowerCase() === "to_be_verified") return true;
      return false
    })

    const verifySample = async () => verifySamples([sample?.value?.uid!]),
    canInvalidate = computed(() => {
      if(sample?.value?.status?.toLowerCase() === "published") return true;
      return false
    })

    const invalidateSample = async () => invalidateSamples([sample?.value?.uid!]).then((res: ISample[]) => {
      let inv = res?.filter(s => s.uid !== sample?.value?.uid)
      if(inv.length > 0) sampleStore.setChildSample(inv[0]);
    })

    const canReject = computed(() => {
      if(["received", "due"].includes(sample?.value?.status?.toLowerCase()!)) return true;
      return false
    })

    const rejectSample = async () =>  router.push({ name: "reject-samples", params: { samples: JSON.stringify([sample?.value]) }})
</script>


<template>

  <div class="flex justify-between">
    <h3 class="my-4 font-bold">Sample Detail</h3>
    <router-link
      v-if="sample?.analysisRequest?.patient?.uid"
     :to="{ name: 'patient-detail', params: { patientUid: sample?.analysisRequest?.patient?.uid } }" 
      class="p-2 my-2 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100">
      ... other samples
    </router-link>
  </div>

  <hr>

  <div class="bg-white rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4" >
    <div v-if="fetchingSample" class="py-4 text-center">
      <LoadingMessage message="Fetching sample details ..."/>
    </div>
    <div class="grid grid-cols-12 gap-3" v-else>
      <!-- Summary Column -->
      <div class="col-span-12 px-3 sm:px-0">
        <div class="mb-2 flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold">
          <div>
              <span v-if="sample?.priority! < 1"
                :class="[
                    'font-small',
                    { 'text-orange-600': sample?.priority! < 1 },
                ]">
                    <i class="fa fa-star"></i>
              </span>
              {{ sample?.sampleId }} 
              <!-- <button
                class="ml-4 text-xs inline-flex items-center justify-center w-6 h-6 mr-2 border-sky-800 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
              >
                <i class="fa fa-pen"></i>
              </button> -->
              <span v-if="sample?.analysisRequest?.patient?.uid && childSample?.uid">
                  <font-awesome-icon icon="angle-double-right" class="mx-2" />
                  <router-link :to="{ name: 'sample-detail', params: { patientUid: sample?.analysisRequest?.patient?.uid, sampleUid: childSample?.uid } }" 
                    class="p-2 my-2 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100">
                    {{ childSample?.sampleId }}
                  </router-link>
              </span>
            </div>
          <span>{{ profileAnalysesText(sample?.profiles!, sample?.analyses!) }}</span>
          <!-- <button type="button" class="bg-sky-800 text-white p-1rounded-smleading-none">{{ sample?.status }}</button> -->
          <div >
            <div
              @click="state.dropdownOpen = !state.dropdownOpen"
              class="hidden md:block md:flex md:items-center ml-2 mt-2" >
              <button type="button" class="bg-sky-800 text-white px-2 py-1 rounded-sm leading-none">{{ sample?.status }}</button>
              <div class="ml-2"><font-awesome-icon icon="chevron-down" class="text-gray-400" /></div>
            </div>
            <div
              v-show="state.dropdownOpen"
              @click="state.dropdownOpen = false"
              class="fixed inset-0 h-full w-full z-10" ></div>
            <div
              v-show="state.dropdownOpen"
              class="absolute mt-4 py-0 bg-gray-300 rounded-sm shadow-xl z-20" >
              <div
                v-show="canReceive"
                @click="receiveSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white"
                >Receive</div>
              <div
                v-show="canVerify"
                @click="verifySample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-sky-800 hover:text-white"
                >Verify</div>
              <div
                v-show="canReject"
                @click="rejectSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-orange-600 hover:text-white"
                >Reject</div>
              <div
                v-show="canCancel"
                @click="cancelSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-orange-600 hover:text-white"
                >Cancel</div>
              <div
                v-show="canReinstate"
                @click="reInstateSample()"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-orange-600 hover:text-white"
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
    class="bg-orange-600 rounded-sm shadow-md duration-500 px-4 sm:px-6 md:px-2 py-4 my-4" >
    <!-- <h3 clas="font-bold text-gray-800 text-md">This sample was rejected because of the following reason(s):</h3> -->
    <ul>
      <li v-for="reason in sample?.rejectionReasons">{{ reason.reason }}</li>
    </ul>
  </div>


  <router-view />

</template>
