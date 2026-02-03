<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { QCLevelType } from '@/types/gql';
  import { AddQcLevelDocument, AddQcLevelMutation, AddQcLevelMutationVariables,
    EditQcLevelDocument, EditQcLevelMutation, EditQcLevelMutationVariables } from '@/graphql/operations/analyses.mutations';

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
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const qcLevelSchema = yup.object({
    level: yup.string().trim().required('QC level is required'),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: qcLevelSchema,
    initialValues: {
      level: '',
    },
  });

  analysisStore.fetchQCLevels();
  const qcLevels = computed(() => analysisStore.getQCLevels)

  function addQCLevel(payload: { level: string }): void {
    withClientMutation<AddQcLevelMutation, AddQcLevelMutationVariables>(AddQcLevelDocument, payload, "createQcLevel")
    .then((result) => analysisStore.addQcLevel(result));
  }

  function editQCLevel(payload: { level: string }): void {
    if (!currentUid.value) return;
    withClientMutation<EditQcLevelMutation, EditQcLevelMutationVariables>(EditQcLevelDocument, { uid: currentUid.value, ...payload },"updateQcLevel")
    .then((result) => analysisStore.updateQcLevel(result));
  }

  function FormManager(create: boolean, obj: QCLevelType = {} as QCLevelType):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Level";
    if (create) {
      currentUid.value = null;
      resetForm({ values: { level: '' } });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({ level: obj.level ?? '' });
    }
  }

  const saveForm = handleSubmit((values) => {
    const payload = { level: values.level };
    if (formAction.value === true) addQCLevel(payload);
    if (formAction.value === false) editQCLevel(payload);
    showModal.value = false;
  });
</script>

<template>
    <div>
      <PageHeading title="QC Levels">
        <Button @click="FormManager(true)">Add QC Level</Button>
      </PageHeading>

        <div class="rounded-md border bg-card p-6 shadow-sm">
            <div class="w-full">
                <Table class="w-full caption-bottom text-sm">
                    <TableHeader>
                        <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</TableHead>
                            <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="level in qcLevels" 
                            :key="level?.uid"
                            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                            <TableCell class="p-4 align-middle">
                                <span class="text-sm font-medium leading-none">{{ level?.level }}</span>
                            </TableCell>
                            <TableCell class="p-4 align-middle text-right">
                                <Button variant="outline" size="sm" @click="FormManager(false, level)">
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>

    <!-- QC Level Edit Form Modal -->
    <Modal v-if="showModal" @close="showModal = false">
        <template v-slot:header>
            <h3 class="text-lg font-semibold leading-none tracking-tight">{{ formTitle }}</h3>
        </template>

        <template v-slot:body>
            <Form @submit="saveForm" class="space-y-4 p-4">
                <FormField name="level" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel>QC Level</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" placeholder="Enter QC level name..." />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <Button type="submit" class="w-full">
                    Save Changes
                </Button>
            </Form>
        </template>
    </Modal>
</template>

<style scoped>
@reference "@/assets/css/style.css";
  /* CHECKBOX TOGGLE SWITCH */
  /* @apply rules for documentation, these do not work as inline style */
  .toggle-checkbox:checked {
    @apply: right-0 border-sky-800;
    right: 0;
    border-color: hsl(var(--success));
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply: bg-sky-800;
    background-color: hsl(var(--success));
  }
</style>
