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
    <div class="border border-border bg-card rounded-lg shadow-md overflow-hidden">
      <div class="relative w-full overflow-y-auto max-h-[700px] scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
        <Table class="w-full table-fixed caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead
                class="sticky top-0 z-10 h-12 px-4 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 text-left align-middle font-medium text-muted-foreground w-[200px] min-w-[200px]"
              >
                Permissions
              </TableHead>
              <TableHead
                v-for="group in groups"
                :key="group.uid"
                class="sticky top-0 z-10 h-12 px-4 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 text-right align-middle font-medium text-muted-foreground"
              >
                <span class="block truncate" :title="group.name">{{ group.name }}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <template v-for="category in permissions" :key="category[0]">
              <TableRow class="border-b transition-colors bg-muted/50">
                <TableCell class="px-4 py-3 align-middle font-medium text-sm text-foreground w-[200px] min-w-[200px]">{{ category[0] }}</TableCell>
                <TableCell class="px-4 py-3 align-middle text-muted-foreground" v-for="group in groups" :key="group.uid" />
              </TableRow>
              <TableRow v-for="perm in category[1]" :key="perm.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableCell class="px-4 py-2 align-middle text-sm text-muted-foreground w-[200px] min-w-[200px]">
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
