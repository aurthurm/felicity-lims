<template>

  <h1 class="text-xl text-gray-700 font-semibold my-2">Notice Board</h1>

  <section class="flex justify-start w-full">
    <ul class="w-full">
      <li v-for="(notice, index) in state.notices" :key="notice.uid"  class="w-full">
        <accordion class="w-full">
          <template v-slot:title>
            <div class="flex justify-between w-full">
              <div class="">
                <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gray-600 rounded-full">{{ index + 1}} </span>
                <span class="ml-4">{{ notice.title }}</span>
              </div>
              <div class="text-sm font-semibold italic text-red-500">
                {{ notice.status }}
              </div>
            </div>
          </template>
          <template v-slot:body>
          {{ notice.body }}
          </template>
        </accordion>
      </li>
    </ul>
  </section>

</template>

<script setup lang="ts">
  import Accordion from '../../components/Accordion.vue'
  import useNoticeComposable from '../../modules/notice';

  const { state } = useNoticeComposable();
</script>