<template>
    <div class="flex justify-between">
      <div class="flex items-center content-between">
        <h1 class="h1 my-4 font-bold text-dark-700 mr-4">Documents</h1>
        <!-- <input
          class="w-64 ml-6 pl-4 pr-2 py-1 text-sm text-gray-700 placeholder-gray-600 border-1 border-gray-400 rounded-md  focus:placeholder-gray-500 focus:border-green-100 focus:outline-none focus:shadow-outline-purple form-input"
          type="text" placeholder="Search ..." aria-label="Search"
        /> -->
          <div class="flex sm:flex-row flex-col">
            <div class="flex flex-row mb-1 sm:mb-0">
                <div class="relative">
                    <select 
                    class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <option value=""></option>
                        <option v-for="dept in departments" :key="dept.uid" :value="dept.uid" >{{dept.name}}</option>
                    </select>
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
            <!-- <div class="flex flex-row mb-1 sm:mb-0">
                <div class="relative">
                    <select
                    class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <option value="">All</option>
                        <option value="draft">Categ 1</option>
                        <option value="under_review">Dept 2</option>
                        <option value="effected">Dept 3</option>
                        <option value="archived">Dept 3</option>
                    </select>
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div> -->
            <div class="flex flex-row mb-1 sm:mb-0">
                <div class="relative">
                    <select 
                    class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                        <option value="">All</option>
                        <option value="draft">Drafts</option>
                        <option value="under_review">Under Review</option>
                        <option value="effected">Effected</option>
                        <option value="archived">Archived</option>
                    </select>
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="block relative">
                <span class="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                    <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current text-gray-500">
                        <path
                            d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                        </path>
                    </svg>
                </span>
                <input placeholder="Search ..."
                  class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
            </div>
            <button class="px-2 py-1 ml-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Filter ...</button>         
        </div>
      </div>
      <button 
      class="px-4 my-2 p-1 text-sm border-blue-500 border text-dark-700 transition-colors duration-150 rounded-lg focus:outline-none hover:bg-blue-500 hover:text-gray-100"
      @click="FormManager(true, null)">
        Add New</button>
    </div>


    <!-- Sampe Table View -->
    <div class="overflow-x-auto mt-4">
        <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
            <thead>
            <tr>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Name</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Department</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Version</th>
                <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Status</th>
                <th class="px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
            </thead>
            <tbody class="bg-white">
            <tr v-for="document in documents" :key="document.uid">
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="flex items-center">
                      <div class="text-sm leading-5 text-gray-800">
                        <router-link :to="{ name: 'document-viewer', params: { documentUid: document.uid }}">{{ document?.name }}</router-link>
                      </div>
                  </div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ document?.department?.name }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <div class="text-sm leading-5 text-blue-900">{{ document?.version }}</div>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                  <button type="button" class="bg-blue-400 text-white p-1 rounded leading-none">{{ document?.status }}</button>
                </td>
                <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                    <button class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">View</button>
                    <button class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none"
                    @click="FormManager(false, document)">Edit</button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>


  <section class="flex justify-between">
    <div></div>
    <div class="my-4 flex sm:flex-row flex-col">
      <button
      class="px-2 py-1 mr-2 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Show More</button>
      <div class="flex flex-row mb-1 sm:mb-0">
          <div class="relative">
              <select class="appearance-none h-full rounded-l border block  w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="5000">5000</option>
                  <option value="10000">10000</option>
              </select>
              <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
              </div>
          </div>
      </div>
      <div class="block relative">
          <input class="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" disabled/>
      </div>
    </div>
  </section>

  <!-- Document Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Department</span>
            <select class="form-select block w-full mt-1" v-model="form.departmentUid">
               <option></option>
              <option v-for="dept in departments" :key="dept.uid" :value="dept?.uid">{{ dept.name }}</option>
            </select>
          </label>
          <!-- <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Category</span>
            <select class="form-select block w-full mt-1" v-model="form.category">
               <option></option>
              <option v-for="category in categories" :key="category.uid" :value="category?.uid">{{ category.name }}</option>
            </select>
          </label> -->
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline">
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>

<script lang="ts">
import modal from '../../components/SimpleModal.vue';
import { useMutation } from '@urql/vue';
import { useStore } from 'vuex'
import { ActionTypes } from '../../store/modules/markdown';
import { ActionTypes as DepartmentActionTypes } from '../../store/actions';
import { ADD_MARKDOWN_DOCUMENT, EDIT_MARKDOWN_DOCUMENT } from '../../graphql/markdown.mutations';
import { defineComponent, ref, reactive, computed} from 'vue';
export default defineComponent({
  name: "markdown-docs",
  components: {
    modal,
  },
  setup() {
    let store = useStore();

    let showModal = ref<boolean>(false);
    let formTitle = ref<string>('');
    let form = reactive({}) as any;
    const formAction = ref<boolean>(true);

    store.dispatch(DepartmentActionTypes.FETCH_DEPARTMENTS);
    store.dispatch(ActionTypes.FETCH_DOCUMENTS);

    const { executeMutation: createDocument } = useMutation(ADD_MARKDOWN_DOCUMENT);
    const { executeMutation: udateDocument } = useMutation(EDIT_MARKDOWN_DOCUMENT);

    function addDocument(): void {
      createDocument({ name: form.name, departmentUid: form.departmentUid }).then((result) => {
        store.dispatch(ActionTypes.ADD_DOCUMENT, result);
      });
    }

    function editDocument(): void {
      udateDocument({ uid: form.uid, name: form.name, departmentUid: form.departmentUid }).then((result) => {
        store.dispatch(ActionTypes.UPDATE_DOCUMENT, result);
      });
    }

    function FormManager(create: boolean, obj: any):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'ADD' : 'EDIT') + ' ' + "Markdown Document";
      if (create) {
        Object.assign(form, {});
      } else {
        Object.assign(form, { ...obj });
      }
    }

    function saveForm():void {
      if (formAction.value === true) addDocument();
      if (formAction.value === false) editDocument();
      showModal.value = false;
    }

    return {
      departments: computed(() => store.getters.getDepartments),
      documents: computed(() => store.getters.getDocuments),
      categories: [],
      showModal,
      formTitle,
      form,
      FormManager,
      saveForm,
     };
  },
});
</script>