import gql from 'graphql-tag';


// Board
export const ADD_BOARD = gql`
  mutation AddBoard($payload: BoardInputType!) {
    createBoard(payload: $payload){
      ... on BoardType {
        __typename
        uid
        title
        description
        departmentUid
        department {
          uid
          name
        }
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
      }
  }
`;

export const EDIT_BOARD = gql`
  mutation editBoard($uid: Int!, $payload: BoardInputType!){
    updateBoard(uid: $uid, payload: $payload){
      ... on BoardType {
        __typename
        uid
        title
        description
        departmentUid
        department {
          uid
          name
        }
      }
      ... on OperationError {
        __typename
        error
        suggestion
      }
      }
  }
`;

export const DELETE_BOARD = gql`
  mutation deleteBoard($uid: Int!) {
    deleteBoard(uid: $uid){
      ... on DeletedItem {
        __typename
        uid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

// board listing
export const ADD_BOARD_LISTING = gql`
  mutation addBoardListing($payload: BoardListingInputType!) {
    createBoardListing(payload: $payload){
      ... on BoardListingType {
        uid
        title
        description
        boardUid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const DELETE_BOARD_LISTING = gql`
  mutation deleteListing($uid: Int!) {
    deleteBoardListing(uid: $uid){
      ... on DeletedItem {
        __typename
        uid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


// listing tasks
export const ADD_LISTING_TASK = gql`
  mutation addListingTask($title: String!, $listingUid: Int!, $description: String) {
    createListingTask(title: $title, listingUid: $listingUid, description: $description){
      ... on ListingTaskType {
        __typename
        uid
        title
        description
        listingUid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;


export const EDIT_LISTING_TASK = gql`
  mutation editListingTask($uid: Int!, $payload: ListingTaskInputType!) {
    updateListingTask(uid: $uid, payload: $payload){
      ... on ListingTaskType{
        __typename
        uid
        listingUid
        title
        description
        assigneeUid
        assignee {
          uid
          firstName
          lastName
          auth {
            userName
          }
        }
        dueDate
        members {
          uid
          firstName
          lastName
          auth {
            userName
          }
        }
        tags {
          uid
          name
        }
        taskMilestones {
          uid
          title
          done
          assigneeUid
          assignee {
            lastName
            firstName
            auth {
              userName
            }
          }
          createdAt
          createdByUid
          createdBy {
            firstName
            lastName
            auth {
              userName
            }
          }
        }
        taskComments {
          uid
          comment
          updatedAt
          updatedByUid
          updatedBy {
            firstName
            lastName
            auth {
              userName
            }
          }
        }
        complete  
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
      }
    }
`;

export const DELETE_LISTING_TASK = gql`
  mutation removeListingTask($uid: Int!) {
    deleteListingTask(uid: $uid){
      ... on DeletedItem {
        __typename
        uid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const DUPLICATE_LISTING_TASK = gql`
  mutation copyListingTask($uid: Int!, $title: String!) {
    duplicateListingTask(uid: $uid, title: $title){
      ... on ListingTaskType {
        __typename
        uid
        listingUid
        title
        description
        listingUid
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation addTaskComment($comment: String!, $taskUid: Int!) {
    createTaskComment(comment: $comment, taskUid: $taskUid){
      ... on TaskCommentType {
        __typename
        uid
        comment
        updatedByUid
        updatedBy {
          firstName
          lastName
          auth {
            userName
          }
        }
        updatedAt
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
    }
  }
`;

export const ADD_TASK_MILESTONE = gql`
  mutation addTaskMIlestone($title: String!, $taskUid: Int!, $done: Boolean, $assigneeUid: Int) {
    createTaskMilestone(title: $title, taskUid: $taskUid, done: $done, assigneeUid: $assigneeUid){
      ... on TaskMilestoneType {
        __typename
        uid
        title
        done
        assigneeUid
        assignee {
          firstName
          lastName
          auth {
            userName
          }
        }
        updatedByUid
        updatedBy {
          firstName
          lastName
          auth {
            userName
          }
        }
        updatedAt
      }

      ... on OperationError {
        __typename
        error
        suggestion
      }
      }
  }
`;