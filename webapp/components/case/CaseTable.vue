<script setup lang="ts">
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
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
  <div class="mt-4" role="region" aria-label="Cases table">
    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
          <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <TableHead scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</TableHead>
            <TableHead scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Case Type</TableHead>
            <TableHead scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</TableHead>
            <TableHead scope="col" class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Creator</TableHead>
            <TableHead scope="col" class="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="[&_tr:last-child]:border-0">
          <TableRow v-for="case_ in cases" :key="case_.id" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <TableCell class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-card-foreground">{{ case_.id }}</div>
            </TableCell>
            <TableCell class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-primary">{{ case_.type }}</div>
            </TableCell>
            <TableCell class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-primary">{{ case_.created }}</div>
            </TableCell>
            <TableCell class="px-4 py-3 whitespace-nowrap">
              <div class="text-sm text-primary">{{ case_.creator }}</div>
            </TableCell>
            <TableCell class="px-4 py-3 whitespace-nowrap text-right text-sm">
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
            </TableCell>
          </TableRow>
          <TableEmpty v-if="cases.length === 0" :colspan="5">
            <Empty class="border-0 bg-transparent p-0">
              <EmptyContent>
                <EmptyHeader>
                  <EmptyTitle>No cases found</EmptyTitle>
                  <EmptyDescription>Create a case to get started.</EmptyDescription>
                </EmptyHeader>
              </EmptyContent>
            </Empty>
          </TableEmpty>
        </TableBody>
      </Table>
      </div>
    </div>
  </div>
</template>
