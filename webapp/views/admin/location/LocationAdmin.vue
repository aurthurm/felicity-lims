<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useForm } from "vee-validate";
import { object, string } from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import  useApiUtil  from '@/composables/api_util';

const locationStore = useLocationStore()
const { withClientMutation } = useApiUtil()

interface IForm extends CountryType, ProvinceType, DistrictType {
  countryUid: string,
  provinceUid: string
};

let createLocation = ref<boolean>(true);
let showModal = ref<boolean>(false);
let targetLocation = ref<string>('');

let country = reactive({}) as CountryType;
let province = reactive({}) as ProvinceType;
let district = reactive({}) as DistrictType;
let formTitle = ref<string>('');
const currentUid = ref<string | null>(null);

const formSchema = object({
  name: string().required("Name is required"),
  code: string().required("Code is required"),
  countryUid: string().nullable(),
  provinceUid: string().nullable(),
});

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    code: "",
    countryUid: null,
    provinceUid: null,
  },
});

locationStore.fetchCountries();
const countries = computed(() => locationStore.getCountries)

function addCountry(payload: { name: string; code: string }): void {
  withClientMutation<AddCountryMutation, AddCountryMutationVariables>(AddCountryDocument, { payload }, "createCountry").then((result) => {
    locationStore.addCountry(result)
    Object.assign(country, result);
  });
}

function editCountry(payload: { name: string; code: string }): void {
  if (!currentUid.value) {
    return;
  }
  const incoming = { ...payload, active: true };
  withClientMutation<EditCountryMutation, EditCountryMutationVariables>(EditCountryDocument, { uid: currentUid.value, payload: incoming }, "updateCountry").then(
    (result) => {
      locationStore.updateCountry(result)
      Object.assign(country, result);
    },
  );
}

function addProvince(payload: { name: string; code: string }): void {
  const incoming = { ...payload, countryUid: country.uid };
  withClientMutation<AddProvinceMutation, AddProvinceMutationVariables>(AddProvinceDocument, { payload: incoming }, "createProvince").then((result) => {
    locationStore.addProvince(result)
    Object.assign(province, result);
  });
}

function editProvince(payload: { name: string; code: string; countryUid?: string | null }): void {
  if (!currentUid.value) {
    return;
  }
  const incoming = { ...payload, active: true };
  withClientMutation<EditProvinceMutation, EditProvinceMutationVariables>(EditProvinceDocument, { uid: currentUid.value, payload: incoming }, "updateProvince").then(
    (result) => {
      locationStore.updateProvince(result)
      Object.assign(province, result);
    },
  );
}

function addDistrict(payload: { name: string; code: string }): void {
  const incoming = { ...payload, provinceUid: province.uid };
  withClientMutation<AddDistrictMutation, AddDistrictMutationVariables>(AddDistrictDocument, { payload: incoming }, "createDistrict").then((result) => {
    locationStore.addDistrict(result)
    Object.assign(district, result);
  });
}

function editDistrict(payload: { name: string; code: string; provinceUid?: string | null }): void {
  if (!currentUid.value) {
    return;
  }
  const incoming = { ...payload, active: true };
  withClientMutation<EditDistrictMutation, EditDistrictMutationVariables>(EditDistrictDocument, { uid: currentUid.value, payload: incoming }, "updateDistrict").then(
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

</script>>


<template>
  <div class="space-y-6">
    <div class="grid grid-cols-12 gap-6">
      <section class="col-span-3">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-foreground">Countries</h2>
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            @click="FormManager(true, 'country')">
            Add Country
          </button>
        </div>
        <div class="rounded-md border h-[70vh] overflow-y-auto">
          <div v-for="c in countries" :key="c.uid"
            :class="country?.uid === c.uid ? 'flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted' : 'flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted'">
            <a @click.prevent.stop="selectLocation('country', c)" class="font-medium text-foreground">
              <span>{{ c.name }}</span>
            </a>
            <button @click="FormManager(false, 'country', c)" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
              <font-awesome-icon icon="pen" />
            </button>
          </div>
        </div>
      </section>

      <section class="col-span-4" v-if="isCountrySelected()">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-foreground">Provinces</h2>
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            @click="FormManager(true, 'province')">
            Add Province
          </button>
        </div>
        <div class="rounded-md border h-[70vh] overflow-y-auto">
          <div v-for="p in provinces" :key="p.uid"
            :class="province?.uid === p.uid ? 'flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted' : 'flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted'">
            <a @click.prevent.stop="selectLocation('province', p)" class="font-medium text-foreground">
              <span>{{ p.name }}</span>
            </a>
            <button @click="FormManager(false, 'province', p)" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
              <font-awesome-icon icon="pen" />
            </button>
          </div>
        </div>
      </section>

      <section class="col-span-5" v-if="isProvinceSelected()">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-semibold text-foreground">Districts</h2>
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            @click="FormManager(true, 'district')">
            Add District
          </button>
        </div>
        <div class="rounded-md border h-[70vh] overflow-y-auto">
          <div v-for="d in districts" :key="d.uid"
            :class="district?.uid === d.uid ? 'flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted' : 'flex items-center justify-between p-4 border-b hover:bg-muted/50 data-[state=selected]:bg-muted'">
            <a @click.prevent.stop="selectLocation('district', d)" class="font-medium text-foreground">
              <span>{{ d.name }}</span>
            </a>
            <button @click="FormManager(false, 'district', d)" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
              <font-awesome-icon icon="pen" />
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- Location Edit Form Modal -->
  <Modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3 class="text-lg font-semibold text-foreground">{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <Form class="space-y-6" @submit="saveForm">
        <div class="grid grid-cols-2 gap-6">
          <FormField name="name" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Name ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="code" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Code ..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <hr class="border-border" />
        <Button type="submit" class="w-full">
          Save Form
        </Button>
      </Form>
    </template>
  </Modal>
</template>

<style lang="postcss" scoped>
/* Removed custom styles as they're now handled by the style guide classes */
</style>
