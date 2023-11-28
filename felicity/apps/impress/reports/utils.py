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


def delete_from_nested(obj: dict, path: str):
    """
    Traverses a json/dict object tree and deletes the required value if exists
    :param obj: dict object to be traversed
    :param path: the paths to find the required value
    :return: None
    """
    print(f"cleaning up: {path}")
    
    if not obj:
        return
    if not path:
        return obj
    
    keys = path.split(".")
    key = keys.pop(0)
    value = obj.get(key)
    if len(keys) == 0:
        if isinstance(value, list):
            for item in value:
                delete_from_nested(item, ".".join(keys))
        else:
            del obj[key]
    else:
        if isinstance(value, list):
            for item in value:
                delete_from_nested(item, ".".join(keys))
        else:
            delete_from_nested(value, ".".join(keys))


def strtobool(val):
    """Convert a string representation of truth to true (1) or false (0).
    True values are 'y', 'yes', 't', 'true', 'on', and '1'; false values
    are 'n', 'no', 'f', 'false', 'off', and '0'.  Raises ValueError if
    'val' is anything else.
    """
    val = val.lower()
    if val in ("y", "yes", "t", "true", "on", "1"):
        return True
    elif val in ("n", "no", "f", "false", "off", "0"):
        return False
    else:
        raise ValueError("invalid truth value %r" % (val,))
