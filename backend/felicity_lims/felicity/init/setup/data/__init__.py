import json


def json_from_file(filename: str):
    with open(f"{filename}.json") as json_file:
        data = json.load(json_file)
    return data


analysis_data = json_from_file("analysis")
clients_data = json_from_file("clients")
lab_data = json_from_file("lab")
setup_data = json_from_file("setup")
