<script setup lang="ts">
import { ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { AddGrindErrandDiscussionDocument, AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { IGrindErrandDiscussion } from '@/models/grind';

const props = defineProps({
    errandUid: {
        type: String,
        required: true
    },
    parentDiscussion: {
        type: Object as () => IGrindErrandDiscussion | undefined,
        default: undefined
    },
    isReply: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['commentAdded', 'cancelReply']);

const { withClientMutation } = useApiUtil();
const comment = ref('');

function addDiscussion() {
    if (!comment.value.trim()) return;

    withClientMutation<AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables>(
        AddGrindErrandDiscussionDocument,
        { 
            payload: { 
                comment: comment.value, 
                errandUid: props.errandUid, 
                parentUid: props.parentDiscussion?.uid 
            } 
        },
        "createGrindErrandDiscussion"
    ).then(() => {
        comment.value = '';
        emit('commentAdded');
    });
}

function cancelReply() {
    emit('cancelReply');
}
</script>

<template>
    <div class="mb-4">
        <textarea
            v-model="comment"
            :rows="isReply ? 2 : 3"
            :class="`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${isReply ? 'text-sm' : ''}`"
            :placeholder="isReply ? 'Write a reply...' : 'Add a comment...'"
        ></textarea>
        <div class="flex items-center justify-end mt-2 gap-2">
            <button 
                v-if="isReply"
                @click="cancelReply" 
                class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm"
            >
                Cancel
            </button>
            <button 
                @click="addDiscussion"
                :class="`px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 ${isReply ? 'text-sm px-2 py-1' : ''}`"
            >
                <div v-if="!isReply" class="flex items-center gap-2 font-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
                {{ isReply ? 'Reply' : 'Comment' }}
            </button>
        </div>
    </div>
</template>
