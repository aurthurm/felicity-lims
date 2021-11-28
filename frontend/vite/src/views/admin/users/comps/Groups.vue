<template>

    <div class="w-full my-4">
        <h5>Groups and Permissios</h5>
        <hr>
        <div v-for="group in groups" :key="group">
            <accordion >
              <template v-slot:title>{{ group?.name }}</template>
              <template v-slot:body>
                  <div>
                    <ul>
                      <li 
                      v-for="permission in permissions" 
                      :key="permission?.uid" class="cursor-pointer"
                      :class="[
                        { 'border-green-500 bg-gray-200 underline pl-3': false },
                      ]"
                      >
                        <div class="flex-grow p-1">
                          <div 
                            :class="[
                            'font-medium text-gray-500 hover:text-gray-700 flex justify-between',
                              { 'text-gray-700 font-medium': false },
                            ]"
                          >
                            <label for="toggle" class="text-xs text-gray-700 mr-4">
                              <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                  <input 
                                  type="checkbox" 
                                  name="toggle"
                                  :checked="belongsToGroup(group, permission)"
                                  @change.prevent="updateGroupPerms(group, permission)"
                                  class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer outline-none"/>
                                  <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                              </div>
                            </label>
                            <span>{{ permission?.action }}-{{ permission?.target }}</span>
                          </div>
                        </div>
                        <hr>
                      </li>
                    </ul>
                  </div>
              </template>
            </accordion>
        </div>

    </div>

</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useMutation } from '@urql/vue';

import accordion from '../../../../components/Accordion.vue';
import { ActionTypes } from '../../../../store/actions';
import { UPDATE_GROUP_PERMS  } from '../../../../graphql/_mutations';
import { IGroup, IPermission } from '../../../../models/auth';
export default defineComponent({
  name: "tab-groups",
  components: {
      accordion
  },
  setup() {
    let store = useStore();
    store.dispatch(ActionTypes.FETCH_GROUPS_AND_PERMISSIONS);

    const { executeMutation: updateGroupPermissions } = useMutation(UPDATE_GROUP_PERMS);

    function updateGroupPerms(group: IGroup, permission: IPermission): void {
      updateGroupPermissions({  groupUid: group?.uid, permissionUid: permission?.uid }).then((result) => {
       store.dispatch(ActionTypes.UPDATE_GROUPS_PERMISSIONS, result);
      });
    }

    function belongsToGroup(group: IGroup, permission: IPermission): boolean {
      return group?.permissions!.some(perm => perm?.uid === permission?.uid);
    }

    return { 
      permissions: computed(() => store.getters.getPermissions),
      groups: computed(() => store.getters.getGroups),
      updateGroupPerms,
      belongsToGroup
    };
  },
});
</script>