add_client_query = """
  mutation AddClient($payload: ClientInputType!){
      createClient(payload: $payload) {
        __typename
        ... on ClientType {
          uid
          name
          code
          email
          phoneMobile
          phoneBusiness
          active
        }
        ... on OperationError {
          error
          suggestion
        }
      }
    }
"""
