import gql from 'graphql-tag'

export const GET_ALL_CLIENTS = gql`
  query getAllClients($first: Int, $after: String, $text: String, $sortBy: [String!] = ["uid"]) {
    clientAll(pageSize:$first, afterCursor:$after, text:$text, sortBy:$sortBy) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      items {
          uid
          name
          code
          district {
            uid
            name
            province {
              uid
              name
              country{
                uid
                name
              }
            }
          }
        }
      }
  }`;

export const SEARCH_CLIENTS = gql`
  query searchClients($queryString: String!) {
    clientSearch(queryString: $queryString){
        uid
        name
        code
        district {
          uid
          name
          province {
            uid
            name
            country{
              uid
              name
            }
          }
        }
    }
  }`;

export const GET_CLIENT_CONTACTS_BY_CLIENT_UID = gql`
  query getClientContactsByClientUid($clientUid: Int!) {
    clientContactByClientUid(clientUid: $clientUid){
      uid
      firstName
      lastName
      email
      mobilePhone
      consentSms
    }
  }`;


export const GET_CLIENT_BY_UID = gql`
  query getClientByUid($uid: Int!) {
    clientByUid(uid: $uid){
        uid
        name
        code
        district {
          uid
          name
          province {
            uid
            name
            country{
              uid
              name
            }
          }
        }
    }
  }`;
