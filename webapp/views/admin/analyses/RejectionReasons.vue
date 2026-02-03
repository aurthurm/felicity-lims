<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { RejectionReasonType } from '@/types/gql';
  import { AddRejectionReasonDocument, AddRejectionReasonMutation, AddRejectionReasonMutationVariables,
    EditRejectionReasonDocument, EditRejectionReasonMutation, EditRejectionReasonMutationVariables } from '@/graphql/operations/analyses.mutations';

  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";

import PageHeading from "@/components/common/PageHeading.vue"
  const analysisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()

  const showModal = ref(false);
  const formTitle = ref('');
  const formAction = ref(false);
  const currentUid = ref<string | null>(null);

  const rejectionSchema = yup.object({
    reason: yup.string().trim().required('Reason is required'),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: rejectionSchema,
    initialValues: {
      reason: '',
    },
  });

  analysisStore.fetchRejectionReasons()
  const rejectionReasons = computed(() => analysisStore.getRejectionReasons)

  function addRejectionReason(payload: { reason: string }): void {
    withClientMutation<AddRejectionReasonMutation, AddRejectionReasonMutationVariables>(AddRejectionReasonDocument, payload, "createRejectionReason")
    .then((result) => analysisStore.addRejectionReason(result));
  }

  function editRejectionReason(payload: { reason: string }): void {
    if (!currentUid.value) return;
    withClientMutation<EditRejectionReasonMutation, EditRejectionReasonMutationVariables>(EditRejectionReasonDocument, { uid: currentUid.value, ...payload }, "updateRejectionReason")
    .then((result) => analysisStore.updateRejectionReason(result));
  }

  function FormManager(create: boolean, obj: RejectionReasonType = {} as RejectionReasonType):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "REJECTION REASON";
    if (create) {
      currentUid.value = null;
      resetForm({ values: { reason: '' } });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({ reason: obj.reason ?? '' });
    }
  }

  const saveForm = handleSubmit((values) => {
    const payload = { reason: values.reason };
    if (formAction.value === true) addRejectionReason(payload);
    if (formAction.value === false) editRejectionReason(payload);
    showModal.value = false;
  });
</script>

<template>
    <div>
      <PageHeading title="Rejection Reasons">
        <Button @click="FormManager(true)">Add Rejection Reason</Button>
      </PageHeading>

        <div class="rounded-md bg-card p-6 shadow-sm">
          <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg">
            <Table class="min-w-full">
                <TableHeader>
                <TableRow>
                    <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Reason</TableHead>
                    <TableHead class="px-4 py-2 border-b border-border"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody class="bg-card">
                <TableRow v-for="rejection in rejectionReasons" :key="rejection?.uid" class="hover:bg-accent/50">
                    <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                      <div class="text-sm text-foreground">{{ rejection?.reason }}</div>
                    </TableCell>
                    <TableCell class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                        <Button variant="outline" size="sm" @click="FormManager(false, rejection)">
                          Edit
                        </Button>
                    </TableCell>
                </TableRow>
                </TableBody>
            </Table>
          </div>
        </div>
    </div>

    <!-- Rejection Reason Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <FormField name="reason" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Rejection Reason</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Reason ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="pt-4">
          <Button type="submit" class="w-full">Save Form</Button>
        </div>
      </Form>
    </template>
  </Modal>

</template>
