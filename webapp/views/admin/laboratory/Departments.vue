<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useForm } from "vee-validate";
  import { object, string } from "yup";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { AddDepartmentDocument, AddDepartmentMutation, AddDepartmentMutationVariables,
    EditDepartmentDocument, EditDepartmentMutation, EditDepartmentMutationVariables } from '@/graphql/operations/_mutations';
  import { DepartmentType } from '@/types/gql';

  import { useSetupStore } from '@/stores/setup';
  import  useApiUtil  from '@/composables/api_util';

import PageHeading from "@/components/common/PageHeading.vue"
defineOptions({ name: 'DepartmentsView' })
  const setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  const formAction = ref(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    name: string().required("Department name is required"),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
    },
  });

  setupStore.fetchDepartments({})
  const departments = computed(() => setupStore.getDepartments)

  function FormManager(create: boolean, obj: any):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "Department";
    if (create) {
      currentUid.value = null;
      resetForm({ values: { name: "" } });
    } else {
      currentUid.value = obj?.uid ?? null;
      setValues({ name: obj?.name ?? "" });
    }
  }

  const saveForm = handleSubmit((values): void => {
    if (formAction.value === true) {
      withClientMutation<AddDepartmentMutation, AddDepartmentMutationVariables>(AddDepartmentDocument, { payload: { name: values.name } }, "createDepartment")
      .then((result) => setupStore.addDepartment(result));
    } else {
      if (!currentUid.value) {
        return;
      }
      withClientMutation<EditDepartmentMutation, EditDepartmentMutationVariables>(EditDepartmentDocument, { uid: currentUid.value, payload: { name: values.name }},"updateDepartment")
      .then((result) => setupStore.updateDepartment(result));
    };
    showModal.value = false;
  });

</script>

<template>
    <div class="space-y-6">
        <PageHeading title="Departments">
            <Button @click="FormManager(true, null)">Add Department</Button>
        </PageHeading>

        <div class="rounded-md border bg-card">
            <div class="relative w-full overflow-auto">
                <Table class="w-full caption-bottom text-sm">
                    <TableHeader class="[&_tr]:border-b">
                        <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
                            <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody class="[&_tr:last-child]:border-0">
                        <TableRow v-for="dept in departments" :key="dept?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <TableCell class="px-4 py-2 align-middle">{{ dept?.name }}</TableCell>
                            <TableCell class="px-4 py-2 align-middle text-right">
                                <button @click="FormManager(false, dept)" 
                                    class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                    Edit
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    </div>

    <!-- Location Edit Form Modal -->
    <Modal v-if="showModal" @close="showModal = false">
        <template v-slot:header>
            <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
        </template>

        <template v-slot:body>
            <form class="space-y-6" @submit.prevent="saveForm">
                <FormField name="name" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                            <Input v-bind="componentField" placeholder="Name ..." />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <hr class="border-border" />
                <Button type="submit" class="w-full">Save Form</Button>
            </form>
        </template>
    </Modal>
</template>
