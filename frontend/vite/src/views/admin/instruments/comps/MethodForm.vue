<template>
  <form action="post" class="p-1">
    <div class="grid grid-cols-2 gap-x-4 mb-4">
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Method Name</span>
        <input
          class="form-input mt-1 block w-full"
          v-model="method.name"
          placeholder="Name ..."
        />
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">keyword</span>
        <input
          class="form-input mt-1 block w-full"
          v-model="method.keyword"
          placeholder="Keyword ..."
        />
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Description</span>
        <textarea
        cols="2"
          class="form-input mt-1 block w-full"
          v-model="method.description"
          placeholder="Description ..."
        />
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Instruments</span>
        <select class="form-select mt-1 w-full" v-model="method.instruments">
          <option></option>
          <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid"> {{ instrument?.name }}</option>
        </select>
      </label>
      <label class="block col-span-2 mb-2">
        <span class="text-gray-700">Analyses</span>
        <select class="form-select mt-1 w-full" v-model="method.analyses">
          <option></option>
          <option v-for="instrument in instruments" :key="instrument?.uid" :value="instrument.uid"> {{ instrument?.name }}</option>
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

<script setup lang="ts">

  import { useMutation } from '@urql/vue';
  import { ref, reactive, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ActionTypes } from '../../../../store/modules/setup';
  import { IInstrument, IMethod } from '../../../../models/setup'
  import { ADD_METHOD, EDIT_METHOD  } from '../../../../graphql/instrument.mutations';

    let store = useStore();

    let showModal = ref(false);
    let formTitle = ref('');
    const formAction = ref(true);

    let method = reactive({}) as IMethod;

    store.dispatch(ActionTypes.FETCH_INSTRUMENTS);
    const instruments = computed<IInstrument[]>(() => store.getters.getInstruments)

    store.dispatch(ActionTypes.FETCH_METHODS);
    const methods = computed<IMethod[]>(() => store.getters.getMethods) 

    const { executeMutation: createMethod } = useMutation(ADD_METHOD);
    const { executeMutation: updateMethod } = useMutation(EDIT_METHOD);

    function addMethod(): void {
      const payload = { name: method.name, keyword: method.keyword, description: method.description}
      createMethod({ payload }).then((result) => {
       store.dispatch(ActionTypes.ADD_METHOD, result);
      });
    }

    function editMethod(): void {
      const payload = { name: method.name, keyword: method.keyword, description: method.description }
      updateMethod({ uid: method.uid, payload }).then((result) => {
        store.dispatch(ActionTypes.UPDATE_METHOD, result);
      });
    }

    function selectMethod(obj: IMethod): void {
      Object.assign(method, { ...obj})
    }
    
    function resetMethod(): void {
      Object.assign(method, { ...({} as IMethod)})
    }

    function FormManager(create: boolean, obj = {} as IMethod): void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "ANALYSES METHOD";
      if (create) {
        Object.assign(method, { ...{} as IMethod });
      } else {
        Object.assign(method, { ...obj });
      }
    }

    function saveForm():void {
      if (formAction.value === true) addMethod();
      if (formAction.value === false) editMethod();
      showModal.value = false;
    }
</script>