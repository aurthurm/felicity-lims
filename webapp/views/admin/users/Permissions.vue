<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useUserStore } from '@/stores/user';
import  useApiUtil  from '@/composables/api_util';
import { GroupType, PermissionType } from '@/types/gql';
import { UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables, UpdateGroupsAndPermissionsDocument } from '@/graphql/operations/_mutations';

const FelSwitch = defineAsyncComponent(
  () => import("@/components/ui/switch/FelSwitch.vue")
)

let userStore = useUserStore()
const { withClientMutation } = useApiUtil()

userStore.fetchGroupsAndPermissions();
const groups = computed(() => userStore.getGroups)

function hasPermission(group: GroupType, perm: PermissionType): boolean {
  return group?.permissions?.some(p => p?.uid === perm?.uid) ?? false;
}

const groupBy = (xs, key):Map<any, any> => {
  return xs?.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const permissions = computed(() => Array.from(Object.entries(groupBy(userStore.getPermissions, 'target'))))

function updateGroupPerms(group: GroupType, permission: PermissionType): void {
  withClientMutation<UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables>(UpdateGroupsAndPermissionsDocument, { 
    groupUid: group?.uid, 
    permissionUid: permission?.uid 
  }, "updateGroupPermissions")
  .then((result) => userStore.updateGroupsAndPermissions(result));
}

function handlePermissionToggle(group: GroupType, perm: PermissionType, value: boolean): void {
  if (value !== hasPermission(group, perm)) {
    updateGroupPerms(group, perm);
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-background rounded-lg shadow-sm overflow-hidden">
      <div class="relative">
        <!-- Fixed Header -->
        <table class="w-full">
          <thead>
            <tr>
              <th
                class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b border-border text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Permissions
              </th>
              <th 
                v-for="group in groups" 
                :key="group.uid"
                class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b border-border text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {{ group.name }}
              </th>
              <th class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b border-border"></th>
            </tr>
          </thead>
        </table>
        
        <!-- Scrollable Body -->
        <div class="overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
          <table class="w-full">
            <tbody class="divide-y divide-border">
              <template v-for="category in permissions" :key="category[0]">
                <tr class="bg-muted/50">
                  <td class="px-4 py-3 font-medium text-sm text-foreground">{{ category[0] }}</td>
                  <td class="px-4 py-3 font-medium text-sm text-muted-foreground" v-for="group in groups" :key="group.uid">
                    <!-- {{ group.name }} -->
                  </td>
                </tr>
                <tr v-for="perm in category[1]" :key="perm.uid">
                  <td class="px-4 py-2 text-sm text-muted-foreground">
                    {{ perm.action }}
                  </td>
                  <td v-for="group in groups" :key="group.uid" class="px-4 py-2">
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
