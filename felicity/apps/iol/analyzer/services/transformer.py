# -*- coding: utf-8 -*-
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MessageTransformer:

    def _get_separators(self, raw_message: str) -> dict:
        """
        Detects and returns message separators dynamically for HL7 and ASTM messages.

        HL7:
            - Field separator is MSH-1 (4th character of MSH line)
            - Encoding characters (MSH-2) define:
                component separator (^), repeat separator (~),
                escape character (\), subcomponent separator (&)

        ASTM:
            - Usually first character after segment ID is field separator
            - Subsequent characters often define component and repeat separators
            - Subcomponents rarely used

        Args:
            raw_message (str): The raw HL7 or ASTM message string.

        Returns:
            dict: A dictionary containing:
                - field: Field separator (usually '|')
                - component: Component separator (usually '^')
                - repeat: Repeat separator (usually '~')
                - escape: Escape character (usually '\')
                - subcomponent: Subcomponent separator (usually '&')

        Notes:
            - Defaults are provided if separators cannot be detected.
            - Works dynamically for both HL7 (MSH present) and ASTM (H|P|O|R|A segments).
        """

        lines = [l.strip() for l in raw_message.strip().splitlines() if l.strip()]
        if not lines:
            # Defaults
            return {"field": "|", "component": "^", "repeat": "~", "escape": "\\", "subcomponent": "&"}

        first_line = lines[0]
        if first_line.startswith("MSH"):  # HL7
            f_sep = first_line[3]
            enc = first_line[4:8] if len(first_line) >= 8 else "^~\\&"
            return {
                "field": f_sep,
                "component": enc[0],
                "repeat": enc[1],
                "escape": enc[2],
                "subcomponent": enc[3],
            }
        else:  # ASTM
            # ASTM fields: first char after segment ID is separator, assume H|^& style
            f_sep = first_line[1] if len(first_line) > 1 else "|"
            enc = first_line[2:5] if len(first_line) >= 5 else "^&\\"
            return {
                "field": f_sep,
                "component": enc[0] if len(enc) > 0 else "^",
                "repeat": enc[1] if len(enc) > 1 else "~",
                "escape": enc[2] if len(enc) > 2 else "\\",
                "subcomponent": "&",  # ASTM rarely uses subcomponents
            }

    def parse_message(self, raw_message: str) -> dict:
        """
        Parses a raw HL7 or ASTM message into a structured JSON-friendly dictionary.

        Features:
            - Handles both HL7 and ASTM messages dynamically
            - Optional repeats: Only added if the field contains a repeat separator (~)
            or contains components/subcomponents (^, &)
            - Components: Only added if field contains component separator (^)
            - Subcomponents: Only added if component contains subcomponent separator (&)
            - Simple scalar fields are stored as {"raw": "value"} without unnecessary nesting
            - Handles HL7 MSH special case and ASTM segment IDs (H, P, O, R, A)

        JSON Structure Example:
        {
            "SEGMENT_ID": [
                {
                    "raw": "<full_segment_text>",
                    "fields": {
                        "1": {"raw": "value" OR {"raw": "value", "repeats": [...] }},
                        "2": ...
                    }
                }
            ]
        }

        Args:
            raw_message (str): The raw HL7 or ASTM message string.

        Returns:
            dict: Parsed message as a nested dictionary suitable for:
                - Field mapping
                - GUI drag-and-drop mapping tools
                - Downstream JSON transformations
                - Extracting patient/order/result fields

        Examples:
            hl7_msg = "OBX|1|NM|HIV^HIV^99ROC||Positive|IU/mL|..."
            parsed = parse_message_dynamic(hl7_msg)
            print(parsed["OBX"][0]["fields"]["3"]["repeats"][0]["components"]["1"]["raw"])
        """
        raw_message = raw_message.replace("\\r", "\r")

        sep = self._get_separators(raw_message)
        f_sep, c_sep, r_sep, s_sep = sep["field"], sep["component"], sep["repeat"], sep["subcomponent"]

        lines = [l.strip() for l in raw_message.strip().splitlines() if l.strip()]
        if not lines:
            return {}

        message = {}

        for line in lines:
            seg_name = line[:1] if line[0] in "HOPRA" else line[:3]  # ASTM usually 1 char, HL7 3 char
            fields = line.split(f_sep)

            seg_obj = {"raw": line, "fields": {}}

            for idx, field in enumerate(fields[1:], start=1):
                # Determine if we need a repeat structure
                need_repeat = r_sep in field or c_sep in field or s_sep in field
                if need_repeat:
                    field_dict = {"raw": field, "repeats": []}
                    repeats = field.split(r_sep) if r_sep in field else [field]

                    for repeat in repeats:
                        repeat_dict = {"raw": repeat}

                        # Determine if we need components
                        if c_sep in repeat or s_sep in repeat:
                            repeat_dict["components"] = {}
                            components = repeat.split(c_sep)
                            for c_idx, comp in enumerate(components, start=1):
                                # Determine if we need subcomponents
                                if s_sep in comp:
                                    comp_dict = {"raw": comp, "subcomponents": {}}
                                    subcomponents = comp.split(s_sep)
                                    for s_idx, sub in enumerate(subcomponents, start=1):
                                        comp_dict["subcomponents"][str(s_idx)] = sub
                                else:
                                    comp_dict = {"raw": comp}

                                repeat_dict["components"][str(c_idx)] = comp_dict

                        field_dict["repeats"].append(repeat_dict)

                else:
                    # Simple scalar field, just store raw
                    field_dict = {"raw": field}

                seg_obj["fields"][str(idx)] = field_dict

            message.setdefault(seg_name, []).append(seg_obj)

        return message
