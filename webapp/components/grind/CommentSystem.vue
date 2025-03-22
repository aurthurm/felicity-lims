<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables, GetGrindErrandDiscussionsDocument } from '@/graphql/operations/grind.queries';
import { IGrindErrandDiscussion } from '@/models/grind';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { RequestPolicy } from '@urql/vue';

const props = defineProps(["errandUid"]);
const { withClientQuery } = useApiUtil();

// Discussions
const discussions = ref<IGrindErrandDiscussion[]>([]);
const replyingTo = ref<IGrindErrandDiscussion | null>(null);
const editingComment = ref<IGrindErrandDiscussion | null>(null);

onMounted(() => {
    getDiscussions();
});

function getDiscussions(requestPolicy: RequestPolicy = 'cache-first') {
    withClientQuery<GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables>(
        GetGrindErrandDiscussionsDocument, { errandUid: props.errandUid }, "grindErrandDiscussions", requestPolicy
    ).then((res: any) => {
        if (res) {
            discussions.value = res as IGrindErrandDiscussion[];
        }
    });
}

// Filter top-level comments (no parent)
function getTopLevelComments(): IGrindErrandDiscussion[] {
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

function setReplyingTo(discussion: IGrindErrandDiscussion | null) {
    replyingTo.value = discussion;
}

function setEditingComment(discussion: IGrindErrandDiscussion | null) {
    editingComment.value = discussion;
}
</script>

<template>
    <!-- Main comment input -->
    <CommentForm 
        :errand-uid="errandUid" 
        @comment-added="handleCommentAdded" 
    />

    <!-- Comments and replies -->
    <CommentList 
        :comments="getTopLevelComments()" 
        :replying-to="replyingTo"
        :editing-comment="editingComment"
        :errand-uid="errandUid"
        @set-replying-to="setReplyingTo"
        @set-editing-comment="setEditingComment"
        @comment-added="handleCommentAdded"
        @comment-updated="handleCommentUpdated"
    />
</template>
