<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import  useApiUtil  from '@/composables/api_util';
import { GroupType, PermissionType } from '@/types/gql';
import { UpdateGroupsAndPermissionsMutation, UpdateGroupsAndPermissionsMutationVariables, UpdateGroupsAndPermissionsDocument } from '@/graphql/operations/_mutations';
import { Switch } from "@/components/ui/switch";

defineOptions({ name: 'PermissionsView' })
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
      <div class="overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
        <Table class="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b border-border text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[200px] min-w-[200px]"
              >
                Permissions
              </TableHead>
              <TableHead
                v-for="group in groups"
                :key="group.uid"
                class="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b border-border text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                <span class="block truncate" :title="group.name">{{ group.name }}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="divide-y divide-border">
            <template v-for="category in permissions" :key="category[0]">
              <TableRow class="bg-muted/50">
                <TableCell class="px-4 py-3 font-medium text-sm text-foreground w-[200px] min-w-[200px]">{{ category[0] }}</TableCell>
                <TableCell class="px-4 py-3 text-muted-foreground" v-for="group in groups" :key="group.uid" />
              </TableRow>
              <TableRow v-for="perm in category[1]" :key="perm.uid">
                <TableCell class="px-4 py-2 text-sm text-muted-foreground w-[200px] min-w-[200px]">
                  {{ perm.action }}
                </TableCell>
                <TableCell v-for="group in groups" :key="group.uid" class="px-4 py-2 text-right align-middle">
                  <Switch
                    :model-value="hasPermission(group, perm)"
                    @update:model-value="(value) => handlePermissionToggle(group, perm, value)"
                  />
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
