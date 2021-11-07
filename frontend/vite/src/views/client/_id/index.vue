<template>
  <div class="">

    <div class="grid grid-cols-12 gap-4 mt-2">

      <section class="col-span-12" >

        <!-- Listing Item Card -->
        <div class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4" >
          <div class="grid grid-cols-12 gap-3">
            <!-- Summary Column -->
            <div class="col-span-12 px-3 sm:px-0">
              <div class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold">
                <span>{{ client?.name }}</span>
                <div>
                  <button
                    @click="FormManager(false, 'client', client)"
                    class="ml-4 inline-flex items-center justify-center w-8 h-8 mr-2 border-blue-500 border text-gray-900 transition-colors duration-150 bg-white rounded-full focus:outline-none hover:bg-gray-200"
                  >
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path
                        d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              <hr />
              <div class="grid grid-cols-2 mt-2">
                <div class="col-span-1">
                  <!-- Client Details -->
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Province:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ client?.name }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">District:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ client?.district?.name }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Code:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ client?.code }}</span>
                  </div>
                </div>
                <div class="col-span-1">
                  <!-- Communication Details -->
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Email:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ client?.email }}</span>
                  </div>
                  <div class="flex">
                    <span class="text-gray-800 text-sm font-medium w-16">Mobile:</span>
                    <span class="text-gray-600 text-sm md:text-md">{{ client?.mobilePhone }}</span>
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
            <input
              class="form-input mt-1 block w-full"
              v-model="client.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Code</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="client.code"
              placeholder="Code ..."
            />
          </label>
        </div>

        <div class="grid grid-cols-3 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Country</span>
            <select class="form-select block w-full mt-1" v-model="countryUid" @change="getProvinces($event)">
              <option></option>
              <option v-for="country in countries" :key="country.uid" :value="country.uid"> {{ country.name }} {{ country.uid }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Province</span>
            <select class="form-select block w-full mt-1" v-model="provinceUid" @change="getDistricts($event)">
               <option></option>
              <option v-for="province in provinces" :key="province.uid" :value="province.uid"> {{ province.name }} {{ province.uid }}</option>
            </select>
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">District</span>
            <select class="form-select block w-full mt-1" v-model="client.districtUid">
               <option></option>
              <option v-for="district in districts" :key="district.uid" :value="district.uid"> {{ district.name }} {{ district.uid }}</option>
            </select>
          </label>
        </div>

        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>
</template>

<style lang="postcss">
.scroll-section {
  height: 400px;
}

.tab-active {
  border-bottom: 2px solid rgb(194, 193, 193);
  color: rgb(37, 37, 37) !important;
}

.c-active {
  background-color: lightblue;
}
</style>

<script scope="ts">
import modal from '../../../components/SimpleModal.vue';

import { useMutation, useQuery } from '@urql/vue';
import { mapGetters, useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { defineComponent, ref, reactive, computed } from 'vue';

import { Client } from '../../../store/modules/clients';
import {  GET_ALL_CLIENTS, GET_CLIENT_CONTACTS_BY_CLIENT_UID } from '../../../graphql/clients.queries';
import { ADD_CLIENT, EDIT_CLIENT } from '../../../graphql/clients.mutations';
import {
  GET_ALL_COUNTRIES,
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../../graphql/admin.queries';

export const IClient = typeof Client;
import { ActionTypes } from '../../../store/modules/clients';
import { ActionTypes as AdminActionTypes } from '../../../store/modules/admin';

export default defineComponent({
  name: 'clients-conf',
  components: {
    modal,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    let showClientModal = ref(false);
    let createItem = ref(null);
    let targetItem = ref('');

    let provinces = ref([]);
    let districts = ref([]);

    let countryUid = ref(null);
    let provinceUid = ref(null);
    let clientParams = reactive({ 
      first: null, 
      after: null,
      text: null, 
      sortBy: ["name"]
    });

    let formTitle = ref('');

    store.dispatch(ActionTypes.FETCH_CLIENT_BY_UID, +route.query.clientUid)
    let client = computed(() => store.getters.getClient);
    const resetClient = () => Object.assign(client, { ...(new Client()) })

    store.dispatch(AdminActionTypes.FETCH_COUNTRIES);
    // store.dispatch(ActionTypes.FETCH_CLIENTS, clientParams);

    const { executeMutation: createClient } = useMutation(ADD_CLIENT);
    const { executeMutation: updateClient } = useMutation(EDIT_CLIENT);

    const provincesfilter = useQuery({
      query: FILTER_PROVINCES_BY_COUNTRY,
      variables: { uid: countryUid },
      pause: computed(() => countryUid !== null),
      requestPolicy: 'network-only',
    });

    const districtsfilter = useQuery({
      query: FILTER_DISTRICTS_BY_PROVINCE,
      variables: { uid: provinceUid },
      pause: computed(() => provinceUid !== null),
      requestPolicy: 'network-only',
    });

    function addClient() {
      createClient({ name: client.name, code: client.code, districtUid: client.districtUid }).then((result) => {
        Object.assign(client, result.data.createClient.createClient);
      });
    }

    function editClient() {
      updateClient({ uid: client.uid, name: client.name, code: client.code, districtUid: client.districtUid }).then((result) => {
        Object.assign(client, result.data.updateClient.updateClient);
      });
    }

    function getProvinces(event) {
      provincesfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        provinces.value = result.data.value?.provincesByCountryUid;
      });
    }

    function getDistricts(event) {
      districtsfilter.executeQuery({requestPolicy: 'network-only'}).then(result => {
        districts.value = result.data.value?.districtsByProvinceUid;
      });
    }

    function FormManager(create, target, obj) {
      createItem.value = create;
      targetItem.value = target;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + target.toUpperCase();
      if(target == "client") showClientModal.value = true;
      if (create) {
        if(target == "client") Object.assign(client, { ...(new Client()) });
      } else {
        if(target == "client") Object.assign(client, { ...obj });
      }
    }

    function saveForm() {
      if (createItem.value) addClient();
      if (!createItem.value) editClient();
      showClientModal.value = false;
    }

    return {
      showClientModal,
      FormManager,
      saveForm,
      formTitle,
      client,
      clients: computed(() => store.getters.getClients),
      countries: computed(() => store.getters.getCountries),
      countryUid,
      provinceUid,
      getProvinces,
      provinces,
      getDistricts,
      districts,
    };
  },
});
</script>
