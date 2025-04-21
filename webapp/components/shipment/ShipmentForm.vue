<template>
    <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="form-group">
            <label for="courier" class="block text-sm font-medium text-gray-700">Courier</label>
            <input
                id="courier"
                v-model="formData.courier"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                :class="{ 'border-red-500': errors.courier }"
                @blur="validateField('courier')"
            />
            <span v-if="errors.courier" class="text-sm text-red-500">{{ errors.courier }}</span>
        </div>

        <div class="form-group">
            <label for="laboratory" class="block text-sm font-medium text-gray-700">Reference Laboratory</label>
            <select
                id="laboratory"
                v-model="formData.laboratory"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                :class="{ 'border-red-500': errors.laboratory }"
                @change="validateField('laboratory')"
            >
                <option value="">Select Laboratory</option>
                <option v-for="lab in laboratories" :key="lab.uid" :value="lab">
                    {{ lab.name }}
                </option>
            </select>
            <span v-if="errors.laboratory" class="text-sm text-red-500">{{ errors.laboratory }}</span>
        </div>

        <div class="form-group">
            <label for="comment" class="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
                id="comment"
                v-model="formData.comment"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                :class="{ 'border-red-500': errors.comment }"
                @blur="validateField('comment')"
            ></textarea>
            <span v-if="errors.comment" class="text-sm text-red-500">{{ errors.comment }}</span>
        </div>

        <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Selected Samples</label>
            <div class="mt-2 space-y-2">
                <div v-if="!formData.samples.length" class="text-sm text-gray-500">
                    No samples selected
                </div>
                <div v-for="sample in formData.samples" :key="sample.uid" class="flex items-center space-x-2">
                    <span>{{ sample.sampleId }}</span>
                    <button @click="removeSample(sample)" type="button" class="text-red-500 hover:text-red-700">
                        Remove
                    </button>
                </div>
            </div>
            <span v-if="errors.samples" class="text-sm text-red-500">{{ errors.samples }}</span>
        </div>

        <div class="flex justify-end space-x-3">
            <button
                type="button"
                @click="$emit('cancel')"
                class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                :disabled="!isValid"
                class="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                Save Shipment
            </button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import useFormValidation from '@/composables/validators';
import useNotifyToast from '@/composables/alert_toast';
import { useShipmentStore } from '@/stores/shipment';
import type { IShipment, IReferralLaboratory } from '@/models/shipment';

const props = defineProps<{
    initialData?: Partial<IShipment>;
    laboratories: IReferralLaboratory[];
}>();

const emit = defineEmits<{
    (e: 'submit', data: IShipment): void;
    (e: 'cancel'): void;
}>();

const { toastError } = useNotifyToast();
const shipmentStore = useShipmentStore();

const {
    errors,
    isValid,
    validate,
    validateField: validateSingleField,
    courierValidator,
    laboratoryValidator,
    samplesValidator,
    minLength
} = useFormValidation();

const formData = reactive({
    courier: props.initialData?.courier || '',
    laboratory: props.initialData?.laboratory || null,
    comment: props.initialData?.comment || '',
    samples: props.initialData?.samples || []
});

// Validation rules for each field
const validationRules = {
    courier: [courierValidator],
    laboratory: [laboratoryValidator],
    comment: [minLength(10)],
    samples: [samplesValidator]
};

// Validate a single field
const validateField = (field: string) => {
    const fieldRules = validationRules[field];
    if (fieldRules) {
        const error = validateSingleField(formData[field], fieldRules);
        if (error) {
            errors.value[field] = error;
        } else {
            delete errors.value[field];
        }
    }
};

// Remove a sample from the selection
const removeSample = (sample: any) => {
    const index = formData.samples.findIndex(s => s.uid === sample.uid);
    if (index > -1) {
        formData.samples.splice(index, 1);
        validateField('samples');
    }
};

// Handle form submission
const handleSubmit = async () => {
    const isFormValid = validate(validationRules, formData);
    
    if (!isFormValid) {
        toastError('Please fix the validation errors before submitting');
        return;
    }

    try {
        emit('submit', formData as IShipment);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save shipment';
        toastError(errorMessage);
    }
};
</script> 