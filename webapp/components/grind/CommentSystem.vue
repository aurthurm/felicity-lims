<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables, GetGrindErrandDiscussionsDocument } from '@/graphql/operations/grind.queries';
import { IGrindErrandDiscussion } from '@/models/grind';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';

const props = defineProps(["errandUid"]);
const { withClientQuery } = useApiUtil();

// Discussions
const discussions = ref<IGrindErrandDiscussion[]>([]);
const replyingTo = ref<IGrindErrandDiscussion | null>(null);
const editingComment = ref<IGrindErrandDiscussion | null>(null);

onMounted(() => {
    getDiscussions();
});

function getDiscussions() {
    withClientQuery<GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables>(
        GetGrindErrandDiscussionsDocument, { errandUid: props.errandUid }, "grindErrandDiscussions"
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
    getDiscussions();
    replyingTo.value = null;
}

function handleCommentUpdated() {
    getDiscussions();
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
