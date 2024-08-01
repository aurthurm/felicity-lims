from apps.common.utils.serializer import marshaller
from apps.iol.meilisearch.client import MeiliSearchClient


class MeilisearchSyncHandler:
    def __init__(self):
        self.client = MeiliSearchClient()
        self.tables_of_interest = {'sample', 'worksheet', "result"}

    def should_sync(self, table_name: str):
        return table_name in self.tables_of_interest

    @staticmethod
    def get_document(instance):
        return marshaller(instance)

    def on_event(self, event_type, table_name, tracked):
        if not self.should_sync(table_name):
            return

        document = self.get_document(tracked)

        self.client.create_index(table_name)
        if event_type == 'after-insert':
            self.client.add_documents(table_name, [document])
        elif event_type == 'after-update':
            self.client.update_documents(table_name, [document])
        elif event_type == 'after-delete':
            self.client.delete_document(table_name, document["uid"])
