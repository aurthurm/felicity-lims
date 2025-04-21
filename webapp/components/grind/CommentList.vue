<script setup lang="ts">
import { GrindErrandDiscussionType } from '@/types/gql';
import CommentItem from './CommentItem.vue';

interface Props {
    comments: GrindErrandDiscussionType[];
    replyingTo: GrindErrandDiscussionType | null;
    editingComment: GrindErrandDiscussionType | null;
    level: number;
    errandUid: string;
}

const props = withDefaults(defineProps<Props>(), {
    replyingTo: null,
    editingComment: null,
    level: 0
});

const emit = defineEmits<{
    (e: 'setReplyingTo', discussion: GrindErrandDiscussionType | null): void;
    (e: 'setEditingComment', discussion: GrindErrandDiscussionType | null): void;
    (e: 'commentAdded'): void;
    (e: 'commentUpdated'): void;
}>();

function handleSetReplyingTo(discussion: GrindErrandDiscussionType | null) {
    emit('setReplyingTo', discussion);
}

function handleSetEditingComment(discussion: GrindErrandDiscussionType | null) {
    emit('setEditingComment', discussion);
}

function handleCommentAdded() {
    emit('commentAdded');
}

function handleCommentUpdated() {
    emit('commentUpdated');
}
</script>

<template>
    <div 
        :class="`space-y-${level === 0 ? '6' : '4'}`" 
        role="list" 
        :aria-label="`${level === 0 ? 'Top-level comments' : 'Nested comments'}`"
    >
        <div 
            v-for="comment in comments" 
            :key="comment.uid" 
            :class="level === 0 ? 'border-b border-border pb-4' : ''"
            role="listitem"
        >
            <CommentItem 
                :discussion="comment"
                :errand-uid="errandUid"
                @reply="handleSetReplyingTo"
                @edit="handleSetEditingComment"
                @comment-added="handleCommentAdded"
                @comment-updated="handleCommentUpdated"
            />
        </div>
    </div>
</template>