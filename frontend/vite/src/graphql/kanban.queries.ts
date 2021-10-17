import gql from 'graphql-tag'

export const GET_ALL_BOARDS = gql`
  query getAllBoards {
    boardAll{
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      items {
          uid
          title
          description
          department {
            uid
            name
          }
        }
      }
  }`;


export const GET_BOARD_BY_UID = gql`
  query getBoardByUid($uid: Int!) {
    boardByUid(uid: $uid){
      uid
      title
      description
      department {
        uid
        name
      }
      boardListings {
        uid
        title
        description
        listingTasks {
          uid
          title
          description
        }
      }
    }
}`;



export const GET_LISTING_TASK_BY_UID = gql`
  query getListingTaskUid($uid: Int!) {
    listingTaskByUid(uid: $uid){
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
}`;
