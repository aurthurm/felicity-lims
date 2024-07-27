<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { IReferralLaboratory } from '@/models/shipment'
  import { ADD_REFERRAL_LABORATORY, EDIT_REFERRAL_LABORATORY  } from '@/graphql/operations/shipment.mutations';
  import { useShipmentStore } from '@/stores';
  import { useApiUtil } from '@/composables';
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
    if (Create, related: list[str] = None) {
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
      withClientMutation(ADD_REFERRAL_LABORATORY, { payload }, "createReferralLaboratory")
      .then((result) => shipmentStore.addReferralLaboratory(result));
    };

    if (formAction.value === false) {
      withClientMutation(EDIT_REFERRAL_LABORATORY,{ uid: form.uid, payload }, "updateReferralLaboratory")
      .then((result) => shipmentStore.updateReferralLaboratory(result));
    };

    showModal.value = false;
  }

</script>

<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Referral Laboratory</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Name</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Code</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">url</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">is refferal</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">is reference</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">has username</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">has password</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="laboratory in referralLaboratories" :key="laboratory?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="flex items-center">
                          <div class="text-sm leading-5 text-gray-800">{{ laboratory?.name }}</div>
                      </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-sky-800">{{ laboratory?.code }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-sky-800">{{ laboratory?.url }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-sky-800">{{ laboratory?.isReferral }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-sky-800">{{ laboratory?.isReference }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-sky-800">{{ !!laboratory?.username ? "yes" : "no"  }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="text-sm leading-5 text-sky-800">{{ !laboratory?.password ? "yes" : "no" }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, laboratory)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
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
            <span class="text-gray-700">Laboratory Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Code</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.code"
              placeholder="Prefix ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Url</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.url"
              placeholder="Prefix ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Username</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.username"
              placeholder="Prefix ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Password</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.password"
              placeholder="Prefix ..."
            />
          </label>
          <label for="toggle" class="text-xs text-gray-700 mr-4">Is Referral
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="form.isReferral"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
          <label for="toggle" class="text-xs text-gray-700 mr-4">Is Reference
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="form.isReference"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
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
