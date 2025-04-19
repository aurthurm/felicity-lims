<script setup lang="ts">
import {onMounted, ref} from 'vue';

import useApiUtil from '@/composables/api_util';
import {IAbxAntibiotic} from "@/models/microbiology";
import { GetAbxLaboratoryAntibioticsDocument, GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables } from '@/graphql/operations/microbiology.queries';
import { DiscardAbxAntibioticMutation, DiscardAbxAntibioticMutationVariables, DiscardAbxAntibioticDocument } from '@/graphql/operations/microbiology.mutations';

const {withClientMutation, withClientQuery} = useApiUtil()

const abxlabAntibiotics = ref<IAbxAntibiotic[]>([]);

onMounted(() => {
  withClientQuery<GetAbxLaboratoryAntibioticsQuery, GetAbxLaboratoryAntibioticsQueryVariables>(
        GetAbxLaboratoryAntibioticsDocument, {}, "abxLaboratoryAntibiotics"
    ).then((result) => {
      if (result) {
        abxlabAntibiotics.value  = result as IAbxAntibiotic[]
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

  <div class="w-full my-4">
    <div class="overflow-x-auto mt-4">
      <div
          class="align-middle inline-block min-w-full shadow overflow-hidden bg-background shadow-dashboard px-2 pt-1 rounded-bl-lg rounded-br-lg">
        <table class="min-w-full">
          <thead>
          <tr>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Name
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Guidelines
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              Potency
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              LOINC MIC
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              LOINC DISK
            </th>
            <th class="px-1 py-1 border-b-2 border-border text-left text-sm leading-4 text-foreground tracking-wider">
              LOINC ETEST
            </th>
            <th class="px-1 py-1 border-b-2 border-border"></th>
          </tr>
          </thead>
          <tbody class="bg-background">
          <tr v-for="abx in abxlabAntibiotics" :key="abx?.uid">
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="flex items-center">
                <div class="text-sm leading-5 text-foreground">{{ abx?.name }}</div>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">
                <span class="px-2 py-1 mr-2 text-sm bg-muted rounded-md font-medium" v-for="gl in abx?.guidelines" :key="gl.name">{{ gl.name }}</span>
              </div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ abx?.potency }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ abx?.loincmic }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ abx?.loincdisk }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap border-b border-border">
              <div class="text-sm leading-5 text-primary">{{ abx?.loincetest }}</div>
            </td>
            <td class="px-1 py-1 whitespace-no-wrap text-right border-b border-border text-sm leading-5">
               <button @click="discardAntibiotic(abx)"
                      class="px-2 py-1 mr-2 border-destructive border text-destructive rounded-sm transition duration-300 hover:bg-destructive hover:text-primary-foreground focus:outline-none">
                remove
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<style scoped>
.toggle-checkbox:checked {
  right: 0;
  border-color: #68D391;
}

.toggle-checkbox:checked + .toggle-label {
  background-color: #68D391;
}
</style>
