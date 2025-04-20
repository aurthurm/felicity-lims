<script setup lang="ts">
import { IGrindErrandDiscussion } from '@/models/grind';
import CommentItem from './CommentItem.vue';

interface Props {
    comments: IGrindErrandDiscussion[];
    replyingTo: IGrindErrandDiscussion | null;
    editingComment: IGrindErrandDiscussion | null;
    level: number;
    errandUid: string;
}

const props = withDefaults(defineProps<Props>(), {
    replyingTo: null,
    editingComment: null,
    level: 0
});

const emit = defineEmits<{
    (e: 'setReplyingTo', discussion: IGrindErrandDiscussion | null): void;
    (e: 'setEditingComment', discussion: IGrindErrandDiscussion | null): void;
    (e: 'commentAdded'): void;
    (e: 'commentUpdated'): void;
}>();

function handleSetReplyingTo(discussion: IGrindErrandDiscussion | null) {
    emit('setReplyingTo', discussion);
}

function handleSetEditingComment(discussion: IGrindErrandDiscussion | null) {
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