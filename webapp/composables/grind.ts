import useApiUtil from '@/composables/api_util';
import useNotifyToast from './alert_toast';
import { AddGrindErrandDiscussionDocument, AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { EditGrindErrandDiscussionDocument, EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables, GetGrindErrandDiscussionsDocument } from '@/graphql/operations/grind.queries';
import { IGrindErrandDiscussion } from '@/models/grind';

export function useCommentComposable() {
    const { withClientMutation, withClientQuery } = useApiUtil();
    const { toastSuccess, toastError } = useNotifyToast();

    const getDiscussions = async (errandUid: string): Promise<IGrindErrandDiscussion[]> => {
        try {
            const result = await withClientQuery<GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables>(
                GetGrindErrandDiscussionsDocument, 
                { errandUid }, 
                "grindErrandDiscussions"
            );
            return result ? (result as IGrindErrandDiscussion[]) : [];
        } catch (error) {
            toastError(`Failed to fetch discussions: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return [];
        }
    };

    const addDiscussion = async (
        comment: string, 
        errandUid: string, 
        parentUid?: string
    ): Promise<boolean> => {
        try {
            const response = await withClientMutation<AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables>(
                AddGrindErrandDiscussionDocument,
                { 
                    payload: { comment, errandUid, parentUid } 
                },
                "createGrindErrandDiscussion"
            );

            if (response) {
                toastSuccess('Comment added successfully');
                return true;
            }
            return false;
        } catch (error) {
            toastError(`Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    };

    const updateDiscussion = async (
        uid: string,
        errandUid: string,
        comment: string
    ): Promise<boolean> => {
        try {
            const response = await withClientMutation<EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables>(
                EditGrindErrandDiscussionDocument,
                { 
                    uid, payload: { errandUid, comment } 
                },
                "updateGrindErrandDiscussion"
            );

            if (response) {
                toastSuccess('Comment updated successfully');
                return true;
            }
            return false;
        } catch (error) {
            toastError(`Failed to update comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    };

    // Helper functions for comments
    const getTopLevelComments = (discussions: IGrindErrandDiscussion[]): IGrindErrandDiscussion[] => {
        return discussions.filter(d => !d.parentUid);
    };

    const getReplies = (discussions: IGrindErrandDiscussion[], parentUid: string): IGrindErrandDiscussion[] => {
        return discussions.filter(d => d.parent?.uid === parentUid);
    };

    const isFirstLevelReply = (discussion: IGrindErrandDiscussion): boolean => {
        return !!discussion.parent && !discussion.parent.parent;
    };

    return {
        getDiscussions,
        addDiscussion,
        updateDiscussion,
        getTopLevelComments,
        getReplies,
        isFirstLevelReply
    };
}

export default useCommentComposable;