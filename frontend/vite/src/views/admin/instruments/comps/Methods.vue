<template>
  <div class="">
    <div class="container w-full my-4">
      <hr>
      <button
        class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
        @click="FormManager(true)"
      > Add Method</button>
      <hr>
      <!-- <input
        class="w-64 h-10 ml-6 pl-4 pr-2 py-1 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-md  focus:placeholder-gray-500 focus:border-green-100 focus:outline-none focus:shadow-outline-purple form-input"
        type="text" placeholder="Search ..." aria-label="Search"
        @keyup="searchProfile($event)"
        @focus="setProfileToNull()"
      /> -->
    </div>
    <hr />

    <div class="grid grid-cols-12 gap-4 mt-2">
      <section class="col-span-4 overflow-y-scroll overscroll-contain patient-scrol">
        <ul>
          <li 
          v-for="meth in methods"
          :key="meth?.uid"
          href="#"
          @click.prevent.stop="selectMethod(meth)"
          :class="[
            'bg-white w-full p-1 mb-1 rounded',
            { 'border-gray-100 bg-green-100': meth?.uid === method?.uid },
          ]">
            <a class="cursor-pointer">
              <div class="flex-grow p-1">
                <div class="font-medium text-gray-500 hover:text-gray-700 flex justify-between">
                  <span>{{ meth?.name }}</span>
                  <span class="text-sm text-gray-500"></span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </section>

      <section class="col-span-8"  v-if="method?.uid !== undefined">
        <div class="bg-white rounded-lg shadow-sm hover:shadow-lg duration-500 px-4 sm:px-6 md:px-2 py-4" >
          <div class="grid grid-cols-12 gap-3">
            <div class="col-span-12 px-3 sm:px-0">
              <div class="flex justify-between sm:text-sm md:text-md lg:text-lg text-gray-700 font-bold">
                <span>{{ method?.name }}</span>
                <div>
                  <button
                    @click="FormManager(false)"
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
            </div>
          </div>
        </div>

        <!-- Sample and Case Data -->
        <nav class="bg-white px-6 pt-2 shadow-md mt-2">
          <div class="-mb-px flex justify-start">
            <a
              v-for="tab in tabs"
              :key="tab"
              :class="[
                'no-underline text-gray-500 uppercase tracking-wide font-bold text-xs py-1 mr-8 tab',
                { 'tab-active': currentTab === tab },
              ]"
              @click="currentTab = tab"
              href="#"
            >
              {{ tab }}
            </a>
          </div>
        </nav>

        <section class="mt-2 p-2 bg-white">
          <div v-if="currentTab === 'view'">
            <h3>General</h3>
            <hr> 
            <input type="text">
          </div>
          <div v-else-if="currentTab === 'configurations'">
            <h3>Analyses</h3>
            <hr>
              <input type="text">
          </div>
        </section>

      </section>
    </div>
  </div>

  <!-- AnaltsisProfile Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
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

<script lang="ts">
import modal from '../../../../components/SimpleModal.vue';

import { useMutation } from '@urql/vue';
import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ActionTypes } from '../../../../store/modules/setup';
import { IMethod } from '../../../../models/setup'
import { ADD_METHOD, EDIT_METHOD  } from '../../../../graphql/instrument.mutations';

export default defineComponent({
  name: "tab-methods",
  components: {
    modal,
  },
  setup() {
    let store = useStore();

    // each tab if just gonna be forms with updatable values on button click
    let currentTab = ref('view');
    const tabs = ['view', 'configurations'];
    
    let showModal = ref(false);
    let formTitle = ref('');
    const formAction = ref(true);

    let method = reactive({}) as IMethod;

    store.dispatch(ActionTypes.FETCH_METHODS);    

    const { executeMutation: createMethod } = useMutation(ADD_METHOD);
    const { executeMutation: updateMethod } = useMutation(EDIT_METHOD);

    function addMethod(): void {
      createMethod({ name: method.name, keyword: method.keyword, description: method.description }).then((result) => {
       store.dispatch(ActionTypes.ADD_METHOD, result);
      });
    }

    function editMethod(): void {
      updateMethod({ uid: method.uid, name: method.name, keyword: method.keyword, description: method.description }).then((result) => {
        store.dispatch(ActionTypes.UPDATE_METHOD, result);
      });
    }

    function selectMethod(obj: IMethod): void {
      Object.assign(method, { ...obj})
    }
    
    function resetMethod(): void {
      Object.assign(method, { ...({} as IMethod)})
    }

    function FormManager(create: boolean, obj: IMethod): void {
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

    return { 
      showModal,
      formTitle,
      tabs,
      currentTab,
      methods: computed(() => store.getters.getMethods),
      selectMethod,
      method,
      FormManager,
      saveForm,
    };
  },
});
</script>