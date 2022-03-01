<template>
  <button
      class="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
      @click="methodManager(true)"
    >Add Method</button>
  <hr>
  <div class="overflow-x-auto mt-4">
      <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <table class="min-w-full">
          <thead>
          <tr>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Method</th>
              <th class="px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-black-500 tracking-wider">Instruments</th>
              <th class="px-1 py-1 border-b-2 border-gray-300"></th>
          </tr>
          </thead>
          <tbody class="bg-white">
          <tr v-for="method in analysis.methods"  :key="method?.uid">
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
              <div class="flex items-center">
                  <div>
                  <div class="text-sm leading-5 text-gray-800">{{ method?.name }}</div>
                  </div>
              </div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap border-b border-gray-500">
                <div class="text-sm leading-5 text-blue-900">{{  instrumentNames(method) }}</div>
              </td>
              <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-gray-500 text-sm leading-5">
                  <button @click="methodManager(false, method)" class="px-2 py-1 mr-2 border-orange-500 border text-orange-500 rounded transition duration-300 hover:bg-orange-700 hover:text-white focus:outline-none">Edit</button>
              </td>
          </tr>
          </tbody>
      </table>
      </div>
  </div>

  <!-- Method Form Modal -->
  <modal v-if="showModal" @close="showModal = false" :contentWidth="'w-2/4'">
    <template v-slot:header>
      <h3>{{ formTitle }}</h3>
    </template>

    <template v-slot:body >
      <method-form :method="method" :methodUid="method?.uid" :analysis="analysis"  :analysisUid="analysis?.uid" />
    </template>
  </modal>

</template>

<script setup lang="ts">
  import modal from '../../../../components/SimpleModal.vue';
  import MethodForm from '../../instruments/comps/MethodForm.vue';
  
  import { ref, toRefs, watch, PropType, reactive } from 'vue';
  import { useStore } from 'vuex';

  import { ActionTypes as SetupActionTypes } from '../../../../store/modules/setup';
  import { IAnalysisService } from '../../../../models/analysis';
  import { IMethod } from '../../../../models/setup';

  const props = defineProps({
      analysis: {
          type: Object as PropType<IAnalysisService>,
          required: true,
          default: () => ({ uid: undefined }),
      },
      analysisUid: {
          type: Number,
          required: true,
          default: 0,
      },
  })

  let store = useStore();
  const { analysis } = toRefs(props);
  let showModal = ref(false);
  let formTitle = ref('');
  let method =  reactive({}) as IMethod;

  watch(() => props.analysisUid, (anal, prev) => {})

  store.dispatch(SetupActionTypes.FETCH_INSTRUMENTS);
  store.dispatch(SetupActionTypes.FETCH_METHODS);

  const instrumentNames = (mth: IMethod): string => {
      const final: string[] = [];
      mth.instruments?.forEach((instr: any) => {
          const exist = analysis.value.instruments?.some(item => item?.uid === instr?.uid);
          if (exist) {
            final.push(instr?.name);
          }
      })
    return  final.join(', ');
  }
  
  const methodManager = (create: boolean, selected: IMethod = {} as IMethod) => {
      
      if(create) {
          formTitle.value = "Add Method"
          Object.assign(method, {});
      } else {
          formTitle.value = "Update Method"
          Object.assign(method, selected);
      }
      showModal.value = !showModal.value
  }

</script>