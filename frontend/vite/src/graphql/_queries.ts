import gql from 'graphql-tag'

export const GET_ALL_USERS = gql`
  query userAll($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
    userAll(pageSize:$first, afterCursor:$after, text:$text, sortBy:$sortBy) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      items {
          uid
          firstName
          lastName
          email
          isActive
          isSuperuser
          mobilePhone
          auth {
            uid
            userName
            isBlocked
            userType          
          }
          groups {
            uid
            name
            keyword
          }
      }
    }
  }`;


export const GET_GROUPS_AND_PERMISSIONS = gql`
  query groupsAndPermissions {
    groupAll {
      uid
      name
      keyword
      active
      permissions {
        uid
        action
        target
      }
    }
    
    permissionAll {
      uid
      action
      target
    }
  }`;


export const GET_AUDIT_LOG_FOR_TARGET = gql`
  query getAuditLogs($targetType: String!, $targetId: Int!) {
    auditLogsFilter(targetType:$targetType, targetId:$targetId){
      uid
      userId
      targetType
      targetId
      action
      stateBefore
      stateAfter
    }
  }`;


export const GET_DEPARTMENTS = gql`
  query getAllDepartments {
    departmentAll {
      uid
      name
      code
      description
    }
  }`;
