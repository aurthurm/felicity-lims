<template>
  <div class="mt-4">
    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-3">
        Countries
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, 'country')"
        >
          Add Country
        </button>
        <div class="overflow-y-scroll overscroll-contain scroll-section pr-8">
          <div
            v-for="c in countries"
            :key="c.uid"
            :class="country?.uid === c.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border' "
          >
            <a
              href="#"
              @click.prevent.stop="selectLocation('country', c)"
              class="font-semibold text-gray-700"
            >
              <span>{{ c.name }}</span>
            </a>
            <a href="#" @click="FormManager(false, 'country', c)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section class="col-span-4" v-if="isCountrySelected()">
        Provinces
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, 'province')"
        >
          Add Province
        </button>
        <div class="overflow-y-scroll overscroll-contain scroll-section pr-8">
          <div
            v-for="p in provinces"
            :key="p.uid"
            :class="province?.uid === p.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border' "
          >
            <a
              href="#"
              @click.prevent.stop="selectLocation('province', p)"
              class="font-semibold text-gray-700"
            >
              <span>{{ p.name }}</span>
              
            </a>
            <a href="#" @click="FormManager(false, 'province', p)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section class="col-span-5" v-if="isProvinceSelected()">
        Districts
        <button
          class="p-2 my-2 ml-8 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
          @click="FormManager(true, 'district')"
        >
          Add District
        </button>
        <div class="overflow-y-scroll overscroll-contain scroll-section pr-8">
          <div
            v-for="d in districts"
            :key="d.uid"
            :class="district?.uid === d.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l shadow border' "
          >
            <a
              href="#"
              @click.prevent.stop="selectLocation('district', d)"
              class="font-semibold text-gray-700"
            >
              <span>{{ d.name }}</span>
            </a>
            <a href="#" @click="FormManager(false, 'district', d)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>
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
            <span class="text-gray-700">Name</span>
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
              placeholder="Code ..."
            />
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

<style lang="postcss" scoped>
  .scroll-section {
    height: 70vh;
  }

  .tab-active {
    border-bottom: 2px solid rgb(194, 193, 193);
    color: rgb(37, 37, 37) !important;
  }

  .c-active {
    background-color: lightblue;
  }
