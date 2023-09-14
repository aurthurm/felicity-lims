import logging
import random

import pytest
from faker import Faker

from apps.patient.conf import genders

fake_engine = Faker()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

add_patient_query = """
  mutation AddPatient($payload: PatientInputType!){
  createPatient(payload: $payload) {
    ... on PatientType {
        uid
        clientPatientId
        firstName
        lastName
        age
        gender
        dateOfBirth
        clientUid
        phoneMobile
        consentSms
    }
    ... on OperationError {
        error
    }
  }
}
"""


@pytest.mark.asyncio
@pytest.mark.order(30)
async def test_register_patient(app, auth_data, clients):
    patient = {
        "clientPatientId": fake_engine.ssn(),
        "firstName": fake_engine.first_name(),
        "middleName": fake_engine.first_name(),
        "lastName": fake_engine.last_name(),
        "age": random.randint(1, 90),
        "gender": random.choice(
            [genders.MALE, genders.FEMALE, genders.TRANS_GENDER, genders.MISSING]
        ),
        "dateOfBirth": str(fake_engine.date_time()),
        "ageDobEstimated": fake_engine.boolean(),
        "clientUid": clients[0]["uid"],  # cl_data[0]["uid"],
        "phoneMobile": fake_engine.phone_number(),
        "phoneHome": fake_engine.phone_number(),
        "consentSms": fake_engine.boolean(),
    }

    _, response = await app.asgi_client.post(
        "/felicity-gql",
        json={"query": add_patient_query, "variables": {"payload": patient}},
        headers=auth_data["headers"],
    )

    logger.info(f"register_patient response: {response} {response.json}")

    assert response.status_code == 200
    _patient = response.json["data"]["createPatient"]
    assert _patient["uid"] is not None
    assert _patient["clientPatientId"] == patient["clientPatientId"]
    assert _patient["firstName"] == patient["firstName"]
    assert _patient["lastName"] == patient["lastName"]
    assert _patient["age"] == patient["age"]
    assert _patient["gender"] == patient["gender"]
    # assert _patient["dateOfBirth"][:10] == patient["dateOfBirth"][:10]
    assert _patient["clientUid"] == patient["clientUid"]
    assert _patient["phoneMobile"] == patient["phoneMobile"]
    assert _patient["consentSms"] == patient["consentSms"]
