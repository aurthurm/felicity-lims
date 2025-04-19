<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { useRoute } from "vue-router";
import useApiUtil from "@/composables/api_util";
import useSampleComposable from "@/composables/samples";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ImpressSamplesMetaQuery, ImpressSamplesMetaQueryVariables, ImpressSamplesMetaDocument } from "@/graphql/operations/analyses.queries";
const LoadingMessage = defineAsyncComponent(
  () => import("@/components/ui/spinners/FelLoadingMessage.vue")
)
const JsonPreViewer = defineAsyncComponent(
  () => import("@/components/ui/FelJsonPreViewer.vue")
)

const { withClientQuery } = useApiUtil();

const route = useRoute();

const loadingMeta = ref(false);
const impressMeta = ref<any[]>([]);
const selectedMeta = ref<any>({});

const loadMeta = () => {
  loadingMeta.value = true;
  withClientQuery<ImpressSamplesMetaQuery, ImpressSamplesMetaQueryVariables>(ImpressSamplesMetaDocument,
    { uids: [route?.params?.sampleUid] },
    "impressReportsMeta"
  )
    .then((resp) => {
      impressMeta.value = resp;
    })
    .finally(() => {
      loadingMeta.value = false;
    });
}
// onMounted(() => loadMeta());
loadMeta()

const { downloadImpress } = useSampleComposable();
const impressDownloader = async (report_uid) => await downloadImpress(report_uid);
</script>

<template>
  <LoadingMessage v-if="loadingMeta" :message="'Loading your reports ...'" />
  <section v-else>
    <div v-if="impressMeta.length > 0" class="flex justify-start mt-4 mr-4">
      <ul class="">
        <li v-for="report in impressMeta" :key="report?.uid" class="mb-2 p-3 rounded-sm border w-96" :class="[
          { 'border-border bg-background': report?.uid !== selectedMeta?.uid },
          {
            'border-3 border-primary bg-muted': report?.uid === selectedMeta?.uid,
          },
        ]" @click="selectedMeta = report">
          <div class="flex justify-between items-center space-x-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-foreground truncat">
                {{ report.state }}
              </p>
              <p class="text-sm text-muted-foreground truncat">
                Generated on {{ report.createdAt }}
              </p>
              <!-- <FontAwesomeIcon class="text-destructive mr-2" icon="fa-message" />
                <FontAwesomeIcon class="text-destructive" icon="fa-envelope" /> -->
            </div>
            <span
              class="flex justify-center items-center animate-bounce h-8 w-8 rounded-full bg-background border border-border drop-shadow-sm"
              @click="impressDownloader(report.uid)">
              <FontAwesomeIcon class="text-accent" icon="fa-download" />
            </span>
          </div>
        </li>
      </ul>
      <div class="ml-4 w-full">
        <h5>Json Impress</h5>
        <hr class="mb-2" />
        <JsonPreViewer :data="selectedMeta" :wrapper="'max-h-96 overflow-y-scroll'" />
      </div>
    </div>
    <div v-else class="mt-4 text-destructive">This sample has no Impress Reports</div>
  </section>
</template>
