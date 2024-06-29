<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import { useApiUtil } from "@/composables";
import { GET_ANALYSIS_RESULT_MUTATION } from "@/graphql/operations/analyses.queries";
import { IResultMutation } from "@/models/analysis";

const FelAuditLog = defineAsyncComponent(
  () => import("@/components/audit/FelAuditLog.vue")
)
const FelDataTable = defineAsyncComponent(
  () => import("@/components/ui/datatable/FelDataTable.vue")
)
const props = defineProps(["analysisResultesultUid"]);

const { withClientQuery } = useApiUtil();

const mutations = ref<IResultMutation[] | null>(null);

onMounted(async () => {
    await withClientQuery(GET_ANALYSIS_RESULT_MUTATION, { resultUid: props.analysisResultesultUid }, 'resultMutationByResultUid').then(
        payload => mutations.value = payload
);
});

const columns = [
  {
    name: "Before",
    value: "before",
    sortable: false,
    hidden: false,
  },
  {
    name: "After",
    value: "after",
    sortable: false,
    hidden: false,
  },
  {
    name: "Mutation",
    value: "mutation",
    sortable: false,
    hidden: false,
  },
  {
    name: "Date",
    value: "date",
    sortable: false,
    hidden: false,
  },
]
</script>

<template>
    <h4 class="mt-4 font-bold text-xl text-gray-500">Result Mutations</h4>
    <hr class="mb-2">
    <FelDataTable v-if="(mutations?.length ?? 0) > 0"
    :columns="columns"
    :data="mutations || []"
    :toggleColumns="false"
    />
    <span v-else>No Mutations for this result</span>
    <h4 class="mt-4 font-bold text-xl text-gray-500">Result Audit Log</h4>
    <hr>
    <FelAuditLog targetType="analysis_result" :targetId="analysisResultesultUid" />
</template>
