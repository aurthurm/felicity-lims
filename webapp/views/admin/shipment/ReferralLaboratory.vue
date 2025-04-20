<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IReferralLaboratory } from '@/models/shipment'
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
  let form = reactive({}) as IReferralLaboratory;
  const formAction = ref<boolean>(true);

  shipmentStore.fetchReferralLaboratories();
  const referralLaboratories = computed(() => shipmentStore.getReferalLaboratories)

  function FormManager(create: boolean, obj = {} as IReferralLaboratory):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "REFERRAL LABORATORY";
    if (create) {
      Object.assign(form, {} as IReferralLaboratory);
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    const payload = { 
      name: form.name, 
      code: form.code, 
      url: form.url, 
      username: form.username, 
      password: form.password, 
      isReferral: form.isReferral, 
      isReference: form.isReference
    }

    if (formAction.value === true) {
      withClientMutation<AddReferralLaboratoryMutation, AddReferralLaboratoryMutationVariables>(AddReferralLaboratoryDocument, { payload }, "createReferralLaboratory")
      .then((result) => shipmentStore.addReferralLaboratory(result));
    };

    if (formAction.value === false) {
      withClientMutation<EditReferralLaboratoryMutation, EditReferralLaboratoryMutationVariables>(EditReferralLaboratoryDocument, { uid: form.uid, payload }, "updateReferralLaboratory")
      .then((result) => shipmentStore.updateReferralLaboratory(result));
    };

    showModal.value = false;
  }

</script>

<template>
  <div>
    <fel-heading title="Referral Labs">
      <fel-button @click="FormManager(true)">Add Referral Laboratory</fel-button>
    </fel-heading>

    <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full rounded-lg shadow-md bg-card p-6">
        <table class="min-w-full">
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
              <td class="px-3 py-2 text-sm text-foreground break-words">
                {{ laboratory?.name }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground break-words">
                {{ laboratory?.code }}
              </td>
              <td class="px-3 py-2 text-sm text-foreground break-words">
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
      <form action="post" class="p-4 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Laboratory Name</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Code</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="form.code"
              placeholder="Code ..."
            />
          </label>
          <label class="block col-span-1 md:col-span-2">
            <span class="text-sm font-medium text-foreground">URL</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="form.url"
              placeholder="https://example.com ..."
              type="url"
            />
          </label>
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Username</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="form.username"
              placeholder="Optional username ..."
              autocomplete="off"
            />
          </label>
          <label class="block col-span-1">
            <span class="text-sm font-medium text-foreground">Password</span>
            <input
              class="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              v-model="form.password"
              placeholder="Optional password ..."
              type="password"
              autocomplete="new-password"
            />
          </label>

          <label for="isReferralToggle" class="flex items-center cursor-pointer col-span-1">
            <div class="relative">
              <input
                type="checkbox"
                id="isReferralToggle"
                v-model="form.isReferral"
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
                 v-model="form.isReference"
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
          type="button"
          @click.prevent="saveForm()"
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