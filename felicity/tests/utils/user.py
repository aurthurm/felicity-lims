add_user_mutation = """
  mutation AddUser(
      $firstName: String!,
      $lastName: String!,
      $email: String!,
      $openReg: Boolean
    ){
    createUser(
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
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

add_auth_mutation = """
  mutation AddUserAuth(
      $userUid: str!,
      $userName: String!,
      $password: String!,
      $passwordc: String!
    ){
    createUserAuth(
      userUid: $userUid,
      userName: $userName,
      password: $password,
      passwordc: $passwordc,
    ) {
        ... on UserType {
            uid
            auth {
                userName
            }
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
            auth {
                userName
            }
            }
        }
    }
"""


def make_username(val: str) -> str:
    return val.lower()


def make_password(val: str):
    return f"!{make_username(val).capitalize()}#100"
