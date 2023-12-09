<script setup lang="ts">
  import { ref,computed, reactive, defineAsyncComponent } from 'vue';
  import { useSetupStore, useAnalysisStore } from '../../../stores';
  import { useApiUtil } from '../../../composables';
  const modal = defineAsyncComponent(
    () => import('../../../components/SimpleModal.vue')
  )

  const analysisStore = useAnalysisStore()
  const  setupStore = useSetupStore()
  const { withClientMutation } = useApiUtil()
  
  const props = defineProps({
      target: {
          type: String,
          required: true,
          default: "",
      },
      targetUid: {
          type: String,
          required: true,
          default: "",
      },
  })

  setupStore.fetchLaboratory();
  const laboratory = computed(() => setupStore.getLaboratory);
  const formPricing = reactive({ amount: 0.0, ...laboratory.value });

  const updatePricing = () => {
    const payload = { ...formPricing };
    delete payload["uid"];
    delete payload["__typename"];
    payload["labManagerUid"] = payload["labManagerUid"]!;
    withClientMutation(
      "UPDATE_LABORATOTY",
      { uid: formPricing.uid, payload },
      "updateLaboratory"
    ).then((result) => setupStore.updateLaboratory(result));
  };
</script>

<template>
    <div class="grid grid-cols-12">
      <section class="col-span-6 gap-x-4 pr-4 mb-2">
        <h3 class="font-semibold text-l text-gray-600">Pricing Information</h3>
        <hr>
        <form class="mt-4">
          <div class="">
            <label class="flex justify-start items-center gap-x-4 mb-4">
              <span class="col-span-1 text-gray-700">Amount: $</span>
              <input class="form-input mt-1" v-model="formPricing.amount" type="number" placeholder="0.0" min="0.0" step="0.1" />
            </label>
          </div>
          <button type="button" @click.prevent="updatePricing()"
            class="border border-sky-800 bg-sky-800 text-white rounded-sm mt-4 px-1 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
            Update Pricing
          </button>
        </form>
      </section>

      <section class="col-span-6 gap-x-4 mb-2 border-l-2 border-l-gray-500 pl-4">
        <h3 class="font-semibold text-l text-gray-600">Discounts Information</h3>
        <hr>

        <form class="mt-4">
          <div class="">
            <label class="flex justify-start items-center gap-x-4 mb-4">
              <span class="col-span-1 text-gray-700">Amount: $</span>
              <input class="form-input mt-1" v-model="formPricing.amount" type="number" placeholder="0.0" min="0.0" step="0.1" />
            </label>
          </div>
          <button type="button" @click.prevent="updatePricing()"
            class="border border-sky-800 bg-sky-800 text-white rounded-sm mt-4 px-1 py-1 transition-colors duration-500 ease select-none hover:bg-sky-800 focus:outline-none focus:shadow-outline">
            Update Discount
          </button>
        </form>
      </section>
    </div>
</template>
