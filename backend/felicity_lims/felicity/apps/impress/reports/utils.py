def get_from_nested(obj: dict, path: str):
    """
    Traversed a json/dict object tree and returns the required value if exists
    :param obj: dict object to be traversed
    :param path: the paths to find the required value
    :return: Its return the required value
    """
    if not obj:
        return ""
    keys = path.split(".")
    key = keys.pop(0)
    value = obj.get(key)
    if len(keys) == 0:
        return value
    else:
        return get_from_nested(value, ".".join(keys))
