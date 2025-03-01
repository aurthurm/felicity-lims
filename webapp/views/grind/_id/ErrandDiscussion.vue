<script setup lang="ts">
import useApiUtil from '@/composables/api_util';
import { AddGrindErrandDiscussionDocument, AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables, EditGrindErrandDiscussionDocument, EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables, GetGrindErrandDiscussionsDocument } from '@/graphql/operations/grind.queries';
import { IGrindErrandDiscussion } from '@/models/grind';
import { getUserInitials } from '@/utils/helpers';
import { onMounted, ref } from 'vue';

const props = defineProps(["errandUid"]);
const { withClientMutation, withClientQuery } = useApiUtil();

onMounted(() => {
    getDiscussions();
});

// Discussions
const discussions = ref<IGrindErrandDiscussion[]>([]);
function getDiscussions() {
    withClientQuery<GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables>(
        GetGrindErrandDiscussionsDocument, { errandUid: props.errandUid }, "grindErrandDiscussions"
    ).then((res: any) => {
        if (res) {
            discussions.value = res as IGrindErrandDiscussion[];
        }
    });
}

// Main comment
const comment = ref('');
const replyingTo = ref<IGrindErrandDiscussion | null>(null);
const editingComment = ref<IGrindErrandDiscussion | null>(null);

// For replies to comments
const replyComments = ref<{ [key: string]: string }>({});

function addDiscussion(parentDiscussion?: IGrindErrandDiscussion) {
    const commentText = parentDiscussion ? replyComments.value[parentDiscussion.uid] : comment.value;
    if (!commentText.trim()) return;

    withClientMutation<AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables>(
        AddGrindErrandDiscussionDocument,
        { 
            payload: { 
                comment: commentText, 
                errandUid: props.errandUid, 
                parentUid: parentDiscussion?.uid 
            } 
        },
        "createGrindErrandDiscussion"
    ).then(() => {
        getDiscussions();
        if (parentDiscussion) {
            replyComments.value[parentDiscussion.uid] = '';
            replyingTo.value = null;
        } else {
            comment.value = '';
        }
    });
}

function updateDiscussion(discussion: IGrindErrandDiscussion) {
    if (!editingComment.value) return;
    
    withClientMutation<EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables>(
        EditGrindErrandDiscussionDocument,
        { 
            payload: { 
                uid: discussion.uid,
                comment: editingComment.value.comment
            } 
        },
        "updateGrindErrandDiscussion"
    ).then(() => {
        getDiscussions();
        editingComment.value = null;
    });
}

function startEditing(discussion: IGrindErrandDiscussion) {
    editingComment.value = { ...discussion };
}

function cancelEditing() {
    editingComment.value = null;
}

function toggleReply(discussion: IGrindErrandDiscussion) {
    if (replyingTo.value?.uid === discussion.uid) {
        replyingTo.value = null;
    } else {
        replyingTo.value = discussion;
        if (!replyComments.value[discussion.uid]) {
            replyComments.value[discussion.uid] = '';
        }
    }
}

// Check if a comment has a parent but no grandparent (i.e., it's a first-level reply)
function isFirstLevelReply(discussion: IGrindErrandDiscussion): boolean {
    return !!discussion.parent && !discussion.parent.parent;
}

// Filter top-level comments (no parent)
function getTopLevelComments(): IGrindErrandDiscussion[] {
    return discussions.value.filter(d => !d.parentUid);
}

// Get replies for a specific comment
function getReplies(parentUid: string): IGrindErrandDiscussion[] {
    return discussions.value.filter(d => d.parent?.uid === parentUid);
}
</script>


