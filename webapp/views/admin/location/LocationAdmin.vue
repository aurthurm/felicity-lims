<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";
import {
  CountryType,
  ProvinceType,
  DistrictType
} from '@/types/gql';
import {
  AddCountryDocument, AddCountryMutation, AddCountryMutationVariables,
  EditCountryDocument, EditCountryMutation, EditCountryMutationVariables,
  AddProvinceDocument, AddProvinceMutation, AddProvinceMutationVariables,
  AddDistrictDocument, AddDistrictMutation, AddDistrictMutationVariables,
  EditDistrictDocument, EditDistrictMutation, EditDistrictMutationVariables,
  EditProvinceDocument, EditProvinceMutation, EditProvinceMutationVariables
} from '@/graphql/operations/admin.mutations';

import { useLocationStore } from '@/stores/location';
import useApiUtil from '@/composables/api_util';
import FelButton from '@/components/ui/buttons/FelButton.vue';
import FelSelect from '@/components/ui/select/FelSelect.vue';

const locationStore = useLocationStore();
const { withClientMutation } = useApiUtil();

let createLocation = ref<boolean>(true);
let showModal = ref<boolean>(false);
let targetLocation = ref<string>('');

let country = reactive({}) as CountryType;
let province = reactive({}) as ProvinceType;
let district = reactive({}) as DistrictType;
let formTitle = ref<string>('');
const currentUid = ref<string | null>(null);

// Search filters
const countrySearch = ref('');
const provinceSearch = ref('');
const districtSearch = ref('');

const formSchema = object({
  name: string().required("Name is required"),
  code: string().required("Code is required"),
  countryUid: string().nullable(),
  provinceUid: string().nullable(),
});

const { handleSubmit, errors, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    code: "",
    countryUid: null,
    provinceUid: null,
  },
});

const { value: name } = useField<string>("name");
const { value: code } = useField<string>("code");
const { value: countryUid, setValue: setCountryUid } = useField<string | null>("countryUid");
const { value: provinceUid, setValue: setProvinceUid } = useField<string | null>("provinceUid");

locationStore.fetchCountries();
const countries = computed(() => locationStore.getCountries);
const provinces = computed(() => locationStore.getProvinces);
const districts = computed(() => locationStore.getDistricts);

// Filtered lists with search
const filteredCountries = computed(() => {
  const list = countries.value;
  const q = countrySearch.value?.toLowerCase().trim() || '';
  if (!q) return list;
  return list.filter((c) =>
    (c.name || '').toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q)
  );
});

const filteredProvinces = computed(() => {
  const list = provinces.value;
  const q = provinceSearch.value?.toLowerCase().trim() || '';
  if (!q) return list;
  return list.filter((p) =>
    (p.name || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q)
  );
});

const filteredDistricts = computed(() => {
  const list = districts.value;
  const q = districtSearch.value?.toLowerCase().trim() || '';
  if (!q) return list;
  return list.filter((d) =>
    (d.name || '').toLowerCase().includes(q) || (d.code || '').toLowerCase().includes(q)
  );
});

// Select options for country/province in edit forms
const countryOptions = computed(() =>
  countries.value.map((c) => ({ value: c.uid, label: `${c.name || ''} (${c.code || ''})` }))
);

const provinceOptions = computed(() =>
  provinces.value.map((p) => ({ value: p.uid, label: `${p.name || ''} (${p.code || ''})` }))
);

function addCountry(payload: { name: string; code: string }): void {
  withClientMutation<AddCountryMutation, AddCountryMutationVariables>(AddCountryDocument, { payload }, "createCountry").then((result) => {
    locationStore.addCountry(result);
    Object.assign(country, result);
  });
}

function editCountry(payload: { name: string; code: string }): void {
  if (!currentUid.value) return;
  const incoming = { ...payload, active: true };
  withClientMutation<EditCountryMutation, EditCountryMutationVariables>(EditCountryDocument, { uid: currentUid.value, payload: incoming }, "updateCountry").then(
    (result) => {
      locationStore.updateCountry(result);
      Object.assign(country, result);
    },
  );
}

function addProvince(payload: { name: string; code: string }): void {
  const incoming = { ...payload, countryUid: country.uid };
  withClientMutation<AddProvinceMutation, AddProvinceMutationVariables>(AddProvinceDocument, { payload: incoming }, "createProvince").then((result) => {
    locationStore.addProvince(result);
    Object.assign(province, result);
  });
}

