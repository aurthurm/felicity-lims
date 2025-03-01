import useApiUtil from '@/composables/api_util';
import { AddGrindErrandDiscussionDocument, AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { EditGrindErrandDiscussionDocument, EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables } from '@/graphql/operations/grind.mutations';
import { GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables, GetGrindErrandDiscussionsDocument } from '@/graphql/operations/grind.queries';
import { IGrindErrandDiscussion } from '@/models/grind';

export function useCommentComposable() {
    const { withClientMutation, withClientQuery } = useApiUtil();

    const getDiscussions = async (errandUid: string): Promise<IGrindErrandDiscussion[]> => {
        const result = await withClientQuery<GetGrindErrandDiscussionsQuery, GetGrindErrandDiscussionsQueryVariables>(
            GetGrindErrandDiscussionsDocument, { errandUid }, "grindErrandDiscussions"
        );
        return result ? (result as IGrindErrandDiscussion[]) : [];
    };

    const addDiscussion = async (
        comment: string, 
        errandUid: string, 
        parentUid?: string
    ): Promise<boolean> => {
        try {
            await withClientMutation<AddGrindErrandDiscussionMutation, AddGrindErrandDiscussionMutationVariables>(
                AddGrindErrandDiscussionDocument,
                { 
                    payload: { comment, errandUid, parentUid } 
                },
                "createGrindErrandDiscussion"
            );
            return true;
        } catch (error) {
            console.error('Error adding comment:', error);
            return false;
        }
    };

    const updateDiscussion = async (
        uid: string,
        comment: string
    ): Promise<boolean> => {
        try {
            await withClientMutation<EditGrindErrandDiscussionMutation, EditGrindErrandDiscussionMutationVariables>(
                EditGrindErrandDiscussionDocument,
                { 
                    payload: { uid, comment } 
                },
                "updateGrindErrandDiscussion"
            );
            return true;
        } catch (error) {
            console.error('Error updating comment:', error);
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