import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_query(query=None, variables=None, headers=None):
    if not query:
        raise Exception("Query must be provided")

    request = requests.post(
        'http://127.0.0.1:8000/felicity-gql',
        json={'query': query, 'variables': variables} if query else {'query': self.query, 'variables': variables},
        headers=headers,
    )
    if request.status_code == 200:
        logger.info(request.json())
        return request.json()
    else:
        raise Exception(f"({request.status_code}): Query Failed: {request.text}")


def authenticate():
    qry = """
      mutation AuthenticateUser($username: String!, $password: String!) {
        authenticateUser(password: $password, username: $username) {
          token
          tokenType
        }
      }
    """
    variables = {
        'username': 'admin',
        'password': 'admin',
    }
    auth = run_query(query=qry, variables=variables)
    token = auth["data"]["authenticateUser"]['token']
    return {"Authorization": f"bearer {token}"}


def do_work(query: str = None, var_list: list= None):
    auth_headers = authenticate()

    for variables in var_list:
        run_query(query=query, variables=variables, headers=auth_headers)
