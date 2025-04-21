<script setup lang="ts">
import { ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { AddGrindErrandDiscussionDocument, AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { GrindErrandDiscussionType } from '@/types/gql';

interface Props {
    errandUid: string;
    parentDiscussion?: GrindErrandDiscussionType;
    isReply?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    parentDiscussion: undefined,
    isReply: false
});

const emit = defineEmits<{
    (e: 'commentAdded'): void;
    (e: 'cancelReply'): void;
}>();

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
    <div class="mb-4" role="form" :aria-label="isReply ? 'Reply form' : 'Comment form'">
        <textarea
            v-model="comment"
            :rows="isReply ? 2 : 3"
            class="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-colors"
            :class="{ 'text-sm': isReply }"
            :placeholder="isReply ? 'Write a reply...' : 'Add a comment...'"
            :aria-label="isReply ? 'Reply text' : 'Comment text'"
        ></textarea>
        <div class="flex items-center justify-end mt-2 gap-2">
            <button 
                v-if="isReply"
                @click="cancelReply" 
                class="px-2 py-1 border border-input bg-background text-foreground rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors text-sm"
                aria-label="Cancel reply"
            >
                Cancel
            </button>
            <button 
                @click="addDiscussion"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground h-9 px-4 py-2"
                :class="{ 'text-sm px-2 py-1': isReply }"
                :aria-label="isReply ? 'Submit reply' : 'Submit comment'"
            >
                <div v-if="!isReply" class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
                {{ isReply ? 'Reply' : 'Comment' }}
            </button>
        </div>
    </div>
</template>
