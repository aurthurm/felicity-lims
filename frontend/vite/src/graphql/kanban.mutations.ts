import gql from 'graphql-tag';

// Board
export const ADD_BOARD = gql`
  mutation AddBoard($title: String!, $departmentUid: Int, $description: String) {
    createBoard(title: $title, departmentUid: $departmentUid, description: $description){
          uid
          title
          description
          departmentUid
          department {
            uid
            name
          }
      }
  }
`;

export const EDIT_BOARD = gql`
  mutation editBoard($uid: Int!, $title: String!, $departmentUid: Int, $description: String){
    updateBoard(uid: $uid, title: $title, departmentUid: $departmentUid, description: $description){
          uid
          title
          description
          departmentUid
          department {
            uid
            name
        }
      }
  }
`;

export const DELETE_BOARD = gql`
  mutation deleteBoard($uid: Int!) {
    deleteBoard(uid: $uid){
      uid
    }
  }
`;

// board listing
export const ADD_BOARD_LISTING = gql`
  mutation addBoardListing($title: String!, $boardUid: Int!, $description: String) {
    createBoardListing(title: $title, boardUid: $boardUid, description: $description){
          uid
          title
          description
          boardUid
    }
  }
`;

export const DELETE_BOARD_LISTING = gql`
  mutation deleteListing($uid: Int!) {
    deleteBoardListing(uid: $uid){
     uid
    }
  }
`;


// listing tasks
export const ADD_LISTING_TASK = gql`
  mutation addListingTask($title: String!, $listingUid: Int!, $description: String) {
    createListingTask(title: $title, listingUid: $listingUid, description: $description){
          uid
          title
          description
          listingUid
    }
  }
`;


export const EDIT_LISTING_TASK = gql`
  mutation editListingTask($uid: Int!, $title: String, $description: String, $listingUid: Int, $dueDate: String, 
    $assigneeUid: Int, $memberUids: [Int!], $tags: [String!], $complete: Boolean, $archived: Boolean) {
    updateListingTask(uid: $uid, title: $title, description: $description, listingUid: $listingUid, dueDate: $dueDate, 
    assigneeUid: $assigneeUid, memberUids: $memberUids, tags: $tags, complete: $complete, archived: $archived){
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
    }
`;

export const DELETE_LISTING_TASK = gql`
  mutation removeListingTask($uid: Int!) {
    deleteListingTask(uid: $uid){
      uid
    }
  }
`;

export const DUPLICATE_LISTING_TASK = gql`
  mutation copyListingTask($uid: Int!, $title: String!) {
    duplicateListingTask(uid: $uid, title: $title){
      uid
      listingUid
      title
      description
      listingUid
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation addTaskComment($comment: String!, $taskUid: Int!) {
    createTaskComment(comment: $comment, taskUid: $taskUid){
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
  }
`;

export const ADD_TASK_MILESTONE = gql`
  mutation addTaskMIlestone($title: String!, $taskUid: Int!, $done: Boolean, $assigneeUid: Int) {
    createTaskMilestone(title: $title, taskUid: $taskUid, done: $done, assigneeUid: $assigneeUid){
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
  }
`;