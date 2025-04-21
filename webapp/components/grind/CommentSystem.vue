<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables, GetGrindErrandDiscussionsDocument } from '@/graphql/operations/grind.queries';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { RequestPolicy } from '@urql/vue';
import { GrindErrandDiscussionType } from '@/types/gql';

interface Props {
    errandUid: string;
}

const props = defineProps<Props>();
const { withClientQuery } = useApiUtil();

// Discussions
const discussions = ref<GrindErrandDiscussionType[]>([]);
const replyingTo = ref<GrindErrandDiscussionType | null>(null);
const editingComment = ref<GrindErrandDiscussionType | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(() => {
    getDiscussions();
});

async function getDiscussions(requestPolicy: RequestPolicy = 'cache-first') {
    isLoading.value = true;
    error.value = null;

    try {
        const result = await withClientQuery<GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables>(
            GetGrindErrandDiscussionsDocument, 
            { errandUid: props.errandUid }, 
            "grindErrandDiscussions", 
            requestPolicy
        );

        if (result && typeof result === 'object' && 'grindErrandDiscussions' in result) {
            discussions.value = result.grindErrandDiscussions as unknown as GrindErrandDiscussionType[];
        } else {
            error.value = 'Failed to load discussions';
        }
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'An error occurred while loading discussions';
    } finally {
        isLoading.value = false;
    }
}

// Filter top-level comments (no parent)
function getTopLevelComments(): GrindErrandDiscussionType[] {
    return discussions.value.filter(d => !d.parentUid);
}

function handleCommentAdded() {
    getDiscussions("network-only");
    replyingTo.value = null;
}

function handleCommentUpdated() {
    getDiscussions("network-only");
    editingComment.value = null;
}

function setReplyingTo(discussion: GrindErrandDiscussionType | null) {
    replyingTo.value = discussion;
}

function setEditingComment(discussion: GrindErrandDiscussionType | null) {
    editingComment.value = discussion;
}
</script>

<template>
    <div role="region" aria-label="Comments section">
        <!-- Loading state -->
        <div v-if="isLoading" class="flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" role="status" aria-label="Loading comments"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="p-4 border border-destructive bg-destructive/10 text-destructive rounded-md" role="alert">
            {{ error }}
        </div>

        <!-- Content -->
        <div v-else>
            <!-- Main comment input -->
            <CommentForm 
                :errand-uid="errandUid" 
                @comment-added="handleCommentAdded" 
            />

            <!-- Comments and replies -->
            <CommentList 
                v-if="getTopLevelComments().length > 0"
                :comments="getTopLevelComments()" 
                :replying-to="replyingTo"
                :editing-comment="editingComment"
                :errand-uid="errandUid"
                :level="0"
                @set-replying-to="setReplyingTo"
                @set-editing-comment="setEditingComment"
                @comment-added="handleCommentAdded"
                @comment-updated="handleCommentUpdated"
            />

            <!-- Empty state -->
            <div v-else class="text-center py-8 text-muted-foreground">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        </div>
    </div>
</template>
