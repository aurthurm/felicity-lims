<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ClientType } from '@/types/gql';
import {FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/stores/location';

const SELECT_NONE = '__none__';

const props = withDefaults(
  defineProps<{
    client?: ClientType | null;
    create?: boolean;
  }>(),
  { client: null, create: true }
);

const emit = defineEmits<{
  (e: 'submit', payload: { name: string; code: string; districtUid: string | undefined }): void;
  (e: 'close'): void;
}>();

const locationStore = useLocationStore();
const { countries, provinces, districts } = storeToRefs(locationStore);

const clientSchema = yup.object({
  name: yup.string().required('Name is required'),
  code: yup.string().required('Code is required'),
  countryUid: yup.string().nullable(),
  provinceUid: yup.string().nullable(),
  districtUid: yup.string().nullable(),
});

const { handleSubmit, setFieldValue, setValues } = useForm({
  validationSchema: clientSchema,
  initialValues: {
    name: props.client?.name ?? '',
    code: props.client?.code ?? '',
    countryUid: props.client?.district?.province?.countryUid ?? '',
    provinceUid: props.client?.district?.provinceUid ?? '',
    districtUid: props.client?.districtUid ?? '',
  },
});

function getProvinces(countryUid: string | undefined) {
  if (countryUid) {
    locationStore.filterProvincesByCountry(countryUid);
    setFieldValue('provinceUid', '');
    setFieldValue('districtUid', '');
  } else {
    setFieldValue('provinceUid', '');
    setFieldValue('districtUid', '');
  }
}

function getDistricts(provinceUid: string | undefined) {
  if (provinceUid) {
    locationStore.filterDistrictsByProvince(provinceUid);
    setFieldValue('districtUid', '');
  } else {
    setFieldValue('districtUid', '');
  }
}

function onCountryChange(v: string) {
  const val = v === SELECT_NONE ? '' : v;
  setFieldValue('countryUid', val);
  getProvinces(val || undefined);
}

function onProvinceChange(v: string) {
  const val = v === SELECT_NONE ? '' : v;
  setFieldValue('provinceUid', val);
  getDistricts(val || undefined);
}

function onDistrictChange(v: string) {
  setFieldValue('districtUid', v === SELECT_NONE ? '' : v);
}

const onSubmit = handleSubmit((values) => {
  emit('submit', {
    name: values.name as string,
    code: values.code as string,
    districtUid: values.districtUid || undefined,
  });
});

function initFromClient(client: ClientType | null | undefined) {
  if (!client) {
    setValues({
      name: '',
      code: '',
      countryUid: '',
      provinceUid: '',
      districtUid: '',
    });
    return;
  }
  const countryUid = client?.district?.province?.countryUid ?? '';
  const provinceUid = client?.district?.provinceUid ?? '';
  setValues({
    name: client.name ?? '',
    code: client.code ?? '',
    countryUid,
    provinceUid,
    districtUid: client.districtUid ?? '',
  });
  if (countryUid) locationStore.filterProvincesByCountry(countryUid);
  if (provinceUid) locationStore.filterDistrictsByProvince(provinceUid);
}

watch(
  () => props.client,
  (client) => initFromClient(client ?? null),
  { immediate: true }
);

onMounted(() => {
  locationStore.fetchCountries();
});
</script>

<template>
  <form class="space-y-6" autocomplete="off" @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-4">
      <FormField name="name" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Client name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="code" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Code</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Client code" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <FormField name="countryUid" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Country</FormLabel>
          <FormControl>
            <Select
              :model-value="componentField.modelValue || SELECT_NONE"
              @update:model-value="onCountryChange"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="SELECT_NONE">Select country</SelectItem>
                <SelectItem
                  v-for="country in countries"
                  :key="country.uid"
                  :value="country.uid"
                >
                  {{ country.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="provinceUid" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>Province</FormLabel>
          <FormControl>
            <Select
              :model-value="componentField.modelValue || SELECT_NONE"
              @update:model-value="onProvinceChange"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="SELECT_NONE">Select province</SelectItem>
                <SelectItem
                  v-for="province in provinces"
                  :key="province.uid"
                  :value="province.uid"
                >
                  {{ province.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="districtUid" v-slot="{ componentField }">
        <FormItem>
          <FormLabel>District</FormLabel>
          <FormControl>
            <Select
              :model-value="componentField.modelValue || SELECT_NONE"
              @update:model-value="onDistrictChange"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="SELECT_NONE">Select district</SelectItem>
                <SelectItem
                  v-for="district in districts"
                  :key="district.uid"
                  :value="district.uid"
                >
                  {{ district.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div class="flex justify-end gap-2 pt-2">
      <Button type="button" variant="secondary" @click="emit('close')">
        Cancel
      </Button>
      <Button type="button" variant="outline" @click="emit('close')">
        Close
      </Button>
      <Button type="submit">Save Form</Button>
    </div>
  </form>
</template>