</style>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useMutation } from '@urql/vue';
  import modal from '../../../components/SimpleModal.vue';
  import { 
    ICountry, 
    IProvince, 
    IDistrict
  } from '../../../models/location';
  import { ADD_COUNTRY, UPDATE_COUNTRY, ADD_PROVINCE, ADD_DISTRICT, UPDATE_DISTRICT, UPDATE_PROVINCE } from '../../../graphql/admin.mutations';
  import store from '../../../store';

  import { ActionTypes } from '../../../store/modules/admin';

  interface IForm extends ICountry, IProvince, IDistrict {
    countryUid: number,
    provinceUid: number
  };

  let createLocation = ref<boolean>(true);
  let showModal = ref<boolean>(false);
  let targetLocation = ref<string>('');

  let country = reactive({}) as ICountry;
  let province = reactive({}) as IProvince;
  let district = reactive({}) as IDistrict;
  let form = reactive({}) as IForm;
  let formTitle = ref<string>('');

  store.dispatch(ActionTypes.FETCH_COUNTRIES);   
  const countries = computed(() => store.getters.getCountries)

  const { executeMutation: createCountry } = useMutation(ADD_COUNTRY);
  const { executeMutation: updateCountry } = useMutation(UPDATE_COUNTRY);
  const { executeMutation: createProvince } = useMutation(ADD_PROVINCE);
  const { executeMutation: updateProvince } = useMutation(UPDATE_PROVINCE);
  const { executeMutation: createDistrict } = useMutation(ADD_DISTRICT);
  const { executeMutation: updateDistrict } = useMutation(UPDATE_DISTRICT);

  function addCountry():void {
    const payload = { name: form.name, code: form.code }
    createCountry({ payload }).then((result) => {
      store.dispatch(ActionTypes.ADD_COUNTRY, result?.data?.createCountry)
      Object.assign(country, result?.data?.createCountry);
    });
  }

  function editCountry():void {
    const payload = {name: form.name, code: form.code, active: true}
    updateCountry({ uid: form.uid, payload }).then(
      (result) => {
        store.dispatch(ActionTypes.UPDATE_COUNTRY, result?.data?.updateCountry)
        Object.assign(country, result?.data?.updateCountry);
      },
    );
  }

  function addProvince():void {
    const payload = {name: form.name, code:form.code, countryUid: country.uid}
    createProvince({ payload }).then((result) => {
      store.dispatch(ActionTypes.ADD_PROVINCE, result?.data?.createProvince)
      Object.assign(province, result?.data?.createProvince);
    });
  }

  function editProvince():void {
    const payload = {name: form.name, code: form.code, active: true, countryUid: +form.countryUid}
    updateProvince({ uid: form.uid, payload }).then(
      (result) => {
        store.dispatch(ActionTypes.UPDATE_PROVINCE, result?.data?.updateProvince)
        Object.assign(province, result?.data?.updateProvince);
      },
    );
  }

  function addDistrict():void {
    const payload = {name: form.name, code:form.code, provinceUid: province.uid}
    createDistrict({ payload }).then((result) => {
      store.dispatch(ActionTypes.ADD_DISTRICT, result?.data?.createDistrict)
      Object.assign(district, result?.data?.createDistrict);
    });
  }

  function editDistrict():void {
    const payload = {name: form.name, code: form.code, active: true, provinceUid: +form.provinceUid}
    updateDistrict({ uid: form.uid, payload }).then(
      (result) => {
        store.dispatch(ActionTypes.UPDATE_DISTRICT, result?.data?.updateDistrict)
        Object.assign(district, result?.data?.updateDistrict);
      },
    );
  }

  function isCountrySelected(): boolean {
    return country.uid !== undefined;
  }

  function isProvinceSelected(): boolean {
    return province.uid !== undefined;
  }


  const provinces = computed(() => store.getters.getProvinces)
  const districts = computed(() => store.getters.getDistricts)

  let selectLocation = (target: string, selected: ICountry | IProvince | IDistrict): void => {
    if (target === 'country') { 
      Object.assign(country, { ...selected });
      store.dispatch(ActionTypes.FILTER_PROVINCES_BY_COUNTRY, selected.uid);
    };

    if (target === 'province') {
      Object.assign(province, { ...selected });
      store.dispatch(ActionTypes.FILTER_DISTRICTS_BY_PROVINCE, selected.uid);
    };

    if (target === 'district') Object.assign(district, { ...selected });
  };

  let resetSelected = (target: string): void => {
    if (target === 'country') {
      Object.assign(country, {} as ICountry);
      Object.assign(province, {} as IProvince);
      Object.assign(district, {} as IDistrict);
    }
    if (target === 'province') {
      Object.assign(province, {} as IProvince);
      Object.assign(district, {} as IDistrict);
    }
    if (target === 'district') Object.assign(district, {} as IDistrict);
  };

  function FormManager(create: boolean, target: string, locationObj: IForm = {} as IForm): void {
    createLocation.value = create;
    targetLocation.value = target;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + target.toUpperCase();
    if (create) {
      resetSelected(target);
      Object.assign(form, {} as IForm);
    } else {
      Object.assign(form, { ...locationObj });
    }
  }

  function saveForm():void {
    if (targetLocation.value === 'country') {
      if (createLocation.value === true) addCountry();
      if (createLocation.value === false) editCountry();
    }
    if (targetLocation.value === 'province') {
      if (createLocation.value === true) addProvince();
      if (createLocation.value === false) editProvince();
    }
    if (targetLocation.value === 'district') {
      if (createLocation.value === true) addDistrict();
      if (createLocation.value === false) editDistrict();
    }
    showModal.value = false;
  }

</script>>
