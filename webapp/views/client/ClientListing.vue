<script setup lang="ts">
import { ref, reactive, computed, h, defineAsyncComponent } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { IClient } from "@/models/client";
import { 
  AddClientDocument, AddClientMutation, AddClientMutationVariables,
  EditClientDocument, EditClientMutation, EditClientMutationVariables
} from "@/graphql/operations/clients.mutations";

import { useClientStore } from "@/stores/client";
import { useLocationStore } from "@/stores/location";
import useApiUtil  from "@/composables/api_util";

import * as shield from "@/guards";
const DataTable = defineAsyncComponent(
    () => import('@/components/ui/datatable/FelDataTable.vue')
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

const { countries, provinces, districts } = storeToRefs(locationStore);
const { clients, clientPageInfo, fetchingClients } = storeToRefs(clientStore);

let showClientModal = ref<boolean>(false);
let createItem = ref<boolean>(false);
let targetItem = ref<string>("");

let client = reactive({}) as IClient;
const formTitle = ref<string>("");
const resetClient = () => Object.assign(client, {}) as IClient;

let clientParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["uid"],
  filterAction: false,
});

let countryUid = ref<string>();
let provinceUid = ref<string>();


clientStore.fetchClients(clientParams);
locationStore.fetchCountries();

function addClient() {
  withClientMutation<AddClientMutation, AddClientMutationVariables>(AddClientDocument,
    { payload: { name: client.name, code: client.code, districtUid: client.districtUid } },
    "createClient"
  ).then((res) => clientStore.addClient(res));
}

function editClient() {
  withClientMutation<EditClientMutation, EditClientMutationVariables>(EditClientDocument,
    {
      uid: client.uid,
      payload: {
        name: client.name,
        code: client.code,
        districtUid: client.districtUid,
      }
    },
    "updateClient"
  ).then((res) => clientStore.updateClient(res));
}

function getProvinces(event: Event) {
  locationStore.filterProvincesByCountry(countryUid.value!);
}

function getDistricts(event: Event) {
  locationStore.filterDistrictsByProvince(provinceUid.value!);
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

function FormManager(create: boolean, target: string, obj: IClient = {} as IClient) {
  createItem.value = create;
  targetItem.value = target;
  formTitle.value = (create ? "CREATE" : "EDIT") + " " + target.toUpperCase();
  if (target == "client") showClientModal.value = true;
  if (create) {
    if (target == "client") Object.assign(client, {} as IClient);
  } else {
    if (target == "client") Object.assign(client, { ...obj });
  }
}

function saveForm() {
  if (createItem.value) addClient();
  if (!createItem.value) editClient();
  showClientModal.value = false;
}

const countNone = computed(
  () => clients?.value?.length + " of " + clientStore.getClientCount + " clients"
);
</script>

<template>
  <fel-heading title="Clients">
    <fel-button 
      v-show="shield.hasRights(shield.actions.CREATE, shield.objects.CLIENT)"
      @click="FormManager(true, 'client')"
    >
      Add client
    </fel-button>
  </fel-heading>

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
  <!-- Location Edit Form Modal -->
  <fel-modal v-if="showClientModal" @close="showClientModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Name</span>
            <input 
              class="form-input mt-1 block w-full" 
              v-model="client.name" 
              placeholder="Name ..." 
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Code</span>
            <input 
              class="form-input mt-1 block w-full" 
              v-model="client.code" 
              placeholder="Code ..." 
            />
          </label>
        </div>

        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Country</span>
            <select 
              class="form-select block w-full mt-1" 
              v-model="countryUid" 
              @change="getProvinces($event)"
            >
              <option></option>
              <option 
                v-for="country in countries" 
                :key="country.uid" 
                :value="country.uid"
              >
                {{ country.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">Province</span>
            <select 
              class="form-select block w-full mt-1" 
              v-model="provinceUid" 
              @change="getDistricts($event)"
            >
              <option></option>
              <option 
                v-for="province in provinces" 
                :key="province.uid" 
                :value="province.uid"
              >
                {{ province.name }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-foreground">District</span>
            <select 
              class="form-select block w-full mt-1" 
              v-model="client.districtUid"
            >
              <option></option>
              <option 
                v-for="district in districts" 
                :key="district.uid" 
                :value="district.uid"
              >
                {{ district.name }}
              </option>
            </select>
          </label>
        </div>

        <hr />
        <button 
          type="button" 
          @click.prevent="saveForm()"
          class="m-2 -mb-4 w-full rounded-sm border border-primary bg-primary px-4 py-2 text-primary-foreground transition-colors duration-500 ease select-none hover:bg-primary focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </fel-modal>
</template>

<style lang="postcss"></style>
