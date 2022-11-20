from faker import Faker
import random
import logging
from typing import List

from felicity.tests.utils.patient import add_patient_query

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = Faker()

add_ar_query = """
mutation AddAnalysisRequest ($payload: AnalysisRequestInputType!) {
  createAnalysisRequest(payload: $payload) {
      ... on AnalysisRequestWithSamples {
        uid
      }
      ... on OperationError {
          error
      }
  }
}
"""


def gen_sample():
    randoms = [
        {
            "sampletypes": [2, 3],
            "analyses": [None, 1, 2, 3],
            "profiles": [None, 1, 2],
        },
        {
            "sampletypes": [4],
            "analyses": [3],
            "profiles": [None],
        },
    ]

    while True:
        selected = random.choice(randoms)
        s_typ = random.choice(selected.get("sampletypes"))
        anal = random.choice(selected.get("analyses"))
        prof = random.choice(selected.get("profiles"))

        if anal or prof:
            break

    return {
        "sampleType": s_typ,
        "profiles": [prof] if prof else [],
        "analyses": [anal] if anal else []
    }


ar_variables = [  # list of lists - each list will be run in its own thread -> simulating multi-user regs
    [
        {
            "payload": {
                "clientRequestId": engine.ssn(),
                "clientUid": random.randint(1, 1500),
                "clientContactUid": 1,
                "patientUid": random.randint(1, 210196),
                "priority": random.choice([0, 2]),
                "samples": [gen_sample() for _x in range(random.randint(1, 2))],
            }
        } for i in range(10)
    ] for x in range(1)
]


# def do_work1(var_list):
#     auth_headers = authenticate()
#
#     for variables in var_list:
#         run_query(query=add_patient_query, variables=variables, headers=auth_headers)
#

def start_ar_reg():
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
        future_to_url = (executor.submit(do_work, add_ar_query, variables) for variables in ar_variables)

        for future in concurrent.futures.as_completed(future_to_url):
            try:
                data = future.result()
                logger.info("Done")
            except Exception as exc:
                logger.error(exc)


# start_ar_reg(users_usernames)


# Bundled Work registrations for both patient and sample

def do_work_bundle(query: str = None, var_list: list = None, usernames: List[str] = None):
    # time.sleep(randint(1,5))

    username = random.choice(usernames)
    credentials = {
        'username': username,
        'password': 'admin' if username == "admin" else "password",
    }
    auth_headers = authenticate(credentials)

    for variables in var_list:
        # time.sleep(randint(1, 10))
        pt_reg = run_query(query=query, variables=variables, headers=auth_headers)

        logger.info(f"Created patient: {pt_reg}")
        # add analysis request for created patient
        _ar_variables = {
            "payload": {
                "clientRequestId": engine.ssn(),
                "clientUid": random.randint(1, 1500),
                "clientContactUid": 1,
                "patientUid": pt_reg['data']['createPatient']['uid'],
                "priority": random.choice([0, 2]),
                "samples": [gen_sample() for _x in range(random.randint(1, 2))],
            }
        }
        run_query(query=add_ar_query, variables=_ar_variables, headers=auth_headers)


def bundle_reg(usernames: List[str]):
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_url = (executor.submit(do_work_bundle, add_patient_query, variables, usernames) for variables in
                         patient_variables)

        for future in concurrent.futures.as_completed(future_to_url):
            try:
                data = future.result()
                logger.info("Done")
            except Exception as exc:
                logger.error(exc)

# bundle_reg(users_usernames[:12])
