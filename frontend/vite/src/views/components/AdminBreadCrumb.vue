<template>
    <li class="col-span-4 border-gray-400" @click="select(title)">
        <router-link :to="path" class="no-underline">
            <div class="shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-md flex flex-1 items-center p-4">
                <div class="mr-4">
                    <font-awesome-icon :icon="icon" />
                </div>
                <div class="flex-1 pl-1 md:mr-16">
                    <div class="font-medium dark:text-white">
                        {{ title }}
                    </div>
                </div>
            </div>
        </router-link>
    </li>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { ActionTypes } from '../../store/modules/admin';
export default {
  name: 'item-setting',
  props: {
    title: String,
    path: String,
    icon: String,
  },
  setup() {
    const store = useStore();
    const select = (val: string) => store.dispatch(ActionTypes.SET_CONF_ROUTE, val);
    return { select }
  },
}
</script>
