from datetime import datetime

import meilisearch


class MeiliSearchClient:
    def __init__(self, host: str = 'http://127.0.0.1:7700', api_key: str = None):
        self.client = meilisearch.Client(host, api_key)

    def create_index(self, index_name: str, primary_key: str = None):
        return self.client.create_index(uid=index_name, primary_key=primary_key)

    def add_documents(self, index_name: str, documents: list):
        index = self.client.index(index_name)
        return index.add_documents(documents)

    def update_documents(self, index_name: str, documents: list):
        index = self.client.index(index_name)
        return index.update_documents(documents)

    def delete_document(self, index_name: str, document_id: str):
        index = self.client.index(index_name)
        return index.delete_document(document_id)

    def search(self, index_name: str, query: str, filters: dict = None, date_field: str = None,
               date_gt: datetime = None, date_lt: datetime = None):
        index = self.client.index(index_name)

        # Build the filter string
        filter_conditions = []
        if filters:
            for field, value in filters.items():
                filter_conditions.append(f"{field} = '{value}'")

        if date_field:
            if date_gt:
                filter_conditions.append(f"{date_field} > {date_gt.timestamp()}")
            if date_lt:
                filter_conditions.append(f"{date_field} < {date_lt.timestamp()}")

        # Combine filters
        filter_string = " AND ".join(filter_conditions) if filter_conditions else None

        options = {"filter": filter_string} if filter_string else {}

        return index.search(query, options)

    def delete_index(self, index_name: str):
        return self.client.delete_index(index_name)

    def list_indexes(self):
        return self.client.get_indexes()


# Example usage
if __name__ == "__main__":
    client = MeiliSearchClient(api_key='your_api_key')

    # Create index
    client.create_index('products', primary_key='id')

    # Add documents
    documents = [
        {'id': 1, 'name': 'Product 1', 'description': 'A cool product', 'created_at': 1625190000},
        {'id': 2, 'name': 'Product 2', 'description': 'Another cool product', 'created_at': 1625290000}
    ]
    client.add_documents('products', documents)

    # Search with filters and date range
    filters = {'name': 'Product 1'}
    date_gt = datetime(2021, 7, 1)
    date_lt = datetime(2021, 7, 5)
    results = client.search('products', 'cool', filters=filters, date_field='created_at', date_gt=date_gt,
                            date_lt=date_lt)
    print(results)
