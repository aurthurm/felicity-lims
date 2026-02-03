<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { AddClientDocument, AddClientMutation, AddClientMutationVariables,
  EditClientDocument, EditClientMutation, EditClientMutationVariables } from '@/graphql/operations/clients.mutations';
import { useLocationStore } from '@/stores/location';
import { useClientStore } from '@/stores/client';
import { ClientType } from '@/types/gql';
import useApiUtil from '@/composables/api_util';
import { Spinner } from '@/components/ui/spinner';
import ClientForm from '@/components/client/ClientForm.vue';

import * as shield from '@/guards';

defineOptions({ name: 'ClientView' });
const locationStore = useLocationStore();
const { withClientMutation } = useApiUtil();
const route = useRoute();

const clientStore = useClientStore();
onMounted(() => {
  clientStore.fetchClientByUid(route.query.clientUid!);
  locationStore.fetchCountries();
});

const showClientModal = ref<boolean>(false);
const createItem = ref<boolean>(false);
const formTitle = ref<string>('');
const form = ref<ClientType>({} as ClientType);

function FormManager(create: boolean, obj: ClientType = {} as ClientType) {
  createItem.value = create;
  formTitle.value = `${create ? 'CREATE' : 'EDIT'} CLIENT`;
  showClientModal.value = true;
  form.value = create ? ({} as ClientType) : obj;
}

function addClient(payload: { name: string; code: string; districtUid?: string }) {
  withClientMutation<AddClientMutation, AddClientMutationVariables>(
    AddClientDocument,
    { payload: { name: payload.name, code: payload.code, districtUid: payload.districtUid } },
    'createClient'
  ).then((res) => clientStore.addClient(res));
}

function editClient(payload: { name: string; code: string; districtUid?: string }) {
  withClientMutation<EditClientMutation, EditClientMutationVariables>(
    EditClientDocument,
    {
      uid: form.value?.uid,
      payload: {
        name: payload.name,
        code: payload.code,
        districtUid: payload.districtUid,
      },
    },
    'updateClient'
  ).then((result) => clientStore.updateClient(result));
}

function onFormSubmit(payload: { name: string; code: string; districtUid: string | undefined }) {
  if (createItem.value) addClient(payload);
  else editClient(payload);
  showClientModal.value = false;
  form.value = {} as ClientType;
}

function onFormClose() {
  showClientModal.value = false;
}

</script>


<template>
  <div>
    <div class="grid grid-cols-12 gap-4 mt-2 mb-4">
      <section class="col-span-12">
        <!-- Listing Item Card -->
        <div class="bg-background rounded-sm shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4">
          <div v-if="clientStore.fetchingClient" class="py-4 text-center">
            <span class="inline-flex items-center gap-2">
              <Spinner class="size-4" />
              <span class="text-sm">Fetching client metadata ...</span>
            </span>
          </div>
          <div class="grid grid-cols-12 gap-3" v-else>
            <!-- Summary Column -->
            <div class="col-span-12 px-3 sm:px-0">
              <div class="flex justify-between sm:text-sm md:text-md lg:text-lg text-foreground font-bold">
                <span>{{ clientStore.client?.name }}</span>
                <div>
                  <button 
                    v-show="shield.hasRights(shield.actions.UPDATE, shield.objects.CLIENT)"
                    @click="FormManager(false, clientStore.client)"
                    class="p-1 ml-2 rounded-sm text-muted-foreground text-md transition duration-300 hover:text-primary focus:outline-none"
                  >
                    <font-awesome-icon icon="fa-edit" />
                  </button>
                </div>
              </div>
              <hr />
              <div class="grid grid-cols-2 mt-2">
                <div class="col-span-1">
                  <!-- Client Details -->
                  <div class="flex">
                    <span class="text-foreground text-sm font-medium w-16">Province:</span>
                    <span class="text-foreground text-sm md:text-md">{{ clientStore.client?.district?.province?.name }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-foreground text-sm font-medium w-16">District:</span>
                    <span class="text-foreground text-sm md:text-md">{{ clientStore.client?.district?.name }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-foreground text-sm font-medium w-16">Code:</span>
                    <span class="text-foreground text-sm md:text-md">{{ clientStore.client?.code }}</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <!-- Communication Details -->
                  <div class="flex">
                    <span class="text-foreground text-sm font-medium w-16">Email:</span>
                    <span class="text-foreground text-sm md:text-md">{{ clientStore.client?.email }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-foreground text-sm font-medium w-16">Mobile:</span>
                    <span class="text-foreground text-sm md:text-md">{{ clientStore.client?.mobilePhone }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <router-view />
  </div>

  <!-- Client form modal (shadcn Form + vee-validate) -->
  <Modal v-if="showClientModal" @close="onFormClose">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <ClientForm
        :client="form"
        :create="createItem"
        @submit="onFormSubmit"
        @close="onFormClose"
      />
    </template>
  </Modal>
</template>
