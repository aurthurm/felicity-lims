<script setup lang="ts">
import DataTable from "../../components/datatable/DataTable.vue";
import { ref, reactive, computed, h } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import modal from "../../components/SimpleModal.vue";
import { IClient } from "../../models/client";
import { ADD_CLIENT, EDIT_CLIENT } from "../../graphql/clients.mutations";

import { useClientStore, useLocationStore } from "../../stores";
import { IDistrict, IProvince } from "../../models/location";
import { useApiUtil } from "../../composables";

import * as shield from "../../guards";
import PageHeading from "../components/PageHeading.vue";

const clientStore = useClientStore();
const locationStore = useLocationStore();
const { withClientMutation } = useApiUtil();

const { countries } = storeToRefs(locationStore);
const { clients, clientPageInfo, fetchingClients } = storeToRefs(clientStore);

let currentTab = ref<string>("samples");
const tabs: string[] = ["samples", "contacts"];
let currentTabComponent = computed(() => "tab-" + currentTab.value);

let showClientModal = ref<boolean>(false);
let createItem = ref<boolean>(false);
let targetItem = ref<string>("");

let provinces = ref<IProvince[]>([]);
let districts = ref<IDistrict[]>([]);

let client = reactive({}) as IClient;
const resetClient = () => Object.assign(client, {}) as IClient;

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
          "p-1 ml-2 border-white border text-gray-500rounded-smtransition duration-300 hover:border-sky-800 hover:text-sky-800 focus:outline-none",
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
    name: "Email Asdress",
    value: "email",
    sortable: false,
    sortBy: "asc",
    hidden: false,
  },
]);

let clientParams = reactive({
  first: 50,
  after: "",
  text: "",
  sortBy: ["uid"],
  filterAction: false,
});

let countryUid = ref<string>();
let provinceUid = ref<string>();

let formTitle = ref<string>("");

clientStore.fetchClients(clientParams);
locationStore.fetchCountries();

function addClient() {
  withClientMutation(
    ADD_CLIENT,
    { name: client.name, code: client.code, districtUid: client.districtUid },
    "createClient"
  ).then((res) => clientStore.addClient(res));
}

function editClient() {
  withClientMutation(
    EDIT_CLIENT,
    {
      uid: client.uid,
      name: client.name,
      code: client.code,
      districtUid: client.districtUid,
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
  <PageHeading title="Clients" />
  <button v-show="shield.hasRights(shield.actions.CREATE, shield.objects.CLIENT)"
    class="p-2 my-2 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
    @click="FormManager(true, 'client')">
    Add client
  </button>
  <hr />
  <DataTable :columns="tableColumns" :data="clients" :toggleColumns="true" :loading="fetchingClients" :paginable="true"
    :pageMeta="{
      fetchCount: clientParams.first,
      hasNextPage: clientPageInfo?.hasNextPage,
      countNone,
    }" :searchable="true" :filterable="false" @onSearchKeyUp="searchClients" @onSearchFocus="resetClient"
    @onPaginate="showMoreClients" :selectable="false">
    <template v-slot:footer> </template>
  </DataTable>

  <!-- Location Edit Form Modal -->
  <modal v-if="showClientModal" @close="showClientModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Name</span>
            <input class="form-input mt-1 block w-full" v-model="client.name" placeholder="Name ..." />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Code</span>
            <input class="form-input mt-1 block w-full" v-model="client.code" placeholder="Code ..." />
          </label>
        </div>

        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Country</span>
            <select class="form-select block w-full mt-1" v-model="countryUid" @change="getProvinces($event)">
              <option></option>
              <option v-for="country in countries" :key="country.uid" :value="country.uid">
                {{ country.name }} {{ country.uid }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Province</span>
            <select class="form-select block w-full mt-1" v-model="provinceUid" @change="getDistricts($event)">
              <option></option>
              <option v-for="province in provinces" :key="province.uid" :value="province.uid">
                {{ province.name }} {{ province.uid }}
              </option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">District</span>
            <select class="form-select block w-full mt-1" v-model="client.districtUid">
              <option></option>
              <option v-for="district in districts" :key="district.uid" :value="district.uid">
                {{ district.name }} {{ district.uid }}
              </option>
            </select>
          </label>
        </div>

        <hr />
        <button type="button" @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>

<style lang="postcss"></style>
