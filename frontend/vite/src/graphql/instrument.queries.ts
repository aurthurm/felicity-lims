import gql from 'graphql-tag';

export const GET_ALL_INSTRUMENTS = gql`
    query getAllInstruments {
        instrumentAll {
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
            description
            keyword
            supplier {
              uid
              name
            }
          }
    }
}`;



export const GET_ALL_METHODS = gql`
    query getAllMethods {
      methodAll {
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
          description
          keyword
        }
      }
  }`;
