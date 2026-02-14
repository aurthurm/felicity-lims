import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_user_mutation = """
    mutation Auth($username: String!, $password: String!){
      authenticateUser(username: $username, password: $password) {
        ... on AuthenticatedData {
            user {
                uid
                firstName
                lastName
            }
            token
            refresh
            tokenType
            laboratories {
                uid
                name
            }
            activeLaboratory {
                uid
                name
            }
        }
        ... on OperationError {
            error
        }
      }
    }
"""

add_user_mutation = """
  mutation AddUser(
      $firstName: String!,
      $lastName: String!,
      $email: String!,
      $userName: String!,
      $password: String!,
      $passwordc: String!,
      $activeLaboratoryUid: String,
      $laboratoryUids: [String!],
      $groupUid: String,
      $openReg: Boolean
    ){
    createUser(
      firstName: $firstName,
      lastName: $lastName,
      email: $email,
      userName: $userName,
      password: $password,
      passwordc: $passwordc,
      activeLaboratoryUid: $activeLaboratoryUid,
      laboratoryUids: $laboratoryUids,
      groupUid: $groupUid,
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


def extract_auth(auth_data: dict):
    logger.info(f"to_auth_headers ::: auth_data:  {auth_data}")
    # Build headers with auth token and laboratory context
    headers = {"Authorization": f"Bearer {auth_data['token']}"}

    # If user has an active laboratory, add it to headers for tenant context
    active_lab = auth_data.get("activeLaboratory")
    if active_lab and active_lab.get("uid"):
        headers["X-Laboratory-ID"] = active_lab["uid"]

    return {
        "token": auth_data["token"],
        "refresh": auth_data.get("refresh"),
        "tokenType": auth_data.get("tokenType", "bearer"),
        "laboratories": auth_data.get("laboratories", []),
        "activeLaboratory": active_lab,
        "headers": headers,
    }


def auth_to_headers(auth_data: dict):
    auth_metadata = extract_auth(auth_data)
    return auth_metadata.get("headers")
