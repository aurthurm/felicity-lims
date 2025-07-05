<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { useRoute } from "vue-router";
import useApiUtil from "@/composables/api_util";
import useSampleComposable from "@/composables/samples";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ImpressSamplesMetaQuery, ImpressSamplesMetaQueryVariables, ImpressSamplesMetaDocument } from "@/graphql/operations/analyses.queries";
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
    { uids: [route?.params?.sampleUid as string] },
    "impressReportsMeta"
  )
    .then((resp) => {
      impressMeta.value = resp as any[];
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
  <div class="space-y-6">
    <fel-loader v-if="loadingMeta" :message="'Loading your reports ...'" />
    
    <section v-else class="space-y-6">
      <div v-if="impressMeta.length > 0" class="grid grid-cols-12 gap-6">
        <div class="col-span-4">
          <ul class="space-y-4">
            <li 
              v-for="report in impressMeta" 
              :key="report?.uid" 
              class="bg-background rounded-lg shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
              :class="[
                { 'border border-border': report?.uid !== selectedMeta?.uid },
                { 'border-2 border-primary bg-primary/5': report?.uid === selectedMeta?.uid },
              ]"
              @click="selectedMeta = report"
            >
              <div class="p-4 flex items-center justify-between space-x-4">
                <div class="flex-1 min-w-0 space-y-1">
                  <p class="font-medium text-foreground truncate">
                    {{ report.state }}
                  </p>
                  <p class="text-sm text-muted-foreground truncate">
                    Generated on {{ report.createdAt }}
                  </p>
                </div>
                
                <button
                  @click="impressDownloader(report.uid)"
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-background border border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Download report"
                >
                  <FontAwesomeIcon icon="fa-download" />
                </button>
              </div>
            </li>
          </ul>
        </div>

        <div class="col-span-8 bg-background rounded-lg shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h5 class="text-lg font-semibold text-foreground">Json Impress</h5>
          </div>
          
          <div class="border-t border-border" />
          
          <JsonPreViewer 
            :data="selectedMeta" 
            :wrapper="'max-h-[calc(100vh-300px)] overflow-y-auto rounded-md bg-muted/50 p-4'" 
          />
        </div>
      </div>
      
      <div 
        v-else 
        class="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm"
      >
        This sample has no Impress Reports
      </div>
    </section>
  </div>
</template>
