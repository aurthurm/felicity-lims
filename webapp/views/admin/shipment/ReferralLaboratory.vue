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

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Add Referral Laboratory</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Name</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">Code</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">url</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">is refferal</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">is reference</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">has username</th>
                    <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">has password</th>
                    <th class="px-1 py-1 border-b-2 border-border"></th>
                </tr>
                </thead>
                <tbody class="bg-background">
                <tr v-for="laboratory in referralLaboratories" :key="laboratory?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                      <div class="flex items-center">
                          <div class="text-sm leading-5 text-foreground">{{ laboratory?.name }}</div>
                      </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                      <div class="text-sm leading-5 text-primary">{{ laboratory?.code }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                      <div class="text-sm leading-5 text-primary">{{ laboratory?.url }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                      <div class="text-sm leading-5 text-primary">{{ laboratory?.isReferral }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                      <div class="text-sm leading-5 text-primary">{{ laboratory?.isReference }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                      <div class="text-sm leading-5 text-primary">{{ !!laboratory?.username ? "yes" : "no"  }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
                      <div class="text-sm leading-5 text-primary">{{ !laboratory?.password ? "yes" : "no" }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
                        <button @click="FormManager(false, laboratory)" class="px-2 py-1 mr-2 border-primary border text-primary rounded-sm transition duration-300 hover:bg-primary hover:text-primary-foreground focus:outline-none">Edit</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>

      <!-- Location Edit Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Laboratory Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Code</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.code"
              placeholder="Prefix ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Url</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.url"
              placeholder="Prefix ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Username</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.username"
              placeholder="Prefix ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Password</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.password"
              placeholder="Prefix ..."
            />
          </label>
          <label for="toggle" class="text-xs text-foreground mr-4">Is Referral
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="form.isReferral"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-background border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-muted cursor-pointer"></label>
            </div>
          </label>
          <label for="toggle" class="text-xs text-foreground mr-4">Is Reference
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="form.isReference"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-background border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-muted cursor-pointer"></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-primary bg-primary text-primary-foreground rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Laboratory
        </button>
      </form>
    </template>
  </modal>

</template>


<style scoped>
  .toggle-checkbox:checked {
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #68D391;
  }
</style>
