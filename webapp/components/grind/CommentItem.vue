<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import useApiUtil from '@/composables/api_util';
import { EditGrindErrandDiscussionDocument, EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { IGrindErrandDiscussion } from '@/models/grind';
import { getUserInitials } from '@/utils/helpers';
import CommentForm from './CommentForm.vue';
import CommentList from './CommentList.vue';
import { GetGrindErrandDiscussionsByParentQuery, GetGrindErrandDiscussionsByParentQueryVariables, GetGrindErrandDiscussionsByParentDocument } from '@/graphql/operations/grind.queries';

const props = defineProps({
    comment: {
        type: Object as () => IGrindErrandDiscussion,
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

onMounted(() => {
    getReplies(props.comment.uid)
});

const emit = defineEmits(['setReplyingTo', 'setEditingComment', 'commentAdded', 'commentUpdated']);

const { withClientMutation, withClientQuery } = useApiUtil();

const replies = ref<IGrindErrandDiscussion[]>([]);
function getReplies(parentUid: string) {
    withClientQuery<GetGrindErrandDiscussionsByParentQuery, GetGrindErrandDiscussionsByParentQueryVariables>(
        GetGrindErrandDiscussionsByParentDocument, { parentUid }, "grindErrandDiscussionsByParent"
    ).then((res: any) => {
        if (res) {
            replies.value = res as IGrindErrandDiscussion[];
        }
    });
}

const isEditing = computed(() => 
    props.editingComment && props.editingComment.uid === props.comment.uid
);

const isReplying = computed(() => 
    props.replyingTo && props.replyingTo.uid === props.comment.uid
);

const canReply = computed(() => 
    props.level < 2 // Allow replies only for top-level and first-level comments
);

const avatarSize = computed(() => {
    switch (props.level) {
        case 0: return 'h-10 w-10';
        case 1: return 'h-8 w-8';
        case 2: return 'h-6 w-6';
        default: return 'h-10 w-10';
    }
});

const avatarColor = computed(() => {
    switch (props.level) {
        case 0: return 'bg-orange-100 text-orange-600';
        case 1: return 'bg-blue-100 text-blue-600';
        case 2: return 'bg-green-100 text-green-600';
        default: return 'bg-orange-100 text-orange-600';
    }
});

const textSize = computed(() => {
    switch (props.level) {
        case 0: return '';
        case 1: return 'text-sm';
        case 2: return 'text-xs';
        default: return '';
    }
});

const iconSize = computed(() => {
    switch (props.level) {
        case 0: return 'h-5 w-5';
        case 1: return 'h-4 w-4';
        case 2: return 'h-3.5 w-3.5';
        default: return 'h-5 w-5';
    }
});

function toggleReply() {
    if (isReplying.value) {
        emit('setReplyingTo', null);
    } else {
        emit('setReplyingTo', props.comment);
    }
}

function startEditing() {
    emit('setEditingComment', {...props.comment});
}

function cancelEditing() {
    emit('setEditingComment', null);
}

function updateDiscussion() {
    if (!props.editingComment) return;
    withClientMutation<EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables>(
        EditGrindErrandDiscussionDocument,
        { 
            uid: props.comment.uid,
            payload: { 
                comment: props.editingComment.comment,
                errandUid: props.editingComment.errandUid
            }
        },
        "updateGrindErrandDiscussion"
    ).then(() => {
        emit('commentUpdated');
    });
}

function handleCommentAdded() {
    emit('commentAdded');
    getReplies(props.comment.uid);
}

function handleCommentUpdated() {
    emit('commentUpdated');
    getReplies(props.comment.uid);
}

function handleSetReplyingTo(discussion: IGrindErrandDiscussion | null) {
    emit('setReplyingTo', discussion);
}

function handleSetEditingComment(discussion: IGrindErrandDiscussion | null) {
    emit('setEditingComment', discussion);
}
</script>

<template>
    <div class="flex items-start gap-4">
        <div :class="`${avatarSize} shrink-0 rounded-full ${avatarColor} flex items-center justify-center font-semibold ${textSize}`">
            {{ getUserInitials(comment.createdBy?.firstName, comment.createdBy?.lastName) }}
        </div>
        <div class="flex-1">
            <!-- Comment header -->
            <div class="flex justify-between">
                <div>
                    <h3 :class="`font-medium ${textSize}`">{{ comment.createdBy?.firstName }} {{ comment.createdBy?.lastName }}</h3>
                    <div :class="`${level > 0 ? 'text-xs' : 'text-sm'} text-gray-500`">{{ comment.createdAt }}</div>
                </div>
                <!-- Comment action buttons -->
                <div class="flex gap-2" v-if="!isEditing">
                    <button v-if="comment.canEdit" @click="startEditing" class="text-gray-500 hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" :class="iconSize" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button v-if="canReply" @click="toggleReply" class="text-gray-500 hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" :class="iconSize" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Comment content - edit mode -->
            <div v-if="isEditing" :class="`mt-${level === 0 ? 2 : level === 1 ? 2 : 1}`">
                <textarea
                    v-model="editingComment.comment"
                    :rows="level === 0 ? 3 : 2"
                    :class="`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 ${level === 2 ? 'text-xs' : ''}`"
                ></textarea>
                <div class="flex items-center justify-end gap-2 mt-2">
                    <button @click="cancelEditing" :class="`px-${level < 2 ? 3 : 2} py-${level < 2 ? '1.5' : 1} border border-gray-300 rounded hover:bg-gray-50 ${level > 0 ? 'text-sm' : ''}`">
                        Cancel
                    </button>
                    <button @click="updateDiscussion" :class="`px-${level < 2 ? 3 : 2} py-${level < 2 ? '1.5' : 1} bg-blue-500 text-white rounded hover:bg-blue-600 ${level > 0 ? 'text-sm' : ''}`">
                        Save
                    </button>
                </div>
            </div>
            
            <!-- Comment content - normal mode -->
            <div v-else :class="`mt-${level === 0 ? 2 : 1} text-gray-600 ${textSize}`" v-html="comment.comment"></div>
            
            <!-- Reply input area -->
            <div v-if="isReplying" :class="`mt-${level === 0 ? 3 : 2}`">
                <CommentForm 
                    :parent-discussion="comment"
                    :is-reply="true"
                    :errandUid="comment.errandUid"
                    @comment-added="handleCommentAdded"
                    @cancel-reply="toggleReply"
                />
            </div>
        </div>
    </div>

    <!-- Render replies to this comment -->
    <div v-if="replies.length > 0" :class="`ml-${level === 0 ? 14 : 12} mt-4`">
        <CommentList
            :comments="replies"
            :replying-to="replyingTo"
            :editing-comment="editingComment"
            :level="level + 1"
            @set-replying-to="handleSetReplyingTo"
            @set-editing-comment="handleSetEditingComment"
            @comment-added="handleCommentAdded"
            @comment-updated="handleCommentUpdated"
        />
    </div>
</template>
