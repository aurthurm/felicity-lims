<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { AnalysisCategoryType } from '@/types/gql';
  import { AddAnalysisCategoryDocument, AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables,
    EditAnalysisCategoryDocument, EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useSetupStore } from '@/stores/setup';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

import PageHeading from "@/components/common/PageHeading.vue"
  const analysisStore = useAnalysisStore()
  const  setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref(false);
  let formTitle = ref('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const categorySchema = yup.object({
    name: yup.string().trim().required('Category name is required'),
    description: yup.string().trim().nullable(),
    departmentUid: yup.string().trim().nullable(),
    active: yup.boolean().default(true),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: categorySchema,
    initialValues: {
      name: '',
      description: '',
      departmentUid: '',
      active: true,
    },
  });

  const departments = computed<any[]>(() => setupStore.getDepartments);

  analysisStore.fetchAnalysesCategories();
  const analysesCategories= computed(() => analysisStore.getAnalysesCategories);

  function addAnalysesCategory(payload: { name: string; description: string | null; departmentUid: string | null; active: boolean }): void {
    withClientMutation<AddAnalysisCategoryMutation, AddAnalysisCategoryMutationVariables>(AddAnalysisCategoryDocument, { payload }, "createAnalysisCategory")
    .then((result) => analysisStore.addAnalysisCategory(result));
  }

  function editAnalysesCategory(payload: { name: string; description: string | null; departmentUid: string | null; active: boolean }): void {
    if (!currentUid.value) return;
    withClientMutation<EditAnalysisCategoryMutation, EditAnalysisCategoryMutationVariables>(EditAnalysisCategoryDocument, { uid: currentUid.value, payload }, "updateAnalysisCategory")
    .then((result) => analysisStore.updateAnalysisCategory(result));
  }

  function FormManager(create: boolean, obj: AnalysisCategoryType | null):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES CATEGORY";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: '',
          description: '',
          departmentUid: '',
          active: true,
        },
      });
    } else {
      currentUid.value = obj?.uid ?? null;
      setValues({
        name: obj?.name ?? '',
        description: obj?.description ?? '',
        departmentUid: obj?.departmentUid ?? '',
        active: obj?.active ?? true,
      });
    }
  }

  const saveForm = handleSubmit((values) => {
    const payload = {
      name: values.name,
      description: values.description ?? null,
      departmentUid: values.departmentUid ? values.departmentUid : null,
      active: values.active,
    };
    if (formAction.value === true) addAnalysesCategory(payload);
    if (formAction.value === false) editAnalysesCategory(payload);
    showModal.value = false;
  });

</script>

<template>
  <PageHeading title="Analyses Categories">
    <Button @click="FormManager(true, null)">Add Analyses Category</Button>
  </PageHeading>

  <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card text-card-foreground rounded-lg border border-border">
      <Table class="min-w-full">
          <TableHeader>
          <TableRow>
              <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Category Name</TableHead>
              <TableHead class="px-4 py-2 border-b border-border text-left text-sm font-medium text-muted-foreground">Department</TableHead>
              <TableHead class="px-4 py-2 border-b border-border"></TableHead>
          </TableRow>
          </TableHeader>
          <TableBody class="bg-card">
          <TableRow v-for="category in analysesCategories" :key="category?.uid" class="hover:bg-accent/50">
              <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                <div class="text-sm text-foreground">{{ category?.name }}</div>
              </TableCell>
              <TableCell class="px-4 py-2 whitespace-no-wrap border-b border-border">
                <div class="text-sm text-foreground">{{ category?.department?.name }}</div>
              </TableCell>
              <TableCell class="px-4 py-2 whitespace-no-wrap text-right border-b border-border">
                  <Button variant="outline" size="sm" @click="FormManager(false, category)">
                    Edit
                  </Button>
              </TableCell>
          </TableRow>
          </TableBody>
      </Table>
      </div>
  </div>

  <!-- Location Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-bold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-6 space-y-6">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <FormField name="name" v-slot="{ componentField }">
              <FormItem class="col-span-2">
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Name ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="departmentUid" v-slot="{ componentField }">
              <FormItem class="col-span-1">
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select Department</SelectItem>
                      <SelectItem v-for="department in departments" :key="department.uid" :value="department?.uid">
                        {{ department.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="description" v-slot="{ componentField }">
              <FormItem class="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" placeholder="Description ..." rows="3" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="pt-4">
          <Button type="submit" class="w-full">Save Form</Button>
        </div>
      </form>
    </template>
  </Modal>

</template>
