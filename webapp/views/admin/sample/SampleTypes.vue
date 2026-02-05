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
  import {
    Form,
    FormControl,
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

    <div class="overflow-x-auto">
      <div class="inline-block min-w-full align-middle">
        <div class="overflow-hidden shadow-md rounded-lg bg-background">
          <Table class="min-w-full divide-y divide-border">
            <TableHeader class="bg-muted">
              <TableRow>
                <TableHead scope="col" class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Sample Type</TableHead>
                <TableHead scope="col" class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Prefix</TableHead>
                <TableHead scope="col" class="px-4 py-2 text-left text-sm font-medium text-muted-foreground tracking-wider">Active</TableHead>
                <TableHead scope="col" class="px-4 py-2 text-right text-sm font-medium text-muted-foreground tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="bg-background divide-y divide-border">
              <TableRow v-for="s_type in sampleTypes" :key="s_type?.uid">
                <TableCell class="px-4 py-2 whitespace-nowrap">
                  <div class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ s_type?.name }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-nowrap">
                  <div class="text-sm text-primary">{{ s_type?.abbr }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-nowrap">
                  <div class="text-sm text-primary">{{ s_type?.active }}</div>
                </TableCell>
                <TableCell class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
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
  </div>

  <!-- Sample Type Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-xl font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form @submit="saveForm" class="space-y-6 p-4">
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
      </Form>
    </template>
  </Modal>
</template>
