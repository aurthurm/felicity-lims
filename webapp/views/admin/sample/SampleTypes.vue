<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { SampleTypeTyp } from '@/types/gql'
  import { AddSampleTypeDocument, AddSampleTypeMutation, AddSampleTypeMutationVariables,
    EditSampleTypeDocument, EditSampleTypeMutation, EditSampleTypeMutationVariables } from '@/graphql/operations/analyses.mutations';
  import { useSampleStore } from '@/stores/sample';
  import  useApiUtil  from '@/composables/api_util';
  import { useForm } from "vee-validate";
  import { boolean, object, string } from "yup";
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
  const sampleStore = useSampleStore();
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  const formAction = ref<boolean>(true);
  const currentUid = ref<string | null>(null);

  const formSchema = object({
    name: string().required("Sample type name is required"),
    abbr: string().required("Prefix is required"),
    description: string().nullable(),
    active: boolean().nullable(),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
      name: "",
      abbr: "",
      description: "",
      active: true,
    },
  });

  sampleStore.fetchSampleTypes();
  const sampleTypes = computed(() => sampleStore.getSampleTypes)

  function FormManager(create: boolean, obj = {} as SampleTypeTyp):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "SAMPLE TYPE";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: "",
          abbr: "",
          description: "",
          active: true,
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? "",
        abbr: obj.abbr ?? "",
        description: obj.description ?? "",
        active: obj.active ?? true,
      });
    }
  }

  const saveForm = handleSubmit((values): void => {
    const payload = {
      name: values.name,
      abbr: values.abbr,
      description: values.description,
      active: values.active,
    };

    if (formAction.value === true) {
      withClientMutation<AddSampleTypeMutation, AddSampleTypeMutationVariables>(AddSampleTypeDocument, { payload }, "createSampleType")
      .then((result) => sampleStore.addSampleType(result));
    };

    if (formAction.value === false) {
      if (!currentUid.value) {
        return;
      }
      withClientMutation<EditSampleTypeMutation, EditSampleTypeMutationVariables>(EditSampleTypeDocument, { uid: currentUid.value, payload }, "updateSampleType")
      .then((result) => sampleStore.updateSampleType(result));
    };

    showModal.value = false;
  });

</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Sample Types">
      <Button @click="FormManager(true)">Add Sample Type</Button>
    </PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sample Type</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Prefix</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Active</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="s_type in sampleTypes" :key="s_type?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm font-medium">{{ s_type?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-primary">{{ s_type?.abbr }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-primary">{{ s_type?.active }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                  <Button variant="outline" size="sm" @click="FormManager(false, s_type)">
                    Edit
                  </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <!-- Sample Type Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="space-y-6 p-4">
        <div class="grid grid-cols-1 gap-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Sample Type Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="abbr" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Prefix</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Prefix ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="description" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" placeholder="Description ..." rows="3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="active" v-slot="{ value, handleChange }">
            <FormItem class="flex items-center gap-2">
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel>Active</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-end">
          <Button type="submit">Save Sample Type</Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
