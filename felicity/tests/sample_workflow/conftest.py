import logging

import pytest_asyncio
from faker import Faker
from sqlalchemy.ext.asyncio import create_async_engine

from core.config import settings

fake_engine = Faker()

engine = create_async_engine(settings.SQLALCHEMY_TEST_DATABASE_URI)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@pytest_asyncio.fixture(scope="function")
async def clients(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetClients{
                clientAll{
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['clientAll']['items']


@pytest_asyncio.fixture(scope="function")
async def client_contacts(app, auth_data, clients):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={
            "query": """
                query getClientContactsByClientUid($clientUid: String!) {
                    clientContactByClientUid(clientUid: $clientUid) {
                        uid
                    }
                }
            """,
            "variables": {
                "clientUid": clients[0]["uid"],
            },
        },
        headers=auth_data["headers"],
    )
    return response.json['data']['clientContactByClientUid']


@pytest_asyncio.fixture(scope="function")
async def sample_types(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetSampleTypes {
                sampleTypeAll {
                    uid
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['sampleTypeAll']


@pytest_asyncio.fixture(scope="function")
async def methods(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetMethods {
                methodAll {
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['methodAll']["items"]


@pytest_asyncio.fixture(scope="function")
async def instruments(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetInstruments {
                instrumentAll {
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['instrumentAll']["items"]


@pytest_asyncio.fixture(scope="function")
async def analyses(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetAnalyses {
                analysisAll {
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['analysisAll']["items"]


@pytest_asyncio.fixture(scope="function")
async def profiles(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetProfiles {
                profileAll {
                    uid
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['profileAll']


@pytest_asyncio.fixture(scope="function")
async def patients(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetPatients {
                patientAll {
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['patientAll']["items"]


@pytest_asyncio.fixture(scope="function")
async def users_db(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetUsers {
                userAll {
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['userAll']["items"]


@pytest_asyncio.fixture(scope="function")
async def ws_templates(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetWSTemplates {
                worksheetTemplateAll {
                    uid
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['worksheetTemplateAll']


@pytest_asyncio.fixture(scope="function")
async def worksheets(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetWS {
                worksheetAll {
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['worksheetAll']["items"]


@pytest_asyncio.fixture(scope="function")
async def jobs(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GeJobs {
                jobAll {
                    items {
                        uid
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['jobAll']["items"]


@pytest_asyncio.fixture(scope="function")
async def samples(app, auth_data):
    _, response = await app.asgi_client.post(
        "felicity-gql",
        json={"query": """
            query GetResults {
                sampleAll {
                    items {
                        uid
                        status
                        analysisResults {
                            uid
                            result
                            status
                        }
                    }
                }
            }
        """},
        headers=auth_data["headers"],
    )
    return response.json['data']['sampleAll']["items"]