<template>
    <!-- Main comment input -->
    <div class="mb-4">
        <textarea
            id="comment"
            v-model="comment"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            placeholder="Add a comment..."
        ></textarea>
        <div class="flex items-center justify-end mt-2">
            <button 
                @click="addDiscussion()"
                class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
            >
                <div class="flex items-center gap-2 font-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Comment
                </div>
            </button>
        </div>
    </div>

    <!-- Comments and replies -->
    <div class="space-y-6">
        <!-- Loop through top-level comments only -->
        <div v-for="discussion in getTopLevelComments()" :key="discussion.uid" class="border-b border-gray-200 pb-4">
            <div class="flex items-start gap-4">
                <div class="h-10 w-10 shrink-0 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                    {{ getUserInitials(discussion.createdBy?.firstName, discussion.createdBy?.lastName) }}
                </div>
                <div class="flex-1">
                    <!-- Comment header -->
                    <div class="flex justify-between">
                        <div>
                            <h3 class="font-medium">{{ discussion.createdBy?.firstName }} {{ discussion.createdBy?.lastName }}</h3>
                            <div class="text-sm text-gray-500">{{ discussion.createdAt }}</div>
                        </div>
                        <!-- Comment action buttons -->
                        <div class="flex gap-2" v-if="!editingComment || editingComment.uid !== discussion.uid">
                            <button @click="startEditing(discussion)" class="text-gray-500 hover:text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button @click="toggleReply(discussion)" class="text-gray-500 hover:text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Comment content - edit mode -->
                    <div v-if="editingComment && editingComment.uid === discussion.uid" class="mt-2">
                        <textarea
                            v-model="editingComment.comment"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        ></textarea>
                        <div class="flex items-center justify-end gap-2 mt-2">
                            <button @click="cancelEditing" class="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50">
                                Cancel
                            </button>
                            <button @click="updateDiscussion(discussion)" class="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </div>
                    
                    <!-- Comment content - normal mode -->
                    <div v-else class="mt-2 text-gray-600" v-html="discussion.comment"></div>
                    
                    <!-- Reply input area -->
                    <div v-if="replyingTo && replyingTo.uid === discussion.uid" class="mt-3">
                        <textarea
                            v-model="replyComments[discussion.uid]"
                            rows="2"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                            placeholder="Write a reply..."
                        ></textarea>
                        <div class="flex items-center justify-end gap-2 mt-2">
                            <button @click="replyingTo = null" class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                                Cancel
                            </button>
                            <button @click="addDiscussion(discussion)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Replies to this comment (1st level) -->
            <div v-if="getReplies(discussion.uid).length > 0" class="ml-14 mt-4 space-y-4">
                <div v-for="reply in getReplies(discussion.uid)" :key="reply.uid" class="flex items-start gap-4">
                    <div class="h-8 w-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {{ getUserInitials(reply.createdBy?.firstName, reply.createdBy?.lastName) }}
                    </div>
                    <div class="flex-1">
                        <!-- Reply header -->
                        <div class="flex justify-between">
                            <div>
                                <h3 class="font-medium text-sm">{{ reply.createdBy?.firstName }} {{ reply.createdBy?.lastName }}</h3>
                                <div class="text-xs text-gray-500">{{ reply.createdAt }}</div>
                            </div>
                            <!-- Reply action buttons -->
                            <div class="flex gap-2" v-if="!editingComment || editingComment.uid !== reply.uid">
                                <button @click="startEditing(reply)" class="text-gray-500 hover:text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button v-if="isFirstLevelReply(reply)" @click="toggleReply(reply)" class="text-gray-500 hover:text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Reply content - edit mode -->
                        <div v-if="editingComment && editingComment.uid === reply.uid" class="mt-2">
                            <textarea
                                v-model="editingComment.comment"
                                rows="2"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                            ></textarea>
                            <div class="flex items-center justify-end gap-2 mt-2">
                                <button @click="cancelEditing" class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                                    Cancel
                                </button>
                                <button @click="updateDiscussion(reply)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                    Save
                                </button>
                            </div>
                        </div>
                        
                        <!-- Reply content - normal mode -->
                        <div v-else class="mt-1 text-gray-600 text-sm" v-html="reply.comment"></div>
                        
                        <!-- Second-level reply input area -->
                        <div v-if="replyingTo && replyingTo.uid === reply.uid && isFirstLevelReply(reply)" class="mt-2">
                            <textarea
                                v-model="replyComments[reply.uid]"
                                rows="2"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                placeholder="Write a reply..."
                            ></textarea>
                            <div class="flex items-center justify-end gap-2 mt-2">
                                <button @click="replyingTo = null" class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs">
                                    Cancel
                                </button>
                                <button @click="addDiscussion(reply)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Second-level replies (if any) -->
                <div v-for="reply in getReplies(reply.uid)" :key="reply.uid" class="ml-12 flex items-start gap-3">
                    <div class="h-6 w-6 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs">
                        {{ getUserInitials(reply.createdBy?.firstName, reply.createdBy?.lastName) }}
                    </div>
                    <div class="flex-1">
                        <!-- Second-level reply header -->
                        <div class="flex justify-between">
                            <div>
                                <h3 class="font-medium text-xs">{{ reply.createdBy?.firstName }} {{ reply.createdBy?.lastName }}</h3>
                                <div class="text-xs text-gray-500">{{ reply.createdAt }}</div>
                            </div>
                            <!-- Second-level reply edit button -->
                            <div v-if="!editingComment || editingComment.uid !== reply.uid">
                                <button @click="startEditing(reply)" class="text-gray-500 hover:text-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Second-level reply content - edit mode -->
                        <div v-if="editingComment && editingComment.uid === reply.uid" class="mt-1">
                            <textarea
                                v-model="editingComment.comment"
                                rows="2"
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-xs"
                            ></textarea>
                            <div class="flex items-center justify-end gap-2 mt-1">
                                <button @click="cancelEditing" class="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 text-xs">
                                    Cancel
                                </button>
                                <button @click="updateDiscussion(reply)" class="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs">
                                    Save
                                </button>
                            </div>
                        </div>
                        
                        <!-- Second-level reply content - normal mode -->
                        <div v-else class="mt-1 text-gray-600 text-xs" v-html="reply.comment"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>