<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import {
  ICountry,
  IProvince,
  IDistrict
} from '../../../models/location';
import {
  ADD_COUNTRY, UPDATE_COUNTRY,
  ADD_PROVINCE, ADD_DISTRICT,
  UPDATE_DISTRICT, UPDATE_PROVINCE
} from '../../../graphql/operations/admin.mutations';

import { useLocationStore } from '../../../stores';
import { useApiUtil } from '../../../composables';
const modal = defineAsyncComponent(
  () => import('../../../components/SimpleModal.vue')
)

const locationStore = useLocationStore()
const { withClientMutation } = useApiUtil()

interface IForm extends ICountry, IProvince, IDistrict {
  countryUid: string,
  provinceUid: string
};

let createLocation = ref<boolean>(true);
let showModal = ref<boolean>(false);
let targetLocation = ref<string>('');

let country = reactive({}) as ICountry;
let province = reactive({}) as IProvince;
let district = reactive({}) as IDistrict;
let form = reactive({}) as IForm;
let formTitle = ref<string>('');

locationStore.fetchCountries();
const countries = computed(() => locationStore.getCountries)

function addCountry(): void {
  const payload = { name: form.name, code: form.code }
  withClientMutation(ADD_COUNTRY, { payload }, "createCountry").then((result) => {
    locationStore.addCountry(result)
    Object.assign(country, result);
  });
}

function editCountry(): void {
  const payload = { name: form.name, code: form.code, active: true }
  withClientMutation(UPDATE_COUNTRY, { uid: form.uid, payload }, "updateCountry").then(
    (result) => {
      locationStore.updateCountry(result)
      Object.assign(country, result);
    },
  );
}

function addProvince(): void {
  const payload = { name: form.name, code: form.code, countryUid: country.uid }
  withClientMutation(ADD_PROVINCE, { payload }, "createProvince").then((result) => {
    locationStore.addProvince(result)
    Object.assign(province, result);
  });
}

function editProvince(): void {
  const payload = { name: form.name, code: form.code, active: true, countryUid: +form.countryUid }
  withClientMutation(UPDATE_PROVINCE, { uid: form.uid, payload }, "updateProvince").then(
    (result) => {
      locationStore.updateProvince(result)
      Object.assign(province, result);
    },
  );
}

function addDistrict(): void {
  const payload = { name: form.name, code: form.code, provinceUid: province.uid }
  withClientMutation(ADD_DISTRICT, { payload }, "createDistrict").then((result) => {
    locationStore.addDistrict(result)
    Object.assign(district, result);
  });
}

function editDistrict(): void {
  const payload = { name: form.name, code: form.code, active: true, provinceUid: +form.provinceUid }
  withClientMutation(UPDATE_DISTRICT, { uid: form.uid, payload }, "updateDistrict").then(
    (result) => {
      locationStore.updateDistrict(result)
      Object.assign(district, result);
    },
  );
}

function isCountrySelected(): boolean {
  return country.uid !== undefined;
}

function isProvinceSelected(): boolean {
  return province.uid !== undefined;
}


const provinces = computed(() => locationStore.getProvinces)
const districts = computed(() => locationStore.getDistricts)

let selectLocation = (target: string, selected: ICountry | IProvince | IDistrict): void => {
  if (target === 'country') {
    Object.assign(country, { ...selected });
    locationStore.filterProvincesByCountry(selected.uid!);
  };

  if (target === 'province') {
    Object.assign(province, { ...selected });
    locationStore.filterDistrictsByProvince(selected.uid!);
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

function FormManager(create: boolean, target: string, locationObj = {} as any): void {
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

function saveForm(): void {
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


<template>
  <div class="mt-4">
    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-3">
        <div class="w-full flex justify-between items-center pr-4">
          <h2 class="text-l font-semibold inline uppercase">Countries</h2>
          <button
            class="p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
            @click="FormManager(true, 'country')">
            Add Country
          </button>
        </div>
        <div class="overflow-y-scroll overscroll-contain scroll-section">
          <div v-for="c in countries" :key="c.uid"
            :class="country?.uid === c.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border'">
            <a href="#" @click.prevent.stop="selectLocation('country', c)" class="font-semibold text-gray-700">
              <span>{{ c.name }}</span>
            </a>
            <a href="#" @click="FormManager(false, 'country', c)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section class="col-span-4" v-if="isCountrySelected()">
        <div class="w-full flex justify-between items-center pr-4">
          <h2 class="text-l font-semibold inline uppercase">Provinces</h2>
          <button
            class="p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
            @click="FormManager(true, 'province')">
            Add Province
          </button>
        </div>
        <div class="overflow-y-scroll overscroll-contain scroll-section">
          <div v-for="p in provinces" :key="p.uid"
            :class="province?.uid === p.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border'">
            <a href="#" @click.prevent.stop="selectLocation('province', p)" class="font-semibold text-gray-700">
              <span>{{ p.name }}</span>

            </a>
            <a href="#" @click="FormManager(false, 'province', p)" class="px-2 cursor">
              <font-awesome-icon icon="pen" />
            </a>
          </div>
        </div>
      </section>

      <section class="col-span-5" v-if="isProvinceSelected()">
        <div class="w-full flex justify-between items-center pr-4">
          <h2 class="text-l font-semibold inline uppercase">Districts</h2>
          <button
            class="p-2 my-2 ml-8 text-sm border-sky-800 border text-dark-700 transition-colors duration-150 rounded-sm focus:outline-none hover:bg-sky-800 hover:text-gray-100"
            @click="FormManager(true, 'district')">
            Add District
          </button>
        </div>
        <div class="overflow-y-scroll overscroll-contain scroll-section">
          <div v-for="d in districts" :key="d.uid"
            :class="district?.uid === d.uid ? 'bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border c-active' : 'bg-white w-full flex justify-between p-2 mb-1 rounded-l-sm shadow border'">
            <a href="#" @click.prevent.stop="selectLocation('district', d)" class="font-semibold text-gray-700">
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
            <input class="form-input mt-1 block w-full" v-model="form.name" placeholder="Name ..." />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Code</span>
            <input class="form-input mt-1 block w-full" v-model="form.code" placeholder="Code ..." />
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
