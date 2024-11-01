<template>
    <div class="complex-condition-editor">
      <div class="flex items-center justify-between mb-2">
        <select v-model="condition.conditionType" class="form-select">
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <button @click="$emit('remove')" class="text-red-600">Remove</button>
      </div>
      <div v-for="(subcondition, index) in condition.subconditions" :key="index" class="ml-4 mb-2">
        <div class="flex items-center gap-2">
          <select v-model="subcondition.analysisUid" class="form-select" @change="updateAnalysis(subcondition)">
            <option v-for="analysis in analysesServices" :key="analysis.uid" :value="analysis.uid">
              {{ analysis.name }}
            </option>
          </select>
          <select v-model="subcondition.operator" class="form-select">
            <option value="eq">=</option>
            <option value="neq">!=</option>
            <option value="gt">&gt;</option>
            <option value="lt">&lt;</option>
          </select>
          <input v-model="subcondition.value" class="form-input" />
          <button @click="removeSubcondition(index)" class="text-red-600">Remove</button>
        </div>
      </div>
      <button @click="addSubcondition" class="mt-2 text-blue-600">Add Subcondition</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { IComplexCondition, IAnalysisService } from '@/models/reflex';
  
  const props = defineProps<{
    condition: IComplexCondition;
    analysesServices: IAnalysisService[];
  }>();
  
  const emit = defineEmits(['remove']);
  
  function addSubcondition() {
    props.condition.subconditions.push({
      analysisUid: '',
      operator: 'eq',
      value: '',
    });
  }
  
  function removeSubcondition(index: number) {
    props.condition.subconditions.splice(index, 1);
  }
  
  function updateAnalysis(subcondition: any) {
    // Reset the value when changing the analysis
    subcondition.value = '';
  }
  </script>