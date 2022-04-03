<template>
    <div id="app" class="max-w-screen-sm mx-auto">
        <div class="mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6">
            <div class="sm:col-span-6">
                <label for="tag" class="block text-sm font-medium leading-5 text-gray-700">Add Tags</label>
                <div class="flex mt-1 relative bg-white overflow-x-scroll rounded-md shadow-sm focus:outline-none focus:shadow-outline border border-gray-300">
                    <div v-for="(tag, index) in state.emailDomains" :key="index" class="flex-grow-0 text-gray-700 text-center my-1 ml-1">
                        <span class="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold bg-indigo-500 hover:bg-indigo-300 text-white hover:text-black cursor-pointer">
                            {{ state.emailDomain }}
                            <button type="button" class="flex-shrink-0 -mr-0.5 ml-1.5 inline-flex hover:bg-indigo-400 p-1 rounded-full" @click="removeTag(index)">
                                <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                    <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                                </svg>
                            </button>
                        </span>
                    </div>
                    <div class="flex-grow text-gray-700 text-center">
                        <input
                            id="tags"
                            class="w-full h-full rounded-lg py-2 pl-2 pr-4 block appearance-none leading-normal transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            v-bind:class="{ 'opacity-0': tagInputDisabled() }"
                            v-bind:value="state.emailDomain"
                            v-bind:disabled="tagInputDisabled()"
                            v-on:input="processTags($event)"
                            v-on:keydown.tab.prevent="processTagsOnKeyUpEvent($event)"
                            v-on:keydown.space.prevent="processTagsOnKeyUpEvent($event)"
                            v-on:keydown.enter.prevent="processTagsOnKeyUpEvent($event)"
                        />
                    </div>
                </div>
                <p class="mt-2 text-sm text-gray-500">
                    Start writing, to finish your tag use a comma, tab or enter...
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';

  const props = defineProps({
    msg: String,
  })

  const state = reactive({
        emailDomain: '',
        emailDomains: [] as any[],
    })

    function sanitizeTag(value) {
      return value.replace(/<[^>]*>?/gm, '').trim();
    }

    function parsedTag(tag) {
      return tag.replace(',', '').replace(' ', '')
    }

    function addIfUnique(array, value) {
      return [...new Set(array).add(value)];
    }

    function processTags(event) {
      const value = event.target.value
      if (state.emailDomains.length < 5) {
        state.emailDomain = sanitizeTag(value);

        if (value.length > 0 && value.indexOf(',') > -1) {
          revertTag();

          let tags = value.split(',');

          tags.forEach((tag) => {
            if (tag.length > 0) {
              state.emailDomains = addIfUnique(state.emailDomains, parsedTag(tag));
            }
          });
        }
      } else {
        revertTag();
      }
    }

    function processTagsOnKeyUpEvent(event) {
      const value = event.target.value
      if (state.emailDomains.length < 5) {
        state.emailDomain = sanitizeTag(value);

        if (value.length > 0) {
          if (value.indexOf(',') > -1) {
            revertTag();

            let tags = value.split(',');

            tags.forEach((tag) => {
              if (tag.length > 0) {
                state.emailDomains = addIfUnique(state.emailDomains, parsedTag(tag));
              }
            });
          } else if (/\s/g.test(value)) {
            revertTag();

            let tags = value.split(' ');

            tags.forEach((tag) => {
              if (tag.length > 0) {
                state.emailDomains = addIfUnique(state.emailDomains, parsedTag(tag));
              }
            });
          } else {
            revertTag();
            state.emailDomains = addIfUnique(state.emailDomains, value);
          }
        }
      } else {
        revertTag();
      }
    }

    function tagInputDisabled() {
      return state.emailDomains.length >= 5;
    }

    function removeTag(index) {
      state.emailDomains.splice(index, 1);
    }

    function revertTag() {
      state.emailDomain = '';
    }
</script>
