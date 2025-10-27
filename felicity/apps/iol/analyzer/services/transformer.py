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

    def _navigate_parsed_message(
        self, parsed_message: dict, segment_id: str, field: int, repeat: int = 0,
        component: int | None = None, subcomponent: int | None = None
    ) -> str | None:
        """
        Navigate parsed message structure using segment/field/repeat/component/subcomponent hierarchy.

        Args:
            parsed_message (dict): Parsed message from parse_message()
            segment_id (str): Segment ID (e.g., "OBX", "OBR")
            field (int): Field number (1-indexed)
            repeat (int): Repeat index (0-indexed), defaults to first repeat
            component (int): Component number (1-indexed), optional
            subcomponent (int): Subcomponent number (1-indexed), optional

        Returns:
            str | None: Extracted value or None if path not found
        """
        try:
            # Get segment
            if segment_id not in parsed_message:
                return None

            segments = parsed_message[segment_id]
            if not segments or len(segments) == 0:
                return None

            segment = segments[0]  # Use first segment occurrence
            if "fields" not in segment:
                return None

            field_key = str(field)
            if field_key not in segment["fields"]:
                return None

            field_data = segment["fields"][field_key]

            # Handle simple scalar field
            if "repeats" not in field_data:
                return field_data.get("raw")

            # Handle repeats
            repeats = field_data.get("repeats", [])
            if repeat >= len(repeats):
                return None

            repeat_data = repeats[repeat]

            # No component requested, return repeat raw
            if component is None:
                return repeat_data.get("raw")

            # Handle components
            if "components" not in repeat_data:
                return repeat_data.get("raw")

            components = repeat_data["components"]
            comp_key = str(component)
            if comp_key not in components:
                return None

            comp_data = components[comp_key]

            # No subcomponent requested, return component raw
            if subcomponent is None:
                return comp_data.get("raw")

            # Handle subcomponents
            if "subcomponents" not in comp_data:
                return comp_data.get("raw")

            subcomponents = comp_data["subcomponents"]
            subcomp_key = str(subcomponent)
            if subcomp_key not in subcomponents:
                return None

            return subcomponents[subcomp_key]

        except (KeyError, IndexError, TypeError) as e:
            logger.warning(f"Error navigating parsed message: {e}")
            return None

    def extract_fields(
        self, parsed_message: dict, driver: dict
    ) -> dict:
        """
        Extract required fields from parsed message using driver mappings.

        The driver defines how to navigate the parsed message structure to extract:
        - sample_id: Unique sample identifier
        - test_code: Test/analysis code (per result segment)
        - test_keyword: Optional test keyword/description
        - result: Test result value
        - unit: Unit of measurement
        - date_tested: Date test was performed
        - tester_name: Name of person who performed test
        - is_final_marker: Configuration for final result marker

        Driver format example:
        {
            "sample_id": {
                "segment": "PID",
                "field": 3,
                "component": 1
            },
            "test_code": {
                "segment": "OBX",
                "field": 3,
                "component": 1
            },
            "result": {
                "segment": "OBX",
                "field": 5
            },
            "unit": {
                "segment": "OBX",
                "field": 6,
                "optional": true
            },
            "date_tested": {
                "segment": "OBX",
                "field": 14
            },
            "tester_name": {
                "segment": "OBX",
                "field": 16,
                "optional": true
            },
            "is_final_marker": {
                "segment": "OBX",
                "field": 11,
                "final_value": "F"
            }
        }

        Args:
            parsed_message (dict): Parsed message from parse_message()
            driver (dict): Driver mapping configuration

        Returns:
            dict: Extracted fields with structure:
                {
                    "sample_id": "12345",
                    "results": [
                        {
                            "test_code": "HIV",
                            "result": "Positive",
                            "unit": "IU/mL",
                            "date_tested": "2025-10-27",
                            "tester_name": "John Doe",
                            "is_final": true
                        },
                        ...
                    ]
                }
        """
        if not driver:
            logger.error("Driver mapping is None or empty")
            return {"sample_id": None, "results": []}

        if not isinstance(driver, dict):
            logger.error(f"Driver must be a dict, got {type(driver)}")
            return {"sample_id": None, "results": []}

        try:
            # Extract sample_id (typically once from first segment)
            sample_id = None
            if "sample_id" in driver:
                sample_id_config = driver["sample_id"]
                sample_id = self._navigate_parsed_message(
                    parsed_message,
                    sample_id_config.get("segment"),
                    sample_id_config.get("field"),
                    sample_id_config.get("repeat", 0),
                    sample_id_config.get("component"),
                    sample_id_config.get("subcomponent"),
                )

            # Extract multiple results from result segments (typically OBX)
            results = []
            result_segment_id = driver.get("result", {}).get("segment", "OBX")

            if result_segment_id in parsed_message:
                result_segments = parsed_message[result_segment_id]

                for segment_idx, segment in enumerate(result_segments):
                    result_obj = {}

                    # Extract test_code (required per result segment)
                    if "test_code" in driver:
                        test_code_config = driver["test_code"]
                        test_code = self._navigate_parsed_message(
                            {result_segment_id: [segment]},
                            result_segment_id,
                            test_code_config.get("field"),
                            test_code_config.get("repeat", 0),
                            test_code_config.get("component"),
                            test_code_config.get("subcomponent"),
                        )
                        result_obj["test_code"] = test_code

                    # Extract test_keyword (optional)
                    if "test_keyword" in driver:
                        keyword_config = driver["test_keyword"]
                        keyword = self._navigate_parsed_message(
                            {result_segment_id: [segment]},
                            result_segment_id,
                            keyword_config.get("field"),
                            keyword_config.get("repeat", 0),
                            keyword_config.get("component"),
                            keyword_config.get("subcomponent"),
                        )
                        if keyword:
                            result_obj["test_keyword"] = keyword

                    # Extract result value
                    if "result" in driver:
                        result_config = driver["result"]
                        result_value = self._navigate_parsed_message(
                            {result_segment_id: [segment]},
                            result_segment_id,
                            result_config.get("field"),
                            result_config.get("repeat", 0),
                            result_config.get("component"),
                            result_config.get("subcomponent"),
                        )
                        result_obj["result"] = result_value

                    # Extract unit (optional)
                    if "unit" in driver:
                        unit_config = driver["unit"]
                        unit = self._navigate_parsed_message(
                            {result_segment_id: [segment]},
                            result_segment_id,
                            unit_config.get("field"),
                            unit_config.get("repeat", 0),
                            unit_config.get("component"),
                            unit_config.get("subcomponent"),
                        )
                        result_obj["unit"] = unit if unit else None

                    # Extract date_tested
                    if "date_tested" in driver:
                        date_config = driver["date_tested"]
                        date_tested = self._navigate_parsed_message(
                            {result_segment_id: [segment]},
                            result_segment_id,
                            date_config.get("field"),
                            date_config.get("repeat", 0),
                            date_config.get("component"),
                            date_config.get("subcomponent"),
                        )
                        result_obj["date_tested"] = date_tested

                    # Extract tester_name (optional)
                    if "tester_name" in driver:
                        tester_config = driver["tester_name"]
                        tester_name = self._navigate_parsed_message(
                            {result_segment_id: [segment]},
                            result_segment_id,
                            tester_config.get("field"),
                            tester_config.get("repeat", 0),
                            tester_config.get("component"),
                            tester_config.get("subcomponent"),
                        )
                        if tester_name:
                            result_obj["tester_name"] = tester_name

                    # Extract is_final marker
                    if "is_final_marker" in driver:
                        marker_config = driver["is_final_marker"]
                        marker_value = self._navigate_parsed_message(
                            {result_segment_id: [segment]},
                            result_segment_id,
                            marker_config.get("field"),
                            marker_config.get("repeat", 0),
                            marker_config.get("component"),
                            marker_config.get("subcomponent"),
                        )
                        final_value = marker_config.get("final_value", "F")
                        result_obj["is_final"] = marker_value == final_value if marker_value else False

                    results.append(result_obj)

            return {"sample_id": sample_id, "results": results}

        except Exception as e:
            logger.error(f"Error extracting fields with driver: {e}", exc_info=True)
            return {"sample_id": None, "results": []}

    async def get_driver(
        self, laboratory_instrument_uid: str,
        lab_instrument_service=None, instrument_service=None
    ) -> dict | None:
        """
        Get the JSON driver for a laboratory instrument with fallback logic.

        Retrieves the driver mapping with the following priority:
        1. Laboratory instrument-specific driver (lab-specific override)
        2. Generic instrument driver (fallback)
        3. None if neither exists

        This allows users to have:
        - A generic driver defined once at the instrument level
        - Optional lab-specific overrides for custom configurations

        Args:
            laboratory_instrument_uid (str): UID of the laboratory instrument
            lab_instrument_service: LaboratoryInstrumentService instance (injected dependency)
            instrument_service: InstrumentService instance (injected dependency)

        Returns:
            dict | None: Driver mapping dictionary, or None if not found

        Raises:
            ValueError: If required services are not provided
        """
        if not lab_instrument_service or not instrument_service:
            logger.error("Required services (lab_instrument_service, instrument_service) not provided")
            return None

        try:
            # Fetch laboratory instrument
            lab_instrument = await lab_instrument_service.get(laboratory_instrument_uid)
            if not lab_instrument:
                logger.warning(f"Laboratory instrument {laboratory_instrument_uid} not found")
                return None

            # Check for lab-specific driver override
            if lab_instrument.driver_mapping:
                logger.info(f"Using lab-specific driver for {laboratory_instrument_uid}")
                return lab_instrument.driver_mapping

            # Fallback to generic instrument driver
            if not hasattr(lab_instrument, "instrument_uid") or not lab_instrument.instrument_uid:
                logger.warning(f"Laboratory instrument {laboratory_instrument_uid} has no associated instrument")
                return None

            instrument = await instrument_service.get(lab_instrument.instrument_uid)
            if not instrument or not instrument.driver_mapping:
                logger.warning(f"No driver found for instrument {lab_instrument.instrument_uid}")
                return None

            logger.info(f"Using generic driver for instrument {lab_instrument.instrument_uid}")
            return instrument.driver_mapping

        except Exception as e:
            logger.error(f"Error retrieving driver for {laboratory_instrument_uid}: {e}", exc_info=True)
            return None

    async def transform_message(
        self, raw_message: str, laboratory_instrument_uid: str,
        lab_instrument_service=None, instrument_service=None
    ) -> dict:
        """
        Transform a raw ASTM/HL7 message to extracted JSON result using driver mappings.

        This is the complete end-to-end pipeline:
        1. Get the driver for the instrument (with fallback logic)
        2. Parse the raw message into structured JSON
        3. Extract required fields based on driver mappings
        4. Return transformed result

        Args:
            raw_message (str): Raw ASTM/HL7 message string
            laboratory_instrument_uid (str): UID of the laboratory instrument that received the message
            lab_instrument_service: LaboratoryInstrumentService instance (injected dependency)
            instrument_service: InstrumentService instance (injected dependency)

        Returns:
            dict: Transformed result with structure:
                {
                    "success": bool,
                    "error": str | None,
                    "sample_id": str | None,
                    "results": [
                        {
                            "test_code": str,
                            "result": str,
                            "unit": str | None,
                            "date_tested": str | None,
                            "tester_name": str | None,
                            "is_final": bool
                        },
                        ...
                    ],
                    "parsed_message": dict  # Full parsed structure for debugging
                }

        Raises:
            No exceptions - all errors are caught and returned in response dict
        """
        result = {
            "success": False,
            "error": None,
            "sample_id": None,
            "results": [],
            "parsed_message": {}
        }

        try:
            # Validate inputs
            if not raw_message or not raw_message.strip():
                result["error"] = "Raw message is empty"
                logger.error(result["error"])
                return result

            if not laboratory_instrument_uid:
                result["error"] = "Laboratory instrument UID is required"
                logger.error(result["error"])
                return result

            # Step 1: Get driver with fallback logic
            driver = await self.get_driver(
                laboratory_instrument_uid,
                lab_instrument_service=lab_instrument_service,
                instrument_service=instrument_service
            )

            if not driver:
                result["error"] = f"No driver found for laboratory instrument {laboratory_instrument_uid}"
                logger.error(result["error"])
                return result

            # Step 2: Parse raw message
            try:
                parsed_message = self.parse_message(raw_message)
                result["parsed_message"] = parsed_message
                logger.debug(f"Successfully parsed message with {len(parsed_message)} segments")
            except Exception as parse_error:
                result["error"] = f"Failed to parse message: {str(parse_error)}"
                logger.error(result["error"], exc_info=True)
                return result

            # Step 3: Extract fields using driver
            try:
                extracted = self.extract_fields(parsed_message, driver)
                result["sample_id"] = extracted.get("sample_id")
                result["results"] = extracted.get("results", [])
                result["success"] = True
                logger.info(f"Successfully transformed message: sample_id={result['sample_id']}, "
                           f"{len(result['results'])} results extracted")
            except Exception as extract_error:
                result["error"] = f"Failed to extract fields: {str(extract_error)}"
                logger.error(result["error"], exc_info=True)
                return result

            return result

        except Exception as e:
            result["error"] = f"Unexpected error during transformation: {str(e)}"
            logger.error(result["error"], exc_info=True)
            return result
