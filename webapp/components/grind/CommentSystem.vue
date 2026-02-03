<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables, GetGrindErrandDiscussionsDocument } from '@/graphql/operations/grind.queries';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { RequestPolicy } from '@urql/vue';
import { GrindErrandDiscussionType } from '@/types/gql';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

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
            <span class="inline-flex items-center gap-2">
                <Spinner class="size-3" />
                <span class="text-xs">Loading comments...</span>
            </span>
        </div>

        <!-- Error state -->
        <Alert v-else-if="error" variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

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
            <Empty v-else class="py-8">
                <EmptyContent>
                    <EmptyHeader>
                        <EmptyTitle>No comments yet</EmptyTitle>
                        <EmptyDescription>Be the first to comment!</EmptyDescription>
                    </EmptyHeader>
                </EmptyContent>
            </Empty>
        </div>
    </div>
</template>
