<template>

    <div class="container w-full my-4">
        <hr>
          <button @click="FormManager(true)"
           class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none">Add Rejection Reason</button>
        <hr>

        <div class="overflow-x-auto mt-4">
            <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
            <table class="min-w-full">
                <thead>
                <tr>
                    <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Reason</th>
                    <th class="px-1 py-1 border-b-2 border-gray-300"></th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr v-for="rejection in rejectionReasons"  :key="rejection?.uid">
                    <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                      <div class="flex items-center">
                          <div>
                          <div class="text-sm leading-5 text-gray-800">{{ rejection?.reason }}</div>
                          </div>
                      </div>
                    </td>
                    <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                        <button @click="FormManager(false, rejection)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>

    <!-- Rejection Reason Form Modal -->
  <modal v-if="showModal" @close="showModal = false">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body>
      <form action="post" class="p-1">
        <div class="grid grid-cols-2 gap-x-4 mb-4">
          <label class="block col-span-2 mb-2">
            <span class="text-gray-700">Rejection Reason</span>
            <input
              class="form-input mt-1 block w-full"
              v-model="form.reason"
              placeholder="Reason ..."
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


<script lang="ts" scope="ts">
import modal from '../../../components/SimpleModal.vue';

import { useMutation } from '@urql/vue';
import { defineComponent, ref, reactive, computed, toRefs } from 'vue';
import { useStore } from 'vuex';
import { ActionTypes } from '../../../store/modules/analysis';
import { IRejectionReason } from '../../../models/analysis';
import { ADD_REJECTION_REASON, EDIT_REJECTION_REASON } from '../../../graphql/analyses.mutations';


export default defineComponent({
  name: "tab-rejection-reasons",
  components: {
    modal,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      showModal: false,
      formTitle: '',
      form: {} as IRejectionReason,
      formAction: false,
    })
    

    store.dispatch(ActionTypes.FETCH_REJECTION_REASONS);
    const { executeMutation: createRejectionReason } = useMutation(ADD_REJECTION_REASON);
    const { executeMutation: updateRejectionReason } = useMutation(EDIT_REJECTION_REASON);

    function addRejectionReason(): void {
      createRejectionReason({ reason: state.form.reason }).then((result) => {
       store.dispatch(ActionTypes.ADD_REJECTION_REASON, result);
      });
    }

    function editRejectionReason(): void {
      updateRejectionReason({ uid: state.form.uid, reason: state.form.reason }).then((result) => {
        store.dispatch(ActionTypes.UPDATE_REJECTION_REASON, result);
      });
    }

    function FormManager(create: boolean, obj: IRejectionReason = {} as IRejectionReason):void {
      state.formAction = create;
      state.showModal = true;
      state.formTitle = (create ? 'CREATE' : 'EDIT') + ' ' + "QC Level";
      if (create) {
        state.form = {} as IRejectionReason
      } else {
        state.form = { ... obj };
      }
    }

    function saveForm():void {
      if (state.formAction === true) addRejectionReason();
      if (state.formAction === false) editRejectionReason();
      state.showModal = false;
    }

    return {
      ...toRefs(state), 
      rejectionReasons: computed(() =>store.getters.getRejectionReasons),
      FormManager,
      saveForm
     };
  },
});
</script>