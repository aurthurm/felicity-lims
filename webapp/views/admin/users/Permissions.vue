<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useUserStore } from '@/stores';
import { useApiUtil } from '@/composables';
import { UPDATE_GROUP_PERMS } from '@/graphql/operations/_mutations';
import { IGroup, IPermission } from '@/models/auth';

const FelSwitch = defineAsyncComponent(
  () => import("@/components/ui/switch/FelSwitch.vue")
)

let userStore = useUserStore()
const { withClientMutation } = useApiUtil()

userStore.fetchGroupsAndPermissions();
const groups = computed(() => userStore.getGroups)

function hasPermission(group: IGroup, perm: IPermission): boolean {
  return group?.permissions?.some(p => p?.uid === perm?.uid) ?? false;
}

const groupBy = (xs, key):Map<any, any> => {
  return xs?.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const permissions = computed(() => Array.from(Object.entries(groupBy(userStore.getPermissions, 'target'))))

function updateGroupPerms(group: IGroup, permission: IPermission): void {
  withClientMutation(UPDATE_GROUP_PERMS, { 
    groupUid: group?.uid, 
    permissionUid: permission?.uid 
  }, "updateGroupPermissions")
  .then((result) => userStore.updateGroupsAndPermissions(result));
}

function handlePermissionToggle(group: IGroup, perm: IPermission, value: boolean): void {
  if (value !== hasPermission(group, perm)) {
    updateGroupPerms(group, perm);
  }
}
</script>

<template>
  <div class="overflow-x-auto mt-4">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
      <div class="relative">
        <!-- Fixed Header -->
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="sticky top-0 z-10 bg-white px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                Permissions
              </th>
              <th 
                v-for="group in groups" 
                :key="group.uid"
                class="sticky top-0 z-10 bg-white px-1 py-1 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-800 tracking-wider"
              >
                {{ group.name }}
              </th>
              <th class="sticky top-0 z-10 bg-white px-1 py-1 border-b-2 border-gray-300"></th>
            </tr>
          </thead>
        </table>
        
        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto max-h-[700px]">
          <table class="min-w-full">
            <tbody class="bg-white">
              <template v-for="category in permissions" :key="category[0]">
                <tr class="bg-slate-100" >
                  <td class="py-1 font-bold px-1 text-gray-600 ">{{ category[0] }}</td>
                  <td class="py-1 font-medium px-1 text-slate-100" v-for="group in groups" :key="group.uid">
                    {{ group.name }}
                  </td>
                </tr>
                <tr v-for="perm in category[1]" :key="perm.uid" class="border-b border-slate-200">
                  <td class="py-1 font-sm italic text-gray-500 px-1">
                    {{ perm.action }}
                  </td>
                  <td v-for="group in groups" :key="group.uid" class="px-1">
                    <FelSwitch
                      :model-value="hasPermission(group, perm)"
                      @update:model-value="handlePermissionToggle(group, perm, $event)"
                      reverse
                    />
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
