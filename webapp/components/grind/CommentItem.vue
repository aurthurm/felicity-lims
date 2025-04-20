<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IGrindErrandDiscussion } from '@/models/grind';
import { GetGrindErrandDiscussionsByParentDocument, GetGrindErrandDiscussionsByParentQuery, GetGrindErrandDiscussionsByParentQueryVariables } from '@/graphql/operations/grind.queries';
import useApiUtil from '@/composables/api_util';
import CommentForm from './CommentForm.vue';

interface Props {
    discussion: IGrindErrandDiscussion & {
        createdBy?: {
            uid: string;
            firstName?: string | null;
            lastName?: string | null;
        } | null;
        createdAt?: string | null;
    };
    errandUid: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: 'reply', discussion: IGrindErrandDiscussion): void;
    (e: 'edit', discussion: IGrindErrandDiscussion): void;
}>();

const { withClientQuery } = useApiUtil();
const replies = ref<IGrindErrandDiscussion[]>([]);
const isLoading = ref(false);
const showReplies = ref(false);
const showReplyForm = ref(false);

onMounted(() => {
    if (props.discussion.subdiscussions?.length) {
        fetchReplies();
    }
});

function fetchReplies() {
    isLoading.value = true;
    withClientQuery<GetGrindErrandDiscussionsByParentQuery, GetGrindErrandDiscussionsByParentQueryVariables>(
        GetGrindErrandDiscussionsByParentDocument,
        { parentUid: props.discussion.uid },
        "grindErrandDiscussionsByParent"
    ).then((result) => {
        if (result && typeof result === 'object' && 'grindErrandDiscussionsByParent' in result) {
            replies.value = result.grindErrandDiscussionsByParent as IGrindErrandDiscussion[];
        }
        isLoading.value = false;
    });
}

function toggleReplies() {
    showReplies.value = !showReplies.value;
    if (showReplies.value && replies.value.length === 0) {
        fetchReplies();
    }
}

function handleReply() {
    emit('reply', props.discussion);
}

function handleEdit() {
    emit('edit', props.discussion);
}

function handleCommentAdded() {
    showReplyForm.value = false;
    fetchReplies();
}
</script>

<template>
    <div class="mb-4 p-4 border border-input bg-background rounded-lg shadow-sm" role="article" :aria-label="`Comment by ${discussion.createdBy?.firstName || 'User'}`">
        <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    {{ discussion.createdBy?.firstName?.[0] || 'U' }}
                </div>
            </div>
            <div class="flex-grow">
                <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-2">
                        <span class="font-medium text-foreground">
                            {{ discussion.createdBy?.firstName }} {{ discussion.createdBy?.lastName }}
                        </span>
                        <span class="text-sm text-muted-foreground">{{ discussion.createdAt ? new Date(discussion.createdAt).toLocaleString() : '' }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button 
                            @click="handleReply"
                            class="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors"
                            aria-label="Reply to comment"
                        >
                            Reply
                        </button>
                        <button 
                            v-if="discussion.canEdit"
                            @click="handleEdit"
                            class="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors"
                            aria-label="Edit comment"
                        >
                            Edit
                        </button>
                    </div>
                </div>
                <p class="text-foreground whitespace-pre-wrap">{{ discussion.comment }}</p>
                <div v-if="discussion.subdiscussions?.length" class="mt-2">
                    <button 
                        @click="toggleReplies"
                        class="text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 transition-colors"
                        :aria-expanded="showReplies"
                        :aria-label="`${showReplies ? 'Hide' : 'Show'} ${discussion.subdiscussions.length} ${discussion.subdiscussions.length === 1 ? 'reply' : 'replies'}`"
                    >
                        {{ discussion.subdiscussions.length }} {{ discussion.subdiscussions.length === 1 ? 'reply' : 'replies' }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="showReplies" class="mt-4 ml-8">
            <div v-if="isLoading" class="flex items-center justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" role="status" aria-label="Loading replies"></div>
            </div>
            <template v-else>
                <div v-if="replies.length === 0" class="text-sm text-muted-foreground py-2">
                    No replies yet
                </div>
                <template v-else>
                    <CommentItem 
                        v-for="reply in replies" 
                        :key="reply.uid" 
                        :discussion="reply" 
                        :errand-uid="errandUid"
                        @reply="handleReply"
                        @edit="handleEdit"
                    />
                </template>
            </template>
        </div>

        <div v-if="showReplyForm" class="mt-4 ml-8">
            <CommentForm 
                :errand-uid="errandUid" 
                :parent-discussion="discussion"
                :is-reply="true"
                @comment-added="handleCommentAdded"
                @cancel-reply="showReplyForm = false"
            />
        </div>
    </div>
</template>