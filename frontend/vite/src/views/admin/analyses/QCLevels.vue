<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true, null)"
           class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add QC Level</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Level</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="level in qcLevels"  :key="level?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="flex items-center">
                          <div>
                          <div class="text-sm leading-5 text-gray-800">{{ level?.level }}</div>
                          </div>
                      </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, level)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
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
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">QC Level</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.level"
              placeholder="Level/Name ..."
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


<style scoped>
  /* CHECKBOX TOGGLE SWITCH */
  /* @apply rules for documentation, these do not work as inline style */
  .toggle-checkbox:checked {
    @apply: right-0 border-green-400;
    right: 0;
    border-color: #68D391;
  }
  .toggle-checkbox:checked + .toggle-label {
    @apply: bg-green-400;
    background-color: #68D391;
  }
</style>

<script lang="ts" scope="ts">
import modal from '../../../components/SimpleModal.vue';

import { useMutation } from '@urql/vue';
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ActionTypes, QCLevel, IQCLevel } from '../../../store/modules/analyses';
import { ADD_QC_LEVEL, EDIT_QC_LEVEL  } from '../../../graphql/analyses.mutations';


export default defineComponent({
  name: "tab-quality-control-levels",
  components: {
    modal,
  },
  setup() {
    const store = useStore();
    
    let showModal = ref(false);
    let formTitle = ref('');
    let form = reactive({ ...(new QCLevel()) });
    const formAction = ref(true);

    store.dispatch(ActionTypes.FETCH_QC_LEVELS);
    const { executeMutation: createQCLevel } = useMutation(ADD_QC_LEVEL);
    const { executeMutation: updateQCLevel } = useMutation(EDIT_QC_LEVEL);

    function addQCLevel(): void {
      createQCLevel({ level: form.level }).then((result) => {
       store.dispatch(ActionTypes.ADD_QC_LEVEL, result);
      });
    }

    function editQCLevel(): void {
      updateQCLevel({ uid: form.uid, level: form.level }).then((result) => {
        store.dispatch(ActionTypes.UPDATE_QC_LEVEL, result);
      });
    }

    function FormManager(create: boolean, obj: IQCLevel):void {
      formAction.value = create;
      showModal.value = true;
      formTitle.value = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Level";
      if (create) {
        Object.assign(form, { ...(new QCLevel()) });
      } else {
        Object.assign(form, { ...obj });
      }
    }

    function saveForm():void {
      console.log(form)
      if (formAction.value === true) addQCLevel();
      if (formAction.value === false) editQCLevel();
      showModal.value = false;
    }

    return {
      showModal, 
      qcLevels: computed(() =>store.getters.getQCLevels),
      FormManager,
      form,
      formTitle,
      saveForm
     };
  },
});
</script>