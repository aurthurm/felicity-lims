<script setup lang="ts">
import {onMounted, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {AbxAntibioticType} from "@/types/gql";
import { GetAbxLaboratoryAntibioticsDocument, GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables } from '@/graphql/operations/microbiology.queries';
import { DiscardAbxAntibioticMutation, DiscardAbxAntibioticMutationVariables, DiscardAbxAntibioticDocument } from '@/graphql/operations/microbiology.mutations';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import PageHeading from "@/components/common/PageHeading.vue"
const {withClientMutation, withClientQuery} = useApiUtil()

const abxlabAntibiotics = ref<AbxAntibioticType[]>([]);

onMounted(() => {
  withClientQuery<GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables>(
        GetAbxLaboratoryAntibioticsDocument, {}, "abxLaboratoryAntibiotics"
    ).then((result) => {
      if (result) {
        abxlabAntibiotics.value  = result as AbxAntibioticType[]
      }
  })
})

function discardAntibiotic(antibiotic) {
  withClientMutation<DiscardAbxAntibioticMutation, DiscardAbxAntibioticMutationVariables>(
        DiscardAbxAntibioticDocument, { uid: antibiotic.uid }, "discardAbxAntibiotic"
    ).then(({ uid }) => {
      if(uid) {
        abxlabAntibiotics.value = abxlabAntibiotics.value.filter((abx) => abx.uid !== uid);
      }
    });
  }
</script>

<template>
  <div class="space-y-6">
    <PageHeading title="Laboratory Antibiotics"></PageHeading>

    <div class="border border-border bg-card rounded-lg shadow-md">
      <div class="relative w-full overflow-auto">
        <Table class="w-full caption-bottom text-sm">
          <TableHeader class="[&_tr]:border-b">
            <TableRow class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Guidelines</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Potency</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">LOINC MIC</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">LOINC DISK</TableHead>
              <TableHead class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">LOINC ETEST</TableHead>
              <TableHead class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                <span class="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="[&_tr:last-child]:border-0">
            <TableRow v-for="abx in abxlabAntibiotics" :key="abx?.uid" class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ abx?.name }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-sm">
                <span class="px-2 py-1 mr-2 text-sm bg-muted rounded-md font-medium" v-for="gl in abx?.guidelines" :key="gl.name">{{ gl.name }}</span>
              </TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ abx?.potency }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ abx?.loincmic }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ abx?.loincdisk }}</TableCell>
              <TableCell class="px-4 py-3 align-middle whitespace-nowrap text-sm text-foreground">{{ abx?.loincetest }}</TableCell>
              <TableCell class="px-4 py-3 align-middle text-right">
                <button 
                  @click="discardAntibiotic(abx)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground h-9 px-4 py-2">
                  Remove
                </button>
              </TableCell>
            </TableRow>
            <TableEmpty v-if="!abxlabAntibiotics || abxlabAntibiotics.length === 0" :colspan="7">
              <Empty class="border-0 bg-transparent p-0">
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>No laboratory antibiotics found</EmptyTitle>
                    <EmptyDescription>Add antibiotics to get started.</EmptyDescription>
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

<style lang="postcss" scoped>
@reference "@/assets/css/style.css";
.multiselect-blue {
  @apply rounded-md border border-input bg-background;
}

.multiselect-blue .multiselect__tags {
  @apply border-0 bg-transparent px-3 py-2 text-sm;
}

.multiselect-blue .multiselect__single {
  @apply mb-0 text-sm text-foreground;
}

.multiselect-blue .multiselect__input {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option {
  @apply text-sm text-foreground;
}

.multiselect-blue .multiselect__option--highlight {
  @apply bg-primary text-primary-foreground;
}

.multiselect-blue .multiselect__option--selected {
  @apply bg-primary/20 text-primary;
}
</style>
