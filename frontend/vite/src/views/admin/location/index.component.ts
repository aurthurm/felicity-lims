import { defineComponent, ref, reactive, computed } from 'vue';
import { useMutation } from '@urql/vue';
import modal from '../../../components/SimpleModal.vue';
import { 
  Country, 
  Province, 
  District, 
  GenericLocation 
} from '../../../store/common';
import { ADD_COUNTRY, UPDATE_COUNTRY, ADD_PROVINCE, ADD_DISTRICT, UPDATE_DISTRICT, UPDATE_PROVINCE } from '../../../graphql/admin.mutations';
import store from '../../../store';

export const ICountry = typeof Country;
import { ActionTypes } from '../../../store/modules/admin';

export default defineComponent({
  name: 'location',
  components: {
    modal,
  },
  setup() {
    const nullCountry = new Country();
    const nullProvince = new Province();
    const nullDistrict = new District();
    const nullLocation = new GenericLocation();

    let createLocation = ref(true);
    let showModal = ref(false);
    let targetLocation = ref('');

    let country = reactive({ ...nullCountry });
    let province = reactive({ ...nullProvince });
    let district = reactive({ ...nullDistrict });
    let form = reactive({ ...nullLocation });
    let formTitle = ref('');

    store.dispatch(ActionTypes.FETCH_COUNTRIES);   

    const { executeMutation: createCountry } = useMutation(ADD_COUNTRY);
    const { executeMutation: updateCountry } = useMutation(UPDATE_COUNTRY);
    const { executeMutation: createProvince } = useMutation(ADD_PROVINCE);
    const { executeMutation: updateProvince } = useMutation(UPDATE_PROVINCE);
    const { executeMutation: createDistrict } = useMutation(ADD_DISTRICT);
    const { executeMutation: updateDistrict } = useMutation(UPDATE_DISTRICT);

    function addCountry():void {
      createCountry({ name: form.name, code: form.code }).then((result) => {
        Object.assign(country, result);
      });
    }

    function editCountry():void {
      updateCountry({ uid: form.uid, name: form.name, code: form.code, active: true }).then(
        (result) => {
          Object.assign(country, result);
        },
      );
    }

    function addProvince():void {
      createProvince({name: form.name, code:form.code, countryUid: country.uid}).then((result) => {
        Object.assign(province, result);
      });
    }

    function editProvince():void {
      updateProvince({ uid: form.uid, name: form.name, code: form.code, active: true }).then(
        (result) => {
          Object.assign(province, result);
        },
      );
    }

    function addDistrict():void {
      createDistrict({name: form.name, code:form.code, provinceUid: province.uid}).then((result) => {
        Object.assign(district, result);
      });
    }

    function editDistrict():void {
      updateDistrict({ uid: form.uid, name: form.name, code: form.code, active: true }).then(
        (result) => {
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

    let selectLocation = (target: string, selected: any): void => {
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

    let resetSelected = (target: string):void => {
      if (target === 'country') {
        Object.assign(country, { ...nullCountry });
        Object.assign(province, { ...nullProvince });
        Object.assign(district, { ...nullDistrict });
      }
      if (target === 'province') {
        Object.assign(province, { ...nullProvince });
        Object.assign(district, { ...nullDistrict });
      }
      if (target === 'district') Object.assign(district, { ...nullDistrict });
    };

    function FormManager(create: boolean, target: string, locationObj: Location):void {
      createLocation.value = create;
      targetLocation.value = target;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + target.toUpperCase();
      if (create) {
        resetSelected(target);
        Object.assign(form, { ...nullLocation });
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

    return {
      showModal,
      FormManager,
      form,
      saveForm,
      formTitle,
      isCountrySelected,
      isProvinceSelected,
      selectLocation,
      country,
      countries: computed(() => store.getters.getCountries),
      province,
      provinces: computed(() => store.getters.getProvinces),
      district,
      districts: computed(() => store.getters.getDistricts),
    };
  },
});