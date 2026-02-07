<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { IQCTemplateType, IQCLevelType } from '@/types/gql';
  import { AddQcTemplateDocument, AddQcTemplateMutation, AddQcTemplateMutationVariables,
    EditQcTemplateDocument, EditQcTemplateMutation, EditQcTemplateMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
  import {FormControl,
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

  const qcTemplateSchema = yup.object({
    name: yup.string().trim().required('Template name is required'),
    description: yup.string().trim().nullable(),
    qcLevels: yup.array().nullable(),
    departments: yup.array().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: qcTemplateSchema,
    initialValues: {
      name: '',
      description: '',
      qcLevels: [],
      departments: [],
    },
  });

  analysisStore.fetchQCLevels();
  analysisStore.fetchQCTemplates();

  const qcTemplates = computed(() => analysisStore.getQCTemplates)
  const qcLevels = computed(() => analysisStore.getQCLevels)

  function addQCTemplate(payload: { name: string; description: string | null; levels: string[]; departments: any[] }): void {
    withClientMutation<AddQcTemplateMutation, AddQcTemplateMutationVariables>(AddQcTemplateDocument, { payload}, "createQcTemplate")
    .then((result) => analysisStore.addQcTemplate(result));
  }

  function editQCTemplate(payload: { name: string; description: string | null; levels: string[]; departments: any[] }): void {
    if (!currentUid.value) return;
    withClientMutation<EditQcTemplateMutation, EditQcTemplateMutationVariables>(EditQcTemplateDocument, { uid: currentUid.value, payload }, "updateQcTemplate")
    .then((result) => analysisStore.updateQcTemplate(result));
  }

  function levelsUids(levels: IQCLevelType[]): string[] {
    if (levels?.length <= 0 ) return [];
    let qcLevels: string[] = [];
    levels?.forEach(level => qcLevels.push(level.uid!));
    return qcLevels;
  }

  function FormManager(create: boolean, obj = {} as IQCTemplateType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Template";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: '',
          description: '',
          qcLevels: [],
          departments: [],
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? '',
        description: obj.description ?? '',
        qcLevels: obj.qcLevels ?? [],
        departments: obj.departments ?? [],
      });
    }
  }

  function levelsNames(levels: IQCLevelType[]): string {
    if (levels?.length <= 0 ) return '';
    let qcLevels: string[] = [];
    levels?.forEach(level => qcLevels.push(level.level!));
    return qcLevels.join(", ");
  }

  const saveForm = handleSubmit((values) => {
    const payload = {
      name: values.name,
      description: values.description ?? null,
      levels: levelsUids(values.qcLevels ?? []),
      departments: values.departments ?? [],
    };
    if (formAction.value === true) addQCTemplate(payload);
    if (formAction.value === false) editQCTemplate(payload);
    showModal.value = false;
  });

</script>

<template>
    <div>
      <PageHeading title="QC Templates">
        <Button @click="FormManager(true)">Add QC Template</Button>
      </PageHeading>

        <div class="border border-border bg-card rounded-lg shadow-md">
            <div class="relative w-full overflow-auto">
                <Table class="w-full caption-bottom text-sm">
                    <TableHeader class="[&_tr]:border-b">
                        <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">QC Template Name</TableHead>
                            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Quality Control level(s)</TableHead>
                            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Department(s)</TableHead>
                            <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody class="[&_tr:last-child]:border-0">
                        <TableRow v-for="templt in qcTemplates" :key="templt?.uid" class="border-b border-border/50 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <TableCell class="px-4 py-3 align-middle text-sm">
                                <div class="font-medium text-foreground">{{ templt?.name }}</div>
                                <div class="text-sm text-muted-foreground" v-if="templt?.description">{{ templt?.description }}</div>
                            </TableCell>
                            <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ levelsNames(templt?.qcLevels ?? []) }}</TableCell>
                            <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ templt?.category }}</TableCell>
                            <TableCell class="px-4 py-3 align-middle text-right">
                                <Button variant="outline" size="sm" @click="FormManager(false, templt)">
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableEmpty v-if="!qcTemplates?.length" :colspan="4">
                            <Empty class="border-0 bg-transparent p-0">
                                <EmptyContent>
                                    <EmptyHeader>
                                        <EmptyTitle>No QC templates found</EmptyTitle>
                                        <EmptyDescription>Add a QC template to get started.</EmptyDescription>
                                    </EmptyHeader>
                                </EmptyContent>
                            </Empty>
                        </TableEmpty>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>

    <!-- QC Template Form Modal -->
    <Modal v-if="showModal" @close="showModal = false">
        <template v-slot:header>
          <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
        </template>

        <template v-slot:body>
          <form @submit.prevent="saveForm" class="p-6 space-y-6">
            <div class="space-y-4">
              <FormField name="name" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>QC Template Name</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Enter template name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="description" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea v-bind="componentField" placeholder="Enter template description" rows="3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="qcLevels" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel>Quality Control Sample Levels</FormLabel>
                  <FormControl>
                    <select 
                      id="controlLevels" 
                      class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      multiple
                      v-bind="componentField"
                    >
                      <option disabled value="">Select QC Levels</option>
                      <option  
                        v-for="level in qcLevels"
                        :key="level.uid"
                        :value="level"
                        class="py-1"
                      >
                        {{ level.level }}
                      </option>
                    </select>
                  </FormControl>
                  <p class="text-xs text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple levels</p>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="pt-4">
              <Button type="submit" class="w-full">
                Save Changes
              </Button>
            </div>
          </form>
        </template>
    </Modal>
</template>