function editProvince(payload: { name: string; code: string; countryUid?: string | null }): void {
  if (!currentUid.value) return;
  const incoming = { ...payload, active: true };
  withClientMutation<EditProvinceMutation, EditProvinceMutationVariables>(EditProvinceDocument, { uid: currentUid.value, payload: incoming }, "updateProvince").then(
    (result) => {
      locationStore.updateProvince(result);
      Object.assign(province, result);
    },
  );
}

function addDistrict(payload: { name: string; code: string }): void {
  const incoming = { ...payload, provinceUid: province.uid };
  withClientMutation<AddDistrictMutation, AddDistrictMutationVariables>(AddDistrictDocument, { payload: incoming }, "createDistrict").then((result) => {
    locationStore.addDistrict(result);
    Object.assign(district, result);
  });
}

function editDistrict(payload: { name: string; code: string; provinceUid?: string | null }): void {
  if (!currentUid.value) return;
  const incoming = { ...payload, active: true };
  withClientMutation<EditDistrictMutation, EditDistrictMutationVariables>(EditDistrictDocument, { uid: currentUid.value, payload: incoming }, "updateDistrict").then(
    (result) => {
      locationStore.updateDistrict(result);
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

function selectLocation(target: string, selected: CountryType | ProvinceType | DistrictType): void {
  if (target === 'country') {
    Object.assign(country, { ...selected });
    locationStore.filterProvincesByCountry(selected.uid!);
  }
  if (target === 'province') {
    Object.assign(province, { ...selected });
    locationStore.filterDistrictsByProvince(selected.uid!);
  }
  if (target === 'district') Object.assign(district, { ...selected });
}

function resetSelected(target: string): void {
  if (target === 'country') {
    Object.assign(country, {} as CountryType);
    Object.assign(province, {} as ProvinceType);
    Object.assign(district, {} as DistrictType);
  }
  if (target === 'province') {
    Object.assign(province, {} as ProvinceType);
    Object.assign(district, {} as DistrictType);
  }
  if (target === 'district') Object.assign(district, {} as DistrictType);
}

function clearSelection(): void {
  Object.assign(country, {} as CountryType);
  Object.assign(province, {} as ProvinceType);
  Object.assign(district, {} as DistrictType);
}

function FormManager(create: boolean, target: string, locationObj = {} as CountryType | ProvinceType | DistrictType): void {
  createLocation.value = create;
  targetLocation.value = target;
  showModal.value = true;
  formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + target.charAt(0).toUpperCase() + target.slice(1);
  if (create) {
    resetSelected(target);
    currentUid.value = null;
    resetForm({
      values: {
        name: "",
        code: "",
        countryUid: country.uid ?? null,
        provinceUid: province.uid ?? null,
      },
    });
  } else {
    currentUid.value = locationObj?.uid ?? null;
    setValues({
      name: locationObj?.name ?? "",
      code: locationObj?.code ?? "",
      countryUid: locationObj?.countryUid ?? country.uid ?? null,
      provinceUid: locationObj?.provinceUid ?? province.uid ?? null,
    });
  }
}

const saveForm = handleSubmit((values): void => {
  if (targetLocation.value === 'country') {
    if (createLocation.value === true) addCountry({ name: values.name, code: values.code });
    if (createLocation.value === false) editCountry({ name: values.name, code: values.code });
  }
  if (targetLocation.value === 'province') {
    if (createLocation.value === true) addProvince({ name: values.name, code: values.code });
    if (createLocation.value === false) editProvince({ name: values.name, code: values.code, countryUid: values.countryUid });
  }
  if (targetLocation.value === 'district') {
    if (createLocation.value === true) addDistrict({ name: values.name, code: values.code });
    if (createLocation.value === false) editDistrict({ name: values.name, code: values.code, provinceUid: values.provinceUid });
  }
  showModal.value = false;
});

// Breadcrumb trail
const breadcrumbTrail = computed(() => {
  const parts: string[] = [];
  if (country.name) parts.push(country.name);
  if (province.name) parts.push(province.name);
  if (district.name) parts.push(district.name);
  return parts;
});

const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
</script>

<template>
  <div class="space-y-6">
    <fel-heading title="Country, Provinces & Districts">
      <template #subtitle>
        <span class="text-muted-foreground">Manage geographic hierarchy for patient and client addresses.</span>
      </template>
      <FelButton @click="FormManager(true, 'country')">
        <font-awesome-icon icon="plus" class="mr-2" />
        Add Country
      </FelButton>
    </fel-heading>

    <!-- Breadcrumb trail -->
    <div v-if="breadcrumbTrail.length" class="flex items-center gap-2 text-sm">
      <span class="text-muted-foreground">Selected:</span>
      <span class="font-medium text-foreground">{{ breadcrumbTrail.join(' › ') }}</span>
      <button
        type="button"
        class="ml-2 text-xs text-muted-foreground hover:text-foreground underline"
        @click="clearSelection"
      >
        Clear selection
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Countries -->
      <section class="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        <div class="shrink-0 p-4 border-b border-border bg-muted/30">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
              <font-awesome-icon icon="flag" class="text-primary/60" />
              Countries
            </h2>
            <span class="text-xs text-muted-foreground">{{ filteredCountries.length }} total</span>
          </div>
          <div class="relative">
            <font-awesome-icon icon="magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              v-model="countrySearch"
              type="text"
              placeholder="Search countries..."
              :class="[inputClass, 'pl-9']"
            />
          </div>
        </div>
        <div class="flex-1 min-h-[200px] max-h-[400px] overflow-y-auto">
          <template v-if="filteredCountries.length">
            <button
              v-for="c in filteredCountries"
              :key="c.uid"
              type="button"
              :class="[
                'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0',
                country?.uid === c.uid
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50 text-foreground'
              ]"
              @click="selectLocation('country', c)"
            >
              <span class="font-medium truncate">{{ c.name }}</span>
              <span class="shrink-0 text-xs text-muted-foreground">{{ c.code }}</span>
              <button
                type="button"
                class="shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label="Edit country"
                @click.stop="FormManager(false, 'country', c)"
              >
                <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
              </button>
            </button>
          </template>
          <div v-else class="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
            <font-awesome-icon icon="flag" class="w-10 h-10 mb-3 opacity-40" />
            <p class="text-sm">{{ countrySearch ? 'No matches found' : 'No countries yet' }}</p>
            <FelButton v-if="!countrySearch" variant="outline" class="mt-3" @click="FormManager(true, 'country')">
              Add first country
            </FelButton>
          </div>
        </div>
      </section>

      <!-- Provinces -->
      <section class="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        <div class="shrink-0 p-4 border-b border-border bg-muted/30">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
              <font-awesome-icon icon="map" class="text-primary/60" />
              Provinces
            </h2>
            <span v-if="isCountrySelected()" class="text-xs text-muted-foreground">{{ filteredProvinces.length }} total</span>
          </div>
          <template v-if="isCountrySelected()">
            <div class="relative">
              <font-awesome-icon icon="magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                v-model="provinceSearch"
                type="text"
                placeholder="Search provinces..."
                :class="[inputClass, 'pl-9']"
              />
            </div>
          </template>
        </div>
        <div class="flex-1 min-h-[200px] max-h-[400px] overflow-y-auto">
          <template v-if="!isCountrySelected()">
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
              <font-awesome-icon icon="map" class="w-10 h-10 mb-3 opacity-40" />
              <p class="text-sm">Select a country to view provinces</p>
            </div>
          </template>
          <template v-else-if="filteredProvinces.length">
            <button
              v-for="p in filteredProvinces"
              :key="p.uid"
              type="button"
              :class="[
                'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0',
                province?.uid === p.uid
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50 text-foreground'
              ]"
              @click="selectLocation('province', p)"
            >
              <span class="font-medium truncate">{{ p.name }}</span>
              <span class="shrink-0 text-xs text-muted-foreground">{{ p.code }}</span>
              <button
                type="button"
                class="shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label="Edit province"
                @click.stop="FormManager(false, 'province', p)"
              >
                <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
              </button>
            </button>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
              <font-awesome-icon icon="map" class="w-10 h-10 mb-3 opacity-40" />
              <p class="text-sm">{{ provinceSearch ? 'No matches found' : 'No provinces yet' }}</p>
              <FelButton v-if="!provinceSearch" variant="outline" class="mt-3" @click="FormManager(true, 'province')">
                Add first province
              </FelButton>
            </div>
          </template>
        </div>
        <div v-if="isCountrySelected()" class="shrink-0 p-3 border-t border-border">
          <FelButton variant="outline" class="w-full" @click="FormManager(true, 'province')">
            <font-awesome-icon icon="plus" class="mr-2" />
            Add Province
          </FelButton>
        </div>
      </section>

      <!-- Districts -->
      <section class="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col">
        <div class="shrink-0 p-4 border-b border-border bg-muted/30">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-semibold text-foreground flex items-center gap-2">
              <font-awesome-icon icon="location-dot" class="text-primary/60" />
              Districts
            </h2>
            <span v-if="isProvinceSelected()" class="text-xs text-muted-foreground">{{ filteredDistricts.length }} total</span>
          </div>
          <template v-if="isProvinceSelected()">
            <div class="relative">
              <font-awesome-icon icon="magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                v-model="districtSearch"
                type="text"
                placeholder="Search districts..."
                :class="[inputClass, 'pl-9']"
              />
            </div>
          </template>
        </div>
        <div class="flex-1 min-h-[200px] max-h-[400px] overflow-y-auto">
          <template v-if="!isProvinceSelected()">
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
              <font-awesome-icon icon="location-dot" class="w-10 h-10 mb-3 opacity-40" />
              <p class="text-sm">Select a province to view districts</p>
            </div>
          </template>
          <template v-else-if="filteredDistricts.length">
            <button
              v-for="d in filteredDistricts"
              :key="d.uid"
              type="button"
              :class="[
                'w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors border-b border-border last:border-b-0',
                district?.uid === d.uid
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted/50 text-foreground'
              ]"
              @click="selectLocation('district', d)"
            >
              <span class="font-medium truncate">{{ d.name }}</span>
              <span class="shrink-0 text-xs text-muted-foreground">{{ d.code }}</span>
              <button
                type="button"
                class="shrink-0 p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label="Edit district"
                @click.stop="FormManager(false, 'district', d)"
              >
                <font-awesome-icon icon="pen" class="w-3.5 h-3.5" />
              </button>
            </button>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
              <font-awesome-icon icon="location-dot" class="w-10 h-10 mb-3 opacity-40" />
              <p class="text-sm">{{ districtSearch ? 'No matches found' : 'No districts yet' }}</p>
              <FelButton v-if="!districtSearch" variant="outline" class="mt-3" @click="FormManager(true, 'district')">
                Add first district
              </FelButton>
            </div>
          </template>
        </div>
        <div v-if="isProvinceSelected()" class="shrink-0 p-3 border-t border-border">
          <FelButton variant="outline" class="w-full" @click="FormManager(true, 'district')">
            <font-awesome-icon icon="plus" class="mr-2" />
            Add District
          </FelButton>
        </div>
      </section>
    </div>
  </div>

  <!-- Location Edit Form Modal -->
  <fel-modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form class="space-y-5" @submit.prevent="saveForm">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Name</label>
            <input
              v-model="name"
              type="text"
              :class="inputClass"
              placeholder="e.g. United States"
            />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Code</label>
            <input
              v-model="code"
              type="text"
              :class="inputClass"
              placeholder="e.g. US"
            />
            <p v-if="errors.code" class="text-sm text-destructive">{{ errors.code }}</p>
          </div>
        </div>

        <!-- Country selector when editing province -->
        <div v-if="targetLocation === 'province'" class="space-y-2">
          <FelSelect
            label="Country"
            name="countryUid"
            :model-value="countryUid"
            :options="countryOptions"
            @update:model-value="setCountryUid($event)"
          />
        </div>

        <!-- Province selector when editing district -->
        <div v-if="targetLocation === 'district'" class="space-y-2">
          <FelSelect
            label="Province"
            name="provinceUid"
            :model-value="provinceUid"
            :options="provinceOptions"
            @update:model-value="setProvinceUid($event)"
          />
        </div>

        <div class="flex gap-3 pt-2">
          <FelButton type="submit" class="flex-1">
            Save
          </FelButton>
          <FelButton variant="outline" type="button" @click="showModal = false">
            Cancel
          </FelButton>
        </div>
      </form>
    </template>
  </fel-modal>
</template>
