<script setup lang="ts">
import { IGrindErrandDiscussion } from '@/models/grind';
import CommentItem from './CommentItem.vue';

const props = defineProps({
    comments: {
        type: Array as () => IGrindErrandDiscussion[],
        required: true
    },
    replyingTo: {
        type: Object as () => IGrindErrandDiscussion | null,
        default: null
    },
    editingComment: {
        type: Object as () => IGrindErrandDiscussion | null,
        default: null
    },
    level: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['setReplyingTo', 'setEditingComment', 'commentAdded', 'commentUpdated']);

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
    <div :class="`space-y-${level === 0 ? '6' : '4'}`">
        <div 
            v-for="comment in comments" 
            :key="comment.uid" 
            :class="level === 0 ? 'border-b border-border pb-4' : ''"
        >
            <CommentItem 
                :comment="comment"
                :replying-to="replyingTo"
                :editing-comment="editingComment"
                :level="level"
                @set-replying-to="handleSetReplyingTo"
                @set-editing-comment="handleSetEditingComment"
                @comment-added="handleCommentAdded"
                @comment-updated="handleCommentUpdated"
            />
        </div>
    </div>
</template>