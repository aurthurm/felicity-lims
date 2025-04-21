<script setup lang="ts">
  import { reactive, computed } from 'vue';
  import { RejectionReasonType } from '@/types/gql';
  import { AddRejectionReasonDocument, AddRejectionReasonMutation, AddRejectionReasonMutationVariables,
    EditRejectionReasonDocument, EditRejectionReasonMutation, EditRejectionReasonMutationVariables } from '@/graphql/operations/analyses.mutations';

  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';

  const analysisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()

  const state = reactive({
    showModal: false,
    formTitle: '',
    form: {} as RejectionReasonType,
    formAction: false,
  })
  
  analysisStore.fetchRejectionReasons()
  const rejectionReasons = computed(() => analysisStore.getRejectionReasons)

  function addRejectionReason(): void {
    withClientMutation<AddRejectionReasonMutation, AddRejectionReasonMutationVariables>(AddRejectionReasonDocument, { reason: state.form.reason }, "createRejectionReason")
    .then((result) => analysisStore.addRejectionReason(result));
  }

  function editRejectionReason(): void {
    withClientMutation<EditRejectionReasonMutation, EditRejectionReasonMutationVariables>(EditRejectionReasonDocument, { uid: state.form.uid, reason: state.form.reason }, "updateRejectionReason")
    .then((result) => analysisStore.updateRejectionReason(result));
  }

  function FormManager(create: boolean, obj: RejectionReasonType = {} as RejectionReasonType):void {
    state.formAction = create;
    state.showModal = true;
    state.formTitle = (create ? 'CREATE' : 'EDIT') + ' ' + "REJECTION REASON";
    if (create) {
      state.form = {} as RejectionReasonType
    } else {
      state.form = { ... obj };
    }
  }

  function saveForm():void {
    if (state.formAction === true) addRejectionReason();
    if (state.formAction === false) editRejectionReason();
    state.showModal = false;
  }
</script>

<template>
    <div>
      <fel-heading title="Rejection Reasons">
        <fel-button @click="FormManager(true)">Add Rejection Reason</fel-button>
      </fel-heading>

        <div class="rounded-md bg-card p-6 shadow-sm">
          <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Reason</th>
                    <th class="px-4 py-2 border-b border-border"></th>
                </tr>
                </thead>
                <tbody class="bg-card">
                <tr v-for="rejection in rejectionReasons" :key="rejection?.uid" class="hover:bg-accent/50">
                    <td class="px-4 py-2 whitespace-no-wrap border-b border-border">
                      <div class="text-sm text-foreground">{{ rejection?.reason }}</div>
                    </td>
                    <td class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                        <button 
                          @click="FormManager(false, rejection)" 
                          class="px-2 py-1 mr-2 border border-border bg-background text-foreground transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring hover:bg-accent hover:text-accent-foreground"
                        >
                          Edit
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
          </div>
        </div>
    </div>

    <!-- Rejection Reason Form Modal -->
  <fel-modal v-if="state.showModal" @close="state.showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ state.formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-6 space-y-6">
        <div class="space-y-4">
          <label class="space-y-2">
            <span class="text-sm font-medium text-muted-foreground">Rejection Reason</span>
            <input
              class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              v-model="state.form.reason"
              placeholder="Reason ..."
            />
          </label>
        </div>

        <div class="pt-4">
          <button
            type="button"
            @click.prevent="saveForm()"
            class="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Save Form
          </button>
        </div>
      </form>
    </template>
  </fel-modal>

</template>

