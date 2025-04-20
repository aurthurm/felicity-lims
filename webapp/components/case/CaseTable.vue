<script setup lang="ts">
interface Case {
  id: string;
  type: string;
  created: string;
  creator: string;
}

interface Props {
  cases: Case[];
}

const props = withDefaults(defineProps<Props>(), {
  cases: () => []
});

const emit = defineEmits<{
  (e: 'view', caseId: string): void;
  (e: 'cancel', caseId: string): void;
}>();
</script>

<template>
  <div class="overflow-x-auto mt-4" role="region" aria-label="Cases table">
    <div class="align-middle inline-block min-w-full shadow overflow-hidden bg-card border border-border rounded-lg">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-muted/50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
            <th scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Case Type</th>
            <th scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
            <th scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Creator</th>
            <th scope="col" class="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border">
          <tr v-for="case_ in cases" :key="case_.id" class="hover:bg-muted/50">
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-card-foreground">{{ case_.id }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-primary">{{ case_.type }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-primary">{{ case_.created }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-primary">{{ case_.creator }}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm">
              <button 
                @click="emit('view', case_.id)"
                class="px-3 py-1.5 mr-2 border border-destructive text-destructive rounded-md transition-colors hover:bg-destructive hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                :aria-label="`View case ${case_.id}`"
              >
                View
              </button>
              <button 
                @click="emit('cancel', case_.id)"
                class="px-3 py-1.5 mr-2 border border-primary text-primary rounded-md transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                :aria-label="`Cancel case ${case_.id}`"
              >
                Cancel
              </button>
            </td>
          </tr>
          <tr v-if="cases.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-sm text-muted-foreground">
              No cases found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

