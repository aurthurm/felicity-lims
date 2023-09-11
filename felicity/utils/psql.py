async def psql_records_to_dict(records, many=False):
    """Converts a database record(s) to dict
    database usually return a databases.backends.postgres.Record
    or if you access the ._row key you get the  asyncpg.Record
    """
    if not records:
        return records
    if not many:
        return dict(records)
    return [dict(record) for record in records]
