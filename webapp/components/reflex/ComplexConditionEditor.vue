<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <select 
                v-model="condition.conditionType" 
                class="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
            </select>
            <button 
                @click="$emit('remove')" 
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-destructive"
            >
                Remove
            </button>
        </div>

        <div class="space-y-2">
            <div 
                v-for="(subcondition, index) in condition.subconditions" 
                :key="index" 
                class="flex items-center gap-2"
            >
                <select 
                    v-model="subcondition.analysisUid" 
                    class="h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    @change="updateAnalysis(subcondition)"
                >
                    <option 
                        v-for="analysis in analysesServices" 
                        :key="analysis.uid" 
                        :value="analysis.uid"
                    >
                        {{ analysis.name }}
                    </option>
                </select>
                <select 
                    v-model="subcondition.operator" 
                    class="h-9 w-[100px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    <option value="eq">=</option>
                    <option value="neq">!=</option>
                    <option value="gt">&gt;</option>
                    <option value="lt">&lt;</option>
                </select>
                <input 
                    v-model="subcondition.value" 
                    class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                />
                <button 
                    @click="removeSubcondition(index)" 
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-destructive"
                >
                    Remove
                </button>
            </div>
        </div>

        <button 
            @click="addSubcondition" 
            class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
            Add Subcondition
        </button>
    </div>
</template>

<script setup lang="ts">
import { IAnalysisService } from '@/models/analysis';
import { IComplexCondition } from '@/models/reflex';

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