<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { ISampleType } from '../../../models/analysis'
  import { ADD_SAMPLE_TYPE, EDIT_SAMPLE_TYPE  } from '../../../graphql/operations/analyses.mutations';
  import { useSampleStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
  const modal = defineAsyncComponent(
  () => import("../../../components/SimpleModal.vue")
)

  const sampleStore = useSampleStore();
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  let form = reactive({}) as ISampleType;
  const formAction = ref<boolean>(true);

  sampleStore.fetchSampleTypes();
  const sampleTypes = computed(() => sampleStore.getSampleTypes)

  function FormManager(create: boolean, obj = {} as ISampleType):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "SAMPLE TYPE";
    if (create) {
      Object.assign(form, {} as ISampleType);
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    const payload = { name: form.name, abbr: form.abbr, description: form.description, active: form.active}

    if (formAction.value === true) {
      withClientMutation(ADD_SAMPLE_TYPE, { payload }, "createSampleType")
      .then((result) => sampleStore.addSampleType(result));
    };

    if (formAction.value === false) {
      withClientMutation(EDIT_SAMPLE_TYPE,{ uid: form.uid, payload }, "updateSampleType")
      .then((result) => sampleStore.updateSampleType(result));
    };

    showModal.value = false;
  }

</script>

<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-sky-800 border text-sky-800rounded-smtransition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Sample Type</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Sample Type</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Prefix</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Active</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="s_type in sampleTypes" :key="s_type?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-gray-800">{{ s_type?.name }}</div>
                        </div>
                    </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-sky-800">{{ s_type?.abbr }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-sky-800">{{ s_type?.active }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, s_type)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
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
            <span class="text-gray-700">Sample Type Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
            />
          </label>
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Prefix</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.abbr"
              placeholder="Prefix ..."
            />
          </label>
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Description</span>
            <textarea
            cols="2"
              class="form-input mt-1 block w-full"
              v-model="form.description"
              placeholder="Description ..."
            />
          </label>
          <label for="toggle" class="text-xs text-gray-700 mr-4">Active
            <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                type="checkbox" 
                name="toggle" id="toggle" 
                v-model="form.active"
                class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
            </div>
          </label>
        </div>
        <hr />
        <button
          type="button"
          @click.prevent="saveForm()"
          class="-mb-4 w-full border border-sky-800 bg-sky-800 text-white rounded-sm px-4 py-2 m-2 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline"
        >
          Save Form
        </button>
      </form>
    </template>
  </modal>

</template>


<style scoped>
  .toggle-checkbox:checked {
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #68D391;
  }
</style>
