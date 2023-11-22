import copy

from apps.worksheet import models
from .conf import worksheet_types


class WorkSheetPlater:
    """
     Deprecated
     WorkSheet Plate Filler / WorkSheetTemplate creator
     100% Grid Compatible

        A    B    C
     ---------------------------
    1 | A1 | B1 | C1 | ...
       --   --   --
    2 | A2 | B2 | C2 | ...
       --   --   --

     plate = {
         1: {
             'row': 'A',
             'col': 1,
             'name': 'sample/low-pos/blank',
             'sample_uid': 'sample uid',
         },
         ...
     }
    """

    letters = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    template: dict = {}

    def __init__(
            self,
            reserved: dict,
            n_samples: int,
            t_type: int = worksheet_types.FLAT,
            rows: int = None,
            cols: int = None,
            row_wise: bool = True,
    ):
        self.reserved_positions = reserved
        self.number_of_samples = n_samples
        self.template_type = t_type
        self.rows = rows
        self.cols = cols
        self.row_wise = row_wise

    def count_reserved(self):
        return len(self.reserved_positions)

    def all_keys(self):
        plate_count = self.number_of_samples + self.count_reserved()
        return list(range(1, plate_count + 1))

    def remove_reserved_keys(self):
        keys = self.all_keys()
        for k in self.reserved_positions.keys():
            if k in keys:
                keys.remove(k)
        return keys

    def create(self):
        keys = self.remove_reserved_keys()
        for key in keys:
            self.template[key] = {
                "row": None,
                "col": 1,
                "name": "sample/dc/blank",
                "result_uid": "result uid",
            }

        # Add Samples Here
        # self.add_samples()

        for k, v in self.reserved_positions.items():
            self.template[int(k)] = v

        if self.template_type == worksheet_types.GRID:
            self.make_grid_ready()

        return self._sorted()

    def _sorted(self):
        return dict(sorted(self.template.items()))

    def get_cols(self):
        return self.letters[: self.cols]

    def get_rows(self):
        return list(range(1, self.rows + 1))

    def make_grid_ready(self):
        if not self.rows or not self.cols:
            raise Exception("Rows and Cols cannot be None or Zero")

        across = self.get_rows()
        down = self.get_cols()

        index = 1
        if self.row_wise:
            for _r in across:
                for _c in down:
                    self.assign_grid(index, row=_r, col=_c)
                    index += 1
        else:
            for _r in down:
                for _c in across:
                    self.assign_grid(index, row=_c, col=_r)
                    index += 1

    def assign_grid(self, index, col, row):
        self.template[index]["row"] = row
        self.template[index]["col"] = col


def add_samples(template: dict, samples, reserved: list):
    temp = copy.deepcopy(template)
    # sort samples by uid or sample_id
    sorted_samples = samples.sort()
    for c, val in enumerate(sorted_samples):
        if c not in reserved:
            temp[c] = val
    return temp


def create_plate_template(uid: str, model: str):
    item_model = None
    if model == "wst":
        item_model = models.WorkSheetTemplate.get(uid=uid)
    if model == "ws":
        item_model = models.WorkSheet.get(uid=uid)

    # get plate_template values
    plate_values = item_model.plate_values()

    # create a template
    factory = WorkSheetPlater(**plate_values)
    template = factory.create()
    return template
