<script setup lang="ts">
import {onMounted, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {AbxAntibioticType} from "@/types/gql";
import { GetAbxLaboratoryAntibioticsDocument, GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables } from '@/graphql/operations/microbiology.queries';
import { DiscardAbxAntibioticMutation, DiscardAbxAntibioticMutationVariables, DiscardAbxAntibioticDocument } from '@/graphql/operations/microbiology.mutations';

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
    <fel-heading title="Laboratory Antibiotics"></fel-heading>

    <div class="border shadow-sm rounded-lg bg-card p-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Name</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Guidelines</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Potency</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">LOINC MIC</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">LOINC DISK</th>
              <th class="px-3 py-3.5 text-left text-sm font-semibold text-foreground">LOINC ETEST</th>
              <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border bg-background">
            <tr v-for="abx in abxlabAntibiotics" :key="abx?.uid" class="hover:bg-muted/50">
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ abx?.name }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span class="px-2 py-1 mr-2 text-sm bg-muted rounded-md font-medium" v-for="gl in abx?.guidelines" :key="gl.name">{{ gl.name }}</span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ abx?.potency }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ abx?.loincmic }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ abx?.loincdisk }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-foreground">{{ abx?.loincetest }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  @click="discardAntibiotic(abx)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-destructive bg-background text-destructive hover:bg-destructive hover:text-destructive-foreground h-9 px-4 py-2">
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
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
