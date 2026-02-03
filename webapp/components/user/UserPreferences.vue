<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { UserPreferenceType } from '@/types/gql';
import { EditUserPreferencesDocument, EditUserPreferencesMutation, EditUserPreferencesMutationVariables } from '@/graphql/operations/_mutations';
import { UserPreferenceInput } from '@/types/gql';
import useApiUtil from '@/composables/api_util';
import { useSetupStore } from '@/stores/setup';
import { GetUserPreferencesDocument, GetUserPreferencesQuery, GetUserPreferencesQueryVariables } from '@/graphql/operations/_queries';
import useNotifyToast from '@/composables/alert_toast';
import userPreferenceComposable from '@/composables/preferences';
import { pages } from '@/router/constants';
import * as guards from '@/guards';
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

const { withClientQuery, withClientMutation } = useApiUtil();
const setupStore = useSetupStore();
const { toastSuccess, toastError } = useNotifyToast();
const {
  initPreferences,
  toggleDepartment,
  isDepartmentSelected,
  theme,
  expandedMenu,
  defaultRoute,
  departments,
} = userPreferenceComposable();

// State
const loading = ref(true);
const saving = ref(false);
const allDepartments = computed(() => setupStore.getDepartments);

// Available pages for default route
const availablePages = computed(() => [
  { label: 'Dashboard', value: '/dashboard', page: pages.DASHBOARD },
  { label: 'Patients', value: '/patients', page: pages.PATIENTS },
  { label: 'Patients Compact', value: '/patients-compact', page: pages.PATIENTS_COMPACT },
  { label: 'Clients', value: '/clients', page: pages.CLIENTS },
  { label: 'Samples', value: '/samples', page: pages.SAMPLES },
  { label: 'Quality Control', value: '/quality-control', page: pages.QC_SAMPLES },
  { label: 'Worksheets', value: '/worksheets', page: pages.WORKSHEETS },
  { label: 'Referrals', value: '/shipments', page: pages.REFERRAL },
  { label: 'Bio-Banking', value: '/bio-banking', page: pages.BIO_BANKING },
  { label: 'Inventory', value: '/inventory', page: pages.INVENTORY },
  { label: 'Notice Manager', value: '/notice-manager', page: pages.NOTICE_MANAGER },
  { label: 'Projects/Schemes', value: '/schemes', page: pages.SCHEMES },
  { label: 'Documents', value: '/documents', page: pages.DOCUMENT },
  { label: 'Billing', value: '/billing', page: pages.BILLING },
  { label: 'Administration', value: '/admin', page: pages.ADMINISTRATION },
].filter(p => guards.canAccessPage(p.page)));

onMounted(() => {
  // Fetch all departments
  setupStore.fetchDepartments({});
  // Fetch user preferences
  fetchUserPreferences();
});

function fetchUserPreferences() {
  loading.value = true;
  withClientQuery<GetUserPreferencesQuery, GetUserPreferencesQueryVariables>(
    GetUserPreferencesDocument,
    {},
    'userPreferences'
  ).then((data) => {
    // Initialize preferences composable with fetched data
    if (data) {
      initPreferences(data as UserPreferenceType);
    }
  }).finally(() => {
    loading.value = false;
  });
}

async function savePreferences() {
  saving.value = true;

  const input: UserPreferenceInput = {
    expandedMenu: expandedMenu.value,
    theme: theme.value,
    defaultRoute: defaultRoute.value || undefined,
    departments: departments.value.length > 0 ? departments.value.map(d => d.uid) : undefined,
  };

  try {
    withClientMutation<EditUserPreferencesMutation, EditUserPreferencesMutationVariables>(
      EditUserPreferencesDocument,
      { preferencesIn: input },
      'updateUserPreferences'
    ).then(() => {
      toastSuccess('Preferences updated successfully');
      fetchUserPreferences();
    }).catch((error) => {
      toastError(error?.message || 'Failed to update preferences');
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="w-full space-y-6">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="inline-flex items-center gap-2">
        <Spinner class="size-4" />
        <span class="text-sm">Loading preferences...</span>
      </span>
    </div>

    <!-- Main content -->
    <div v-else class="space-y-6">
      <!-- Theme and Default Route in one line -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Theme Preference -->
        <div class="space-y-2">
          <label class="block text-l font-semibold text-foreground">
            Theme
          </label>
          <select
            v-model="theme"
            class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <!-- Default Route -->
        <div class="space-y-2">
          <label class="block text-l font-semibold text-foreground">
            Default Route
          </label>
          <select
            v-model="defaultRoute"
            class="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">No preference (Dashboard)</option>
            <option
              v-for="page in availablePages"
              :key="page.value"
              :value="page.value"
            >
              {{ page.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Expanded Menu Toggle -->
      <div class="flex items-center justify-between">
        <label class="text-l font-semibold text-foreground">
          Expanded Menu
        </label>
        <button
          @click="expandedMenu = !expandedMenu"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            expandedMenu ? 'bg-primary' : 'bg-muted'
          ]"
          role="switch"
          :aria-checked="expandedMenu"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-background transition-transform',
              expandedMenu ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
      </div>

      <!-- Departments in 2 columns -->
      <div class="space-y-3">
        <label class="block text-l font-semibold text-foreground ">
          Departments Filter
        </label>
        <div
          v-if="allDepartments.length === 0"
          class="text-sm text-muted-foreground italic"
        >
          No departments available
        </div>
        <div v-else class="grid grid-cols-2 gap-4">
          <div
            v-for="department in allDepartments"
            :key="department.uid"
            class="flex items-center"
          >
            <Checkbox
              :id="`dept-${department.uid}`"
              :checked="isDepartmentSelected(department.uid)"
              @update:checked="() => toggleDepartment(department)"
            />
            <label
              :for="`dept-${department.uid}`"
              class="ml-2 text-sm font-medium text-foreground cursor-pointer"
            >
              {{ department.name }}
            </label>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          @click="fetchUserPreferences"
          :disabled="saving"
          class="px-4 py-2 text-sm font-medium rounded-lg border border-input bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <Button
          type="button"
          @click="savePreferences"
          :disabled="saving || loading"
          class="px-4 py-2"
        >
          <Spinner v-if="saving" class="mr-2 size-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  </div>
</template>
