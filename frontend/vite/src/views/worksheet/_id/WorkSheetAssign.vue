<template>
  <section>
    <hr>
    <form action="post" class="p-1">
      <div class="flex justify-start items-center mr-4">
        <span class="text-gray-700">Worksheet Template</span>
        <label class="block mx-4">
          <select class="form-select block w-full mt-1" v-model="templateUid">
              <option></option>
            <option v-for="template in workSheetTemplates" :key="template.uid" :value="template.uid">{{ template.name }}</option>
          </select>
        </label>
        <button 
        v-show="shield.hasRights(shield.actions.CREATE, shield.objects.WORKSHEET)"
        type="button" @click.prevent="applyTemplate()"
          class="border border-green-400 bg-green-400 text-white rounded-md px-2 py-1 transition-colors duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline">
          Apply Template </button>
      </div>
    </form>
    <hr>
  </section>

</template>


<script setup lang="ts">
  import Swal from 'sweetalert2';
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useMutation } from '@urql/vue';
  import { ActionTypes } from '../../../store/modules/worksheet';
  import { EDIT_WORKSHEET_APPLY_TEMPLATE } from '../../../graphql/worksheet.mutations';

  import * as shield from '../../../guards'

  const store = useStore();
  const templateUid = ref<number>();

  store.dispatch(ActionTypes.FETCH_WORKSHEET_TEMPLATES);
  const worksheet = computed(()=> store.getters.getWorkSheet); 
  const workSheetTemplates = computed(() => store.getters.getWorkSheetTemplates)

  const { executeMutation: updateWorksheetApplyTemplate } = useMutation(EDIT_WORKSHEET_APPLY_TEMPLATE);

  const applyTemplate = async () => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to apply this template to add samples?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, apply now!',
        cancelButtonText: 'No, cancel apply!',
      }).then((result) => {
        if (result.isConfirmed) {
          
          updateWorksheetApplyTemplate({ worksheetUid: worksheet?.value?.uid , templateUid: templateUid.value }).then((result) => {
            console.log(result)
          });

          Swal.fire(
            'Its Happening!',
            'Template was applied!',
            'success'
          ).then(_ => location.reload())

        }
      })
    } catch (error) {
      console.log(error)
    }
  }

</script>
