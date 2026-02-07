<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { ReferralLaboratoryType } from '@/types/gql'
  import { AddReferralLaboratoryDocument, AddReferralLaboratoryMutation, AddReferralLaboratoryMutationVariables,
    EditReferralLaboratoryDocument, EditReferralLaboratoryMutation, EditReferralLaboratoryMutationVariables } from '@/graphql/operations/shipment.mutations';
  import { useShipmentStore } from '@/stores/shipment';
  import  useApiUtil  from '@/composables/api_util';
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
  import {FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import PageHeading from "@/components/common/PageHeading.vue"
  const shipmentStore = useShipmentStore();
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  const formAction = ref<boolean>(true);
  const currentUid = ref<string | null>(null);

  const referralLabSchema = yup.object({
    name: yup.string().trim().required('Laboratory name is required'),
    code: yup.string().trim().nullable(),
    url: yup.string().trim().nullable().url('Enter a valid URL'),
    username: yup.string().trim().nullable(),
    password: yup.string().trim().nullable(),
    isReferral: yup.boolean().default(false),
    isReference: yup.boolean().default(false),
  });

  const { handleSubmit, resetForm, setValues } = useForm({
    validationSchema: referralLabSchema,
    initialValues: {
      name: '',
      code: '',
      url: '',
      username: '',
      password: '',
      isReferral: false,
      isReference: false,
    },
  });

  shipmentStore.fetchReferralLaboratories();
  const referralLaboratories = computed(() => shipmentStore.getReferalLaboratories)

  function FormManager(create: boolean, obj = {} as ReferralLaboratoryType): void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "REFERRAL LABORATORY";
    if (create) {
      currentUid.value = null;
      resetForm({
        values: {
          name: '',
          code: '',
          url: '',
          username: '',
          password: '',
          isReferral: false,
          isReference: false,
        },
      });
    } else {
      currentUid.value = obj.uid ?? null;
      setValues({
        name: obj.name ?? '',
        code: obj.code ?? '',
        url: obj.url ?? '',
        username: obj.username ?? '',
        password: obj.password ?? '',
        isReferral: obj.isReferral ?? false,
        isReference: obj.isReference ?? false,
      });
    }
  }

  const saveForm = handleSubmit((values) => {
    const payload = {
      name: values.name,
      code: values.code ?? null,
      url: values.url ?? null,
      username: values.username ?? null,
      password: values.password ?? null,
      isReferral: values.isReferral,
      isReference: values.isReference,
    };

    if (formAction.value === true) {
      withClientMutation<AddReferralLaboratoryMutation, AddReferralLaboratoryMutationVariables>(AddReferralLaboratoryDocument, { payload }, "createReferralLaboratory")
      .then((result) => shipmentStore.addReferralLaboratory(result));
    };

    if (formAction.value === false && currentUid.value) {
      withClientMutation<EditReferralLaboratoryMutation, EditReferralLaboratoryMutationVariables>(EditReferralLaboratoryDocument, { uid: currentUid.value, payload }, "updateReferralLaboratory")
      .then((result) => shipmentStore.updateReferralLaboratory(result));
    };

    showModal.value = false;
  });

</script>

<template>
  <div>
    <PageHeading title="Referral Labs">
      <Button @click="FormManager(true)">Add Referral Laboratory</Button>
    </PageHeading>

    <div class="mt-4">
      <div class="border border-border bg-card rounded-lg shadow-md">
        <div class="relative w-full overflow-auto">
          <Table class="w-full caption-bottom text-sm">
            <TableHeader class="[&_tr]:border-b">
              <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Code</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">URL</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Is Referral</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Is Reference</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Has Username</TableHead>
                <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Has Password</TableHead>
                <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody class="[&_tr:last-child]:border-0">
              <TableRow v-for="laboratory in referralLaboratories" :key="laboratory?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableCell class="px-4 py-3 align-middle text-sm text-foreground wrap-break-word">
                {{ laboratory?.name }}
              </TableCell>
                <TableCell class="px-4 py-3 align-middle text-sm text-foreground wrap-break-word">{{ laboratory?.code }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-sm text-foreground wrap-break-word">{{ laboratory?.url }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ laboratory?.isReferral ? 'Yes' : 'No' }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ laboratory?.isReference ? 'Yes' : 'No' }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ !!laboratory?.username ? "Yes" : "No" }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-sm text-foreground">{{ !!laboratory?.password ? "Yes" : "No" }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-right">
                <Button variant="outline" size="sm" @click="FormManager(false, laboratory)">
                   Edit
                </Button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!referralLaboratories || referralLaboratories.length === 0" :colspan="8">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No referral laboratories found</EmptyTitle>
                    <EmptyDescription>Add a referral laboratory to get started.</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            </TableEmpty>
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  </div>

  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-card-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form @submit.prevent="saveForm" class="p-4 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Laboratory Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="code" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Code ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="url" v-slot="{ componentField }">
            <FormItem class="md:col-span-2">
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="url" placeholder="https://example.com ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="username" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Optional username ..." autocomplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="password" placeholder="Optional password ..." autocomplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="isReferral" v-slot="{ value, handleChange }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel>Is Referral</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField name="isReference" v-slot="{ value, handleChange }">
            <FormItem class="flex items-center space-x-2">
              <FormControl>
                <Switch :checked="value" @update:checked="handleChange" />
              </FormControl>
              <FormLabel>Is Reference</FormLabel>
              <FormMessage />
            </FormItem>
          </FormField>

        </div>
        <hr class="border-t border-border" />
        <Button type="submit" class="w-full">
          Save Laboratory
        </Button>
      </form>
    </template>
  </modal>
</template>

<style scoped>
/* Minimal scoped styles - toggle handled by utilities now */
</style>
