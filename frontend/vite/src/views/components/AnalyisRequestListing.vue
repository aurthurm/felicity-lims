<template>
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                    <tr>
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
                <tbody class="bg-white" v-for="request in analysisRequests" :key="request.uid">
                        <tr class="bg-gray-200">
                            <td colspan="10" class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                <div class="flex items-center">
                                    <div class="text-sm leading-5 text-gray-800">{{ request.clientRequestId }}</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-for="sample in request.samples" :key="sample.uid" >
                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                                <span v-if="sample.priority! < 1"
                                :class="[
                                    'font-small',
                                    { 'text-red-700': sample.priority! == 0 },
                                ]">
                                    <i class="fa fa-star"></i>
                                </span>
                            </td>
                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                            <div class="flex items-center">
                                <div class=" font-semibold">
                                    <router-link :to="{ name: 'sample-detail', params: { patientUid: request.patient?.uid, sampleUid: sample?.uid  }}">{{ sample.sampleId }}</router-link>
                                </div>
                            </div>
                            </td>
                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                            <div class="text-sm leading-5 text-blue-900">{{ profileAnalysesText(sample.profiles!, sample.analyses!) }}</div>
                            </td>
                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                            <div class="text-sm leading-5 text-blue-900">{{ request.patient?.firstName }} {{ request.patient?.lastName }}</div>
                            </td>
                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                            <div class="text-sm leading-5 text-blue-900">{{ request.patient?.clientPatientId }}</div>
                            </td>
                            <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                            <div class="text-sm leading-5 text-blue-900">{{ request.client?.name }}</div>
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

</template>

<script setup lang="ts">
    import { computed, toRefs, watch} from 'vue'
    import { IAnalysisRequest } from '../../models/analysis';

    import { useSampleStore } from '../../stores'

    const props = defineProps({
        target: String,
        targetUid: Number
    })

    const { targetUid, target } = toRefs(props);

    const sampleStore = useSampleStore();

    if(target?.value==='patient-samples') sampleStore.fetchAnalysisRequestsForPatient(targetUid?.value);
    if(target?.value==='client-samples') sampleStore.fetchAnalysisRequestsForPatient(targetUid?.value);

    const analysisRequests = computed<IAnalysisRequest[]>(() => sampleStore.getAnalysisRequests);

    watch(() => props.targetUid, (uid, prev) => {
        if(target?.value==='patient-samples') sampleStore.fetchAnalysisRequestsForPatient(uid);
        if(target?.value==='client-samples') sampleStore.fetchAnalysisRequestsForPatient(uid);
    })

    function profileAnalysesText(profiles: any[], analyses: any[]): string {
        let names: string[] = [];
        profiles.forEach(p => names.push(p.name));
        analyses.forEach(a => names.push(a.name));
        return names.join(', ');
    }
        
</script>