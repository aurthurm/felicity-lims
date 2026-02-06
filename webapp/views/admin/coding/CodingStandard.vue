<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { CodingStandardType } from '@/types/gql'
  import { AddCodingStandardDocument, AddCodingStandardMutation, AddCodingStandardMutationVariables,
    EditCodingStandardDocument, EditCodingStandardMutation, EditCodingStandardMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useAnalysisStore } from '@/stores/analysis';
  import  useApiUtil  from '@/composables/api_util';
  import { useForm } from "vee-validate";
  import { object, string } from "yup";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import PageHeading from "@/components/common/PageHeading.vue"
  const analyisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  const formAction = ref<boolean>(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    name: string().required("Name is required"),
    description: string().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      description: "",
    },
  });

  analyisStore.fetchCodingStandards();
  const codindStandards = computed(() => analyisStore.getCodingStandards)

  function FormManager(create: boolean, obj = {} as CodingStandardType):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "CODING STANDARD";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          description: "",
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? "",
        description: obj.description ?? "",
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    const payload = { name: values.name, description: values.description };

    if (formAction.value === true) {
      withClientMutation<AddCodingStandardMutation, AddCodingStandardMutationVariables>(AddCodingStandardDocument, { payload }, "createCodingStandard")
      .then((result) => analyisStore.addCodingStandard(result));
    };

    if (formAction.value === false) {
      if (!currentUid.value) {
        return;
      }
      withClientMutation<EditCodingStandardMutation, EditCodingStandardMutationVariables>(EditCodingStandardDocument, { uid: currentUid.value, payload }, "updateCodingStandard")
      .then((result) => analyisStore.updateCodingStandard(result));
    };

    showModal.value = false;
  });

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Coding Standards">
      <Button @click="FormManager(true)">Add Coding Standard</Button>
    </PageHeading>

    <div class="rounded-lg border border-border bg-card p-6">
      <div class="overflow-x-auto">
        <Table class="w-full">
          <TableHeader>
            <TableRow class="border-b border-border">
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-foreground">Standard</TableHead>
              <TableHead class="px-4 py-3 text-left text-sm font-medium text-foreground">Description</TableHead>
              <TableHead class="px-4 py-3 text-right text-sm font-medium text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="divide-y divide-border">
            <TableRow v-for="standard in codindStandards" :key="standard?.uid" class="hover:bg-accent/50">
              <TableCell class="px-4 py-3">
                <div class="text-sm text-foreground">{{ standard?.name }}</div>
              </TableCell>
              <TableCell class="px-4 py-3">
                <div class="text-sm text-muted-foreground">{{ standard?.description }}</div>
              </TableCell>
              <TableCell class="px-4 py-3 text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, standard)">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <!-- Form Modal -->
    <Modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/6'">
      <template v-slot:header>
        <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
      </template>

    <template v-slot:body>
        <form class="space-y-6" @submit.prevent="saveForm">
          <div class="space-y-4">
            <FormField name="name" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Standard Name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Name ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField name="description" v-slot="{ componentField }">
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea v-bind="componentField" placeholder="Description ..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="flex justify-end">
            <Button type="submit">Save Form</Button>
          </div>
        </form>
    </template>
  </Modal>
</div>
</template>
