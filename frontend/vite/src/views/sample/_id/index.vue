<template>

  <div class="flex justify-between">
    <h3 class="my-4 font-bold">Sample Detail</h3>
    <router-link
      v-if="sample?.analysisrequest?.patient?.uid"
     :to="{ name: 'patient-detail', params: { patientUid: sample?.analysisrequest?.patient?.uid } }" 
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
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-blue-400 hover:text-white"
                >Receive</div>
              <div
                v-show="canVerify"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-blue-400 hover:text-white"
                >Verify</div>
              <div
                v-show="canReject"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-red-400 hover:text-white"
                >Reject</div>
              <div
                v-show="canCancel"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-red-400 hover:text-white"
                >Cancel</div>
              <div
                v-show="canReinstate"
                class="no-underline text-gray-900 py-0 opacity-60 px-4 border-b border-transparent hover:opacity-100 md:hover:border-grey-dark hover:bg-red-400 hover:text-white"
                >Reinstate</div>
              <div
                v-show="canInvalidate"
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
              <span class="text-gray-600 text-sm md:text-md">{{ sample?.analysisrequest?.clientRequestId }}</span>
            </div>
            <div class="flex">
              <span class="text-gray-800 text-sm font-semibold w-1/6">Sample Type:</span>
              <span class="text-gray-600 text-sm md:text-md">{{ sample?.sampletype!.name }}</span>
            </div>
          </div>
          <div class="col-span-1">
            <!-- Communication Details -->
            <div class="flex">
              <span class="text-gray-800 text-sm font-semibold w-1/6">Client:</span>
              <span class="text-gray-600 text-sm md:text-md">{{ sample?.analysisrequest?.client?.name }}</span>
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

  <router-view />

</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import { IAnalysisProfile, IAnalysisService, ISample } from '../../../models/analysis';

export default defineComponent({
  name: "sample-single",
  setup() {
    const dropdownOpen = ref(false);
    const store = useStore();

    const sample = computed<ISample>(() => store.getters.getSample)

    function profileAnalysesText(profiles: IAnalysisProfile[], analyses: IAnalysisService[]): string {
        let names: string[] = [];
        profiles?.forEach(p => names.push(p.name!));
        analyses?.forEach(a => names.push(a.name!));
        return names.join(', ');
    }

    function FormManager(create: boolean): void {
    }
    // Sample Actions
    

    return { 
        dropdownOpen,
        sample,
        profileAnalysesText,
        FormManager,
        canReceive: computed(() => {
          if(["due"].includes(sample.value?.status?.toLowerCase()!)) return true;
          return false
        }),
        canCancel: computed(() => {
          if(["received", "due"].includes(sample.value?.status?.toLowerCase()!)) return true;
          return false
        }),
        canReinstate: computed(() => {
          if(["cancelled"].includes(sample.value?.status?.toLowerCase()!)) return true;
          return false
        }),
        canVerify: computed(() => { // all anlytes must be verified first
          if(sample.value?.status?.toLowerCase() === "to_be_verified") return true;
          return false
        }),
        canInvalidate: computed(() => { // only for published a.k.a printed
          if(sample.value?.status?.toLowerCase() === "published") return true;
          return false
        }),
        canReject: computed(() => {
          if(["received", "due"].includes(sample.value?.status?.toLowerCase()!)) return true;
          return false
        }),
    };
  },
});
</script>