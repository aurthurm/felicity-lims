add_user_mutation = """
  mutation AddUser(
      $firstName: String!,
      $lastName: String!,
      $email: String!,
      $userName: String!,
      $password: String!,
      $passwordc: String!,
      $openReg: Boolean
    ){
    createUser(
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      userName: $userName,
      password: $password,
      passwordc: $passwordc,
      openReg: $openReg,
    ) {
        ... on UserType {
            uid
            firstName
            lastName
        }
        ... on OperationError {
            error
        }
    }
}
"""

fetch_users = """
    query {
        userAll {
            items {
            
                userName
            }
        }
    }
"""


def make_username(val: str) -> str:
    return val.lower()


def make_password(val: str):
    return f"!{make_username(val).capitalize()}#100"
