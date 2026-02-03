<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ref, reactive, computed, h, defineAsyncComponent } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { ClientType } from "@/types/gql";
import { 
  AddClientDocument, AddClientMutation, AddClientMutationVariables,
  EditClientDocument, EditClientMutation, EditClientMutationVariables
} from "@/graphql/operations/clients.mutations";

import { useClientStore } from '@/stores/client';
import { useLocationStore } from '@/stores/location';
import useApiUtil from '@/composables/api_util';
import ClientForm from '@/components/client/ClientForm.vue';

import * as shield from '@/guards';
import PageHeading from "@/components/common/PageHeading.vue"
const DataTable = defineAsyncComponent(
    () => import('@/components/common/DataTable.vue')
)

const clientStore = useClientStore();
const locationStore = useLocationStore();
const { withClientMutation } = useApiUtil();


const tableColumns = ref([
  {
    name: "UID",
    value: "uid",
    sortable: true,
    sortBy: "asc",
    defaultSort: true,
    showInToggler: false,
    hidden: true,
  },
  {
    name: "Client Name",
    value: "",
    sortable: false,
    sortBy: "asc",
    hidden: false,
    customRender: function (client, _) {
      return h(RouterLink, {
        to: {
          name: "client-detail",
          query: {
            clientUid: client?.uid,
          },
        },
        class:
          "px-2 py-1 font-semibold rounded-md hover:underline transition-colors duration-200",
        innerHTML: client?.name,
      });
    },
  },
  {
    name: "Client ID",
    value: "code",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "District",
    value: "district.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Province",
    value: "district.province.name",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Mobile Number",
    value: "mobilePhone",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
  {
    name: "Email Address",
    value: "email",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
]);

const { clients, clientPageInfo, fetchingClients } = storeToRefs(clientStore);

let showClientModal = ref<boolean>(false);
let createItem = ref<boolean>(false);
let targetItem = ref<string>("");

let client = reactive({}) as ClientType;
const formTitle = ref<string>('');
const resetClient = () => Object.assign(client, {} as ClientType);

let clientParams = reactive({
  first: 50,
  after: '',
  text: '',
  sortBy: ['uid'],
  filterAction: false,
});


clientStore.fetchClients(clientParams);
locationStore.fetchCountries();

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
      uid: client.uid,
      payload: {
        name: payload.name,
        code: payload.code,
        districtUid: payload.districtUid,
      },
    },
    'updateClient'
  ).then((res) => clientStore.updateClient(res));
}

function searchClients(opts: any) {
  clientParams.first = 100;
  clientParams.after = "";
  clientParams.text = opts.filterText;
  clientParams.filterAction = true;
  clientStore.fetchClients(clientParams);
}

function showMoreClients(opts: any): void {
  clientParams.first = opts.fetchCount;
  clientParams.after = clientPageInfo?.value?.endCursor!;
  clientParams.text = opts.filterText;
  clientParams.filterAction = false;
  clientStore.fetchClients(clientParams);
}

function FormManager(create: boolean, target: string, obj: ClientType = {} as ClientType) {
  createItem.value = create;
  targetItem.value = target;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + target.toUpperCase();
  if (target == 'client') {
    showClientModal.value = true;
    Object.assign(client, create ? ({} as ClientType) : { ...obj });
  }
}

function onFormSubmit(payload: { name: string; code: string; districtUid: string | undefined }) {
  if (createItem.value) addClient(payload);
  else editClient(payload);
  showClientModal.value = false;
}

function onFormClose() {
  showClientModal.value = false;
}

const countNone = computed(
  () => clients?.value?.length + " of " + clientStore.getClientCount + " clients"
);
</script>

<template>
  <PageHeading title="Clients">
    <Button 
      v-show="shield.hasRights(shield.actions.CREATE, shield.objects.CLIENT)"
      @click="FormManager(true, 'client')"
    >
      Add client
    </Button>
  </PageHeading>

  <div class="rounded-lg border border-border bg-card shadow-sm p-6">
    <DataTable 
    :columns="tableColumns" 
    :data="clients" 
    :toggleColumns="true" 
    :loading="fetchingClients" 
    :paginable="true"
    :pageMeta="{
      fetchCount: clientParams.first,
      hasNextPage: clientPageInfo?.hasNextPage,
      countNone,
    }" 
    :searchable="true" 
    :filterable="false" 
    @onSearchKeyUp="searchClients" 
    @onSearchFocus="resetClient"
    @onPaginate="showMoreClients" 
    :selectable="false"
  >
    <template v-slot:footer></template>
    </DataTable>
  </div>
  <!-- Client form modal (shadcn Form + vee-validate) -->
  <Modal v-if="showClientModal" @close="onFormClose">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <ClientForm
        :client="client"
        :create="createItem"
        @submit="onFormSubmit"
        @close="onFormClose"
      />
    </template>
  </Modal>
</template>

<style lang="postcss"></style>
