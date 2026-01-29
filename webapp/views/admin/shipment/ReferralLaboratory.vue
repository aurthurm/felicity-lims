<script setup lang="ts">
  import { ref, computed, defineAsyncComponent } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import * as yup from 'yup';
  import { ReferralLaboratoryType } from '@/types/gql'
  import { AddReferralLaboratoryDocument, AddReferralLaboratoryMutation, AddReferralLaboratoryMutationVariables,
    EditReferralLaboratoryDocument, EditReferralLaboratoryMutation, EditReferralLaboratoryMutationVariables } from '@/graphql/operations/shipment.mutations';
  import { useShipmentStore } from '@/stores/shipment';
  import  useApiUtil  from '@/composables/api_util';
  const modal = defineAsyncComponent(
    () => import("@/components/ui/FelModal.vue")
  )

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

  const { value: name, errorMessage: nameError } = useField<string>('name');
  const { value: code, errorMessage: codeError } = useField<string | null>('code');
  const { value: url, errorMessage: urlError } = useField<string | null>('url');
  const { value: username, errorMessage: usernameError } = useField<string | null>('username');
  const { value: password, errorMessage: passwordError } = useField<string | null>('password');
  const { value: isReferral } = useField<boolean>('isReferral');
  const { value: isReference } = useField<boolean>('isReference');

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
    <fel-heading title="Referral Labs">
      <fel-button @click="FormManager(true)">Add Referral Laboratory</fel-button>
    </fel-heading>

    <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full rounded-lg shadow-md bg-card p-6">
        <table class="min-w-full fel-table">
          <thead class="bg-muted">
            <tr>
              <th class="px-3 py-3 border-b border-border text-left text-sm font-medium text-muted-foreground tracking-wider">Name</th>
              <th class="px-3 py-3 border-b border-border text-left text-sm font-medium text-muted-foreground tracking-wider">Code</th>
              <th class="px-3 py-3 border-b border-border text-left text-sm font-medium text-muted-foreground tracking-wider">URL</th>
              <th class="px-3 py-3 border-b border-border text-left text-sm font-medium text-muted-foreground tracking-wider">Is Referral</th>
              <th class="px-3 py-3 border-b border-border text-left text-sm font-medium text-muted-foreground tracking-wider">Is Reference</th>
              <th class="px-3 py-3 border-b border-border text-left text-sm font-medium text-muted-foreground tracking-wider">Has Username</th>
              <th class="px-3 py-3 border-b border-border text-left text-sm font-medium text-muted-foreground tracking-wider">Has Password</th>
              <th class="px-3 py-3 border-b border-border"></th>
            </tr>
          </thead>
          <tbody class="bg-background divide-y divide-border">
            <tr v-for="laboratory in referralLaboratories" :key="laboratory?.uid" class="hover:bg-muted/50 transition-colors">
              <td class="px-3 py-2 text-sm text-foreground wrap-break-word">
                {{ laboratory?.name }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground wrap-break-word">
                {{ laboratory?.code }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground wrap-break-word">
                {{ laboratory?.url }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground">
                 {{ laboratory?.isReferral ? 'Yes' : 'No' }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground">
                 {{ laboratory?.isReference ? 'Yes' : 'No' }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground">
                 {{ !!laboratory?.username ? "Yes" : "No" }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground">
                 {{ !!laboratory?.password ? "Yes" : "No" }}
              </td>
              <td class="px-3 py-2 text-right text-sm">
                <button
                  @click="FormManager(false, laboratory)"
                  class="rounded-md border border-secondary px-2 py-1 text-xs font-medium text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                 >
                   Edit
                 </button>
              </td>
            </tr>
            <tr v-if="!referralLaboratories || referralLaboratories.length === 0">
               <td :colspan="8" class="px-3 py-4 text-center text-sm text-muted-foreground">
                 No referral laboratories found.
               </td>
             </tr>
          </tbody>
        </table>
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
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Laboratory Name</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="name"
              placeholder="Name ..."
            />
            <p v-if="nameError" class="mt-1 text-sm text-destructive">{{ nameError }}</p>
          </label>
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Code</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="code"
              placeholder="Code ..."
            />
            <p v-if="codeError" class="mt-1 text-sm text-destructive">{{ codeError }}</p>
          </label>
          <label class="block col-span-1 md:col-span-2">
            <span class="text-sm font-medium text-foreground">URL</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="url"
              placeholder="https://example.com ..."
              type="url"
            />
            <p v-if="urlError" class="mt-1 text-sm text-destructive">{{ urlError }}</p>
          </label>
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Username</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="username"
              placeholder="Optional username ..."
              autocomplete="off"
            />
            <p v-if="usernameError" class="mt-1 text-sm text-destructive">{{ usernameError }}</p>
          </label>
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Password</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="password"
              placeholder="Optional password ..."
              type="password"
              autocomplete="new-password"
            />
            <p v-if="passwordError" class="mt-1 text-sm text-destructive">{{ passwordError }}</p>
          </label>

          <label for="isReferralToggle" class="flex items-center cursor-pointer col-span-1">
            <div class="relative">
              <input
                type="checkbox"
                id="isReferralToggle"
                v-model="isReferral"
                class="sr-only peer"
              />
              <div class="block h-6 w-10 rounded-full bg-muted peer-checked:bg-primary transition"></div>
              <div class="absolute left-1 top-1 h-4 w-4 rounded-full bg-background border border-border transition-transform peer-checked:translate-x-full"></div>
            </div>
            <span class="ml-3 text-sm font-medium text-foreground">Is Referral</span>
          </label>

          <label for="isReferenceToggle" class="flex items-center cursor-pointer col-span-1">
             <div class="relative">
              <input
                type="checkbox"
                id="isReferenceToggle"
                v-model="isReference"
                class="sr-only peer"
              />
               <div class="block h-6 w-10 rounded-full bg-muted peer-checked:bg-primary transition"></div>
               <div class="absolute left-1 top-1 h-4 w-4 rounded-full bg-background border border-border transition-transform peer-checked:translate-x-full"></div>
             </div>
             <span class="ml-3 text-sm font-medium text-foreground">Is Reference</span>
           </label>

        </div>
        <hr class="border-t border-border" />
        <button
          type="submit"
          class="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Save Laboratory
        </button>
      </form>
    </template>
  </modal>
</template>

<style scoped>
/* Minimal scoped styles - toggle handled by utilities now */
</style>
