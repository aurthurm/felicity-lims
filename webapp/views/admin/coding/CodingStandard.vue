<script setup lang="ts">
  import { ref, reactive, computed, defineAsyncComponent } from 'vue';
  import { ICodingStandard } from '@/models/analysis'
  import { ADD_CODING_STANDARD, EDIT_CODING_STANDARD  } from '@/graphql/operations/analyses.mutations';
  import { useAnalysisStore } from '@/stores';
  import { useApiUtil } from '@/composables';
  const modal = defineAsyncComponent(
  () => import("@/components/ui/FelModal.vue")
)

  const analyisStore = useAnalysisStore()
  const { withClientMutation } = useApiUtil()
  
  let showModal = ref<boolean>(false);
  let formTitle = ref<string>('');
  let form = reactive({}) as ICodingStandard;
  const formAction = ref<boolean>(true);

  analyisStore.fetchCodingStandards();
  const codindStandards = computed(() => analyisStore.getCodingStandards)

  function FormManager(create: boolean, obj = {} as ICodingStandard):void {
    formAction.value = create;
    showModal.value = true;
    formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "CODING STANDARD";
    if (create) {
      Object.assign(form, {} as ICodingStandard);
    } else {
      Object.assign(form, { ...obj });
    }
  }

  function saveForm():void {
    const payload = { name: form.name, description: form.description}

    if (formAction.value === true) {
      withClientMutation(ADD_CODING_STANDARD, { payload }, "createCodingStandard")
      .then((result) => analyisStore.addCodingStandard(result));
    };

    if (formAction.value === false) {
      withClientMutation(EDIT_CODING_STANDARD,{ uid: form.uid, payload }, "updateCodingStandard")
      .then((result) => analyisStore.updateCodingStandard(result));
    };

    showModal.value = false;
  }

</script>

<template>
    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Add Coding</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Standard</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider">Description</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="standard in codindStandards" :key="standard?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="flex items-center">
                        <div>
                        <div class="text-sm leading-5 text-gray-800">{{ standard?.name }}</div>
                        </div>
                    </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                    <div class="text-sm leading-5 text-sky-800">{{ standard?.description }}</div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, standard)" class="px-2 py-1 mr-2 border-sky-800 border text-sky-800 rounded-sm transition duration-300 hover:bg-sky-800 hover:text-white focus:outline-none">Edit</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>

      <!-- Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-1 mb-2">
            <span class="text-gray-700">Stndard Name</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.name"
              placeholder="Name ..."
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

