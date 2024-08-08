import json
from datetime import datetime
from enum import StrEnum

from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.iol.meilisearch.client import MeiliSearchClient


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, StrEnum):
            return obj.value  # Serialize StrEnum to its value
        if isinstance(obj, datetime):
            return obj.isoformat()  # Serialize datetime to ISO format string
        return super().default(obj)


class MeilisearchSyncHandler:
    def __init__(self):
        self.client = MeiliSearchClient()
        self.tables_of_interest = {'sample', 'worksheet', "result"}

    def should_sync(self, table_name: str):
        return table_name in self.tables_of_interest

    @staticmethod
    def get_document(metadata):
        return marshaller(metadata)

    def on_event(self, event_type, table_name, tracked):
        if not self.should_sync(table_name):
            return

        doc = self.get_document(tracked)

        self.client.create_index(table_name)
        if event_type == 'after-insert':
            self.client.add_documents(table_name, [doc])
        elif event_type == 'after-update':
            self.client.update_documents(table_name, [doc])
        elif event_type == 'after-delete':
            self.client.delete_document(table_name, doc["uid"])
