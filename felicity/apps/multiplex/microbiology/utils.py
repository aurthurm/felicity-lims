import logging

from felicity.apps.multiplex.microbiology.entities import AbxASTResult, AbxBreakpoint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def interpret_ast(break_point: AbxBreakpoint, ast_result: AbxASTResult) -> dict | None:
    try:
        result_value = float(ast_result.ast_value)
    except (ValueError, TypeError):
        result_value = None

    # Return None if result_value is invalid or empty
    if result_value is None:
        return None

    # Ensure that at least one of the breakpoints (S or R) is provided when I is missing
    if not break_point.i and not (break_point.s or break_point.r):
        return None

    # If the result is a string, assume user provides 'I', 'R', or 'S'
    if isinstance(result_value, str):
        result_value = result_value.strip().lower()  # Handle extra spaces and case insensitivity
        if result_value.startswith("r"):
            return {'interpreted': "R", "breakpoint_uid": break_point.uid, "user_provided": True}
        if result_value.startswith("s"):
            return {'interpreted': "S", "breakpoint_uid": break_point.uid, "user_provided": True}
        return {'interpreted': "I", "breakpoint_uid": break_point.uid, "user_provided": True}

    if "disc" in ast_result.ast_method.name.lower():
        # Check for Susceptible (S) first
        if break_point.s:
            try:
                if result_value >= float(break_point.s):
                    return {'interpreted': "S", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert s breakpoint value to float: {e}")

        # Check for Resistant (R) next
        if break_point.r:
            try:
                if result_value <= float(break_point.r):
                    return {'interpreted': "R", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert r breakpoint value to float: {e}")

        # Check for Intermediate (I) if S and R don't match or are not provided
        if break_point.i and '-' in break_point.i:
            try:
                i_min, i_max = map(float, break_point.i.split('-'))
                if i_min <= result_value <= i_max:
                    return {'interpreted': "I", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert i breakpoint value to float: {e}")

        # If S and R are provided and I is not, check for intermediate between R and S
        if break_point.s and break_point.r:
            try:
                if float(break_point.r) < result_value < float(break_point.s):
                    return {'interpreted': "I", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert s/r breakpoint values to float: {e}")

    if "mic" in ast_result.ast_method.name.lower():
        # Check for Susceptible (S) first
        if break_point.s:
            try:
                if result_value <= float(break_point.s):
                    return {'interpreted': "S", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert s breakpoint value to float: {e}")

        # Check for Resistant (R) next
        if break_point.r:
            try:
                if result_value >= float(break_point.r):
                    return {'interpreted': "R", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert r breakpoint value to float: {e}")

        # Check for Intermediate (I) next
        if break_point.i and '-' not in break_point.i:
            try:
                if result_value == float(break_point.i):
                    return {'interpreted': "I", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert r breakpoint value to float: {e}")

        # If S and R are provided and I is not, check for intermediate between R and S
        if break_point.s and break_point.r:
            try:
                if float(break_point.s) < result_value < float(break_point.r):
                    return {'interpreted': "I", "breakpoint_uid": break_point.uid, "user_provided": False}
            except (ValueError, TypeError) as e:
                logger.error(f"failed to convert s/r breakpoint values to float: {e}")

    # If no interpretation could be made, return None
    return None
