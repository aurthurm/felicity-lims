import logging
from datetime import datetime
from typing import List, Optional, Dict, Any

from cachetools import TTLCache, cached

from felicity.apps.abstract.service import BaseService
from felicity.apps.analysis.entities.analysis import Analysis, Sample
from felicity.apps.analysis.entities.results import AnalysisResult
from felicity.apps.analysis.enum import ResultState
from felicity.apps.analysis.schemas import (AnalysisResultCreate,
                                            AnalysisResultUpdate)
from felicity.apps.analysis.services.result import AnalysisResultService
from felicity.apps.common.utils.serializer import marshaller
from felicity.apps.reflex.entities import ReflexRule, ReflexBrainAddition, ReflexBrainFinal, ReflexBrainCriteria, \
    ComplexCondition, ReflexBrain, ReflexAction
from felicity.apps.reflex.repository import (ReflexActionRepository,
                                             ReflexBrainAdditionRepository,
                                             ReflexBrainCriteriaRepository,
                                             ReflexBrainFinalRepository,
                                             ReflexBrainRepository,
                                             ReflexRuleRepository,
                                             ComplexConditionRepository)
from felicity.apps.reflex.schemas import (ReflexActionCreate,
                                          ReflexActionUpdate,
                                          ReflexBrainAdditionCreate,
                                          ReflexBrainAdditionUpdate,
                                          ReflexBrainCreate,
                                          ReflexBrainCriteriaCreate,
                                          ReflexBrainCriteriaUpdate,
                                          ReflexBrainFinalCreate,
                                          ReflexBrainFinalUpdate,
                                          ReflexBrainUpdate,
                                          ReflexRuleCreate,
                                          ReflexRuleUpdate,
                                          ComplexConditionCreate,
                                          ComplexConditionUpdate)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cache for storing reflex actions
reflex_action_cache = TTLCache(maxsize=1000, ttl=3600)  # 1 hour TTL


class ReflexRuleService(BaseService[ReflexRule, ReflexRuleCreate, ReflexRuleUpdate]):
    def __init__(self):
        super().__init__(ReflexRuleRepository)

    async def get_active_rules(self):
        """Retrieve all active reflex rules"""
        return await self.repository.get_active_rules()


class ReflexBrainAdditionService(
    BaseService[
        ReflexBrainAddition, ReflexBrainAdditionCreate, ReflexBrainAdditionUpdate
    ]
):
    def __init__(self):
        super().__init__(ReflexBrainAdditionRepository)

    async def get_by_conditions(self, conditions: Dict[str, Any]):
        """Retrieve additions based on specific conditions"""
        return await self.repository.get_by_conditions(conditions)


class ReflexBrainFinalService(
    BaseService[ReflexBrainFinal, ReflexBrainFinalCreate, ReflexBrainFinalUpdate]
):
    def __init__(self):
        super().__init__(ReflexBrainFinalRepository)

    async def get_by_conditions(self, conditions: Dict[str, Any]):
        """Retrieve final results based on specific conditions"""
        return await self.repository.get_by_conditions(conditions)


class ReflexBrainCriteriaService(
    BaseService[
        ReflexBrainCriteria, ReflexBrainCriteriaCreate, ReflexBrainCriteriaUpdate
    ]
):
    def __init__(self):
        super().__init__(ReflexBrainCriteriaRepository)

    async def get_by_custom_logic(self, custom_logic: str):
        """Retrieve criteria based on custom logic"""
        return await self.repository.get_by_custom_logic(custom_logic)


class ComplexConditionService(
    BaseService[ComplexCondition, ComplexConditionCreate, ComplexConditionUpdate]
):
    def __init__(self):
        super().__init__(ComplexConditionRepository)

    async def get_by_condition_type(self, condition_type: str):
        """Retrieve complex conditions by condition type"""
        return await self.repository.get_by_condition_type(condition_type)


class ReflexBrainService(
    BaseService[ReflexBrain, ReflexBrainCreate, ReflexBrainUpdate]
):
    def __init__(self):
        super().__init__(ReflexBrainRepository)

    async def get_with_complex_conditions(self):
        """Retrieve reflex brains with their associated complex conditions"""
        return await self.repository.get_with_complex_conditions()


class ReflexActionService(
    BaseService[ReflexAction, ReflexActionCreate, ReflexActionUpdate]
):
    def __init__(self):
        super().__init__(ReflexActionRepository)

    async def get_by_execution_order(self):
        """Retrieve reflex actions ordered by execution order"""
        return await self.repository.get_by_execution_order()

    async def get_with_custom_logic(self):
        """Retrieve reflex actions with custom logic"""
        return await self.repository.get_with_custom_logic()


class ReflexEngineService:
    """
    Service class for handling reflex testing logic in a clinical laboratory setting.
    
    This class manages the process of applying reflex rules to analysis results,
    determining when additional tests are needed, and executing those tests.
    """

    def __init__(self, analysis_result: AnalysisResult, user):
        self.analysis_result = analysis_result
        self.sample: Sample = analysis_result.sample
        self.analysis: Analysis = analysis_result.analysis
        self.user = user
        self.analysis_result_service = AnalysisResultService()
        self.reflex_action_service = ReflexActionService()
        self.complex_condition_service = ComplexConditionService()
        self._results_pool: Optional[List[AnalysisResult]] = None
        self._reflex_action: Optional[ReflexAction] = None

    async def set_reflex_actions(self, analysis_results: List[AnalysisResult]) -> None:
        """
        Prepare analysis results for reflex testing by setting initial reflex levels.

        :param analysis_results: List of analysis results to prepare for reflex testing
        """
        for result in analysis_results:
            logger.debug(f"Setting reflex actions for: {result}")
            action = await self.get_reflex_action(result.analysis_uid, 1)
            if action:
                result.reflex_level = 1
                await self.analysis_result_service.update(
                    result.uid, marshaller(result)
                )
                logger.debug(f"Reflex actions set for {result}")

    @cached(cache=reflex_action_cache)
    async def get_reflex_action(self, analysis_uid: str, level: int) -> Optional[ReflexAction]:
        """
        Get reflex action with caching to improve performance.

        :param analysis_uid: UID of the analysis
        :param level: Reflex level
        :return: ReflexAction if found, None otherwise
        """
        filters = {"analyses___uid": analysis_uid, "level": level}
        return await self.reflex_action_service.get(**filters)

    async def do_reflex(self) -> None:
        """
        Execute the reflex testing process for the current analysis result.
        """
        if not self.analysis_result.reflex_level:
            return

        logger.info(
            f"Performing reflex for level: {self.analysis_result.reflex_level} on SampleId {self.sample.sample_id}"
        )

        action = await self.get_reflex_action(self.analysis.uid, self.analysis_result.reflex_level)
        if not action:
            logger.info(f"No reflex action found for analysis: {self.analysis.name}")
            return

        self._reflex_action = action
        logger.info(f"Reflex action found for analysis: {self.analysis.name}")
        logger.info(f"Reflex action description: {action.description}")

        logger.info(f"Reflex Brains: {self._reflex_action.brains}")
        for brain in self._reflex_action.brains:
            await self.decide(brain)

    @staticmethod
    def can_decide(results_pool: list[AnalysisResult]) -> bool:
        """
        Check if all results in consideration are approved and a decision can be made.

        :param results_pool: List of analysis results to check
        :return: True if all results are approved, False otherwise
        """
        return bool(results_pool) and all(r.status == ResultState.APPROVED for r in results_pool)

    async def decide(self, brain: ReflexBrain) -> None:
        """
        Make a decision based on the reflex brain and execute actions if criteria are met.

        :param brain: ReflexBrain object containing decision criteria and actions
        """
        logger.info(f"Making reflex decision for brain: {brain}")

        if not brain.analyses_values and not brain.complex_conditions:
            logger.warning("No analyses values or complex conditions found for brain. Skipping decision.")
            return

        logger.info(f"Reflex brain analyses_values: {brain.analyses_values}")
        logger.info(f"Reflex brain complex_conditions: {brain.complex_conditions}")

        results_pool = await self.get_results_pool(brain.analyses_values)
        logger.info(f"Relevant results pool: {[r.result for r in results_pool]}")

        if not self.can_decide(results_pool):
            logger.info(
                f"Decision cannot be made. Aborting reflex: {[r.status for r in results_pool]}"
            )
            return

        if brain.custom_logic:
            decision = await self.evaluate_custom_logic(brain.custom_logic, results_pool)
        else:
            decision = await self.evaluate_complex_conditions(brain.complex_conditions, results_pool)

        if decision:
            await self.execute_matching_actions(brain, results_pool)
        else:
            logger.info("No matches found.")

    async def evaluate_custom_logic(self, custom_logic: str, results_pool: List[AnalysisResult]) -> bool:
        """
        Evaluate custom logic for decision making.

        :param custom_logic: Custom logic string to evaluate
        :param results_pool: List of analysis results to use in evaluation
        :return: Boolean result of the evaluation
        """
        # Implement custom logic evaluation here
        # This is a placeholder and should be replaced with actual logic
        logger.info(f"Evaluating custom logic: {custom_logic}")
        return True

    async def evaluate_complex_conditions(self, complex_conditions: List[ComplexCondition],
                                          results_pool: List[AnalysisResult]) -> bool:
        """
        Evaluate complex conditions for decision making.

        :param complex_conditions: List of complex conditions to evaluate
        :param results_pool: List of analysis results to use in evaluation
        :return: Boolean result of the evaluation
        """
        # Implement complex condition evaluation here
        # This is a placeholder and should be replaced with actual logic
        logger.info(f"Evaluating complex conditions: {complex_conditions}")
        return True

    async def execute_matching_actions(self, brain: ReflexBrain, results_pool: List[AnalysisResult]) -> None:
        """
        Execute actions for a matching reflex brain.

        :param brain: ReflexBrain object containing actions to execute
        :param results_pool: List of analysis results that matched the criteria
        """
        logger.info("Perfect match found. Executing actions.")

        # Add new Analyses
        logger.info(f"Adding new analyses: {brain.add_new}")
        for assoc in brain.add_new:
            for _ in range(assoc.count):
                await self.create_analyte_for(assoc.analysis_uid)

        # Finalise Analyses
        logger.info(f"Finalizing analyses: {brain.finalise}")
        for final in brain.finalise:
            await self.create_final_for(final.analysis.uid, final.value)

        # Clean up: hide reports for results that were used in this decision
        for r in results_pool:
            if r.reportable:
                await self.analysis_result_service.hide_report(r.uid)

    async def get_results_pool(self, criteria: list[ReflexBrainCriteria]) -> List[AnalysisResult]:
        """
        Get a pool of relevant analysis results for the given criteria.

        :param criteria: List of ReflexBrainCriteria to filter results
        :return: List of relevant AnalysisResult objects
        """
        total_criteria = len(criteria)
        criteria_anals = set(cr.analysis_uid for cr in criteria)
        logger.info(f"Criteria analyses: {criteria_anals}")

        if self._results_pool is None:
            # Fetch all results for the sample if not already cached
            results: List[AnalysisResult] = await self.analysis_result_service.get_all(
                sample_uid=self.sample.uid
            )
            # Filter results based on criteria and exclude the current result
            self._results_pool = [
                result for result in results
                if result.analysis_uid in criteria_anals
                   and result.uid != self.analysis_result.uid
            ]

        logger.info(f"Entire results pool: {[r.result for r in self._results_pool]}")
        # Sort results by creation date (newest first) and return the required number
        self._results_pool.sort(key=lambda x: x.created_at, reverse=True)
        return self._results_pool[:total_criteria]

    async def create_analyte_for(self, analysis_uid: str) -> AnalysisResult:
        """
        Create a new analyte (analysis result) for a given analysis.

        :param analysis_uid: UID of the analysis to create a new result for
        :return: Newly created AnalysisResult
        """
        logger.info(f"Creating analyte for: {analysis_uid}")

        a_result_in = {
            "sample_uid": self.sample.uid,
            "analysis_uid": analysis_uid,
            "status": ResultState.PENDING,
            "laboratory_instrument_uid": self.analysis_result.laboratory_instrument_uid,
            "method_uid": self.analysis_result.method_uid,
            "parent_id": self.analysis_result.uid,
            "retest": True,
            "reflex_level": self.analysis_result.reflex_level + 1,
        }
        a_result_schema = AnalysisResultCreate(**a_result_in)
        retest = await self.analysis_result_service.create(a_result_schema)
        await self.analysis_result_service.hide_report(self.analysis_result.uid)
        return retest

    async def create_final_for(self, analysis_uid: str, value: str) -> AnalysisResult:
        """
        Create a final analysis result for a given analysis and value.

        :param analysis_uid: UID of the analysis to create a final result for
        :param value: Final result value
        :return: Newly created AnalysisResult
        """
        logger.info(f"Creating final result for: {analysis_uid} with value: {value}")
        retest = await self.create_analyte_for(analysis_uid)
        res_in = AnalysisResultUpdate(
            result=value,
            submitted_by_uid=self.user.uid,
            date_submitted=datetime.now(),
            verified_by_uid=self.user.uid,
            date_verified=datetime.now(),
            status=ResultState.APPROVED,
            retest=False,
            reportable=True,
            reflex_level=None,
        )
        final = await self.analysis_result_service.update(retest.uid, res_in)
        return final

# def evaluate_complex_conditions(conditions, results):
#     def evaluate_condition(condition):
#         if condition['type'] == 'AND':
#             return all(evaluate_condition(sub) for sub in condition['conditions'])
#         elif condition['type'] == 'OR':
#             return any(evaluate_condition(sub) for sub in condition['conditions'])
#         else:
#             result = next((r for r in results if r.analysis_uid == condition['analysis_uid']), None)
#             if not result:
#                 return False
#             return compare_values(result.result, condition['operator'], condition['value'])

#     return evaluate_condition({'type': 'AND', 'conditions': conditions})

# def evaluate_custom_logic(logic_string, results):
#     # Create a safe environment for eval
#     safe_dict = {
#         'and': lambda x, y: x and y,
#         'or': lambda x, y: x or y,
#         'not': lambda x: not x,
#     }

#     # Add result values to the safe dictionary
#     for result in results:
#         safe_dict[result.analysis_uid] = result.result

#     try:
#         return eval(logic_string, {"__builtins__": None}, safe_dict)
#     except Exception as e:
#         logger.error(f"Error evaluating custom logic: {e}")
#         return False


# class ReflexEngineService:
#     async def execute_reflex_rules(self, sample):
#         active_rules = await self.reflex_rule_repository.get_active_rules()

#         for rule in active_rules:
#             actions = await self.reflex_action_service.get_ordered_actions(rule.id)

#             for action in actions:
#                 if action.custom_logic:
#                     if not evaluate_custom_logic(action.custom_logic, sample.results):
#                         continue

#                 for brain in action.brains:
#                     if brain.complex_conditions:
#                         if not evaluate_complex_conditions(brain.complex_conditions, sample.results):
#                             continue

#                     if brain.custom_logic:
#                         if not evaluate_custom_logic(brain.custom_logic, sample.results):
#                             continue

#                     # Execute brain logic
#                     await self.execute_brain_logic(brain, sample)

#     async def execute_brain_logic(self, brain, sample):
#         # Existing brain execution logic
#         # ...

#         # Handle conditional additions
#         for addition in brain.addNew:
#             if addition.conditions:
#                 if evaluate_complex_conditions([addition.conditions], sample.results):
#                     await self.add_new_analysis(addition, sample)

#         # Handle conditional finalizations
#         for final in brain.finalise:
#             if final.conditions:
#                 if evaluate_complex_conditions([final.conditions], sample.results):
#                     await self.finalize_analysis(final, sample)

# 1. Complex Conditions Example:
# Complex conditions allow for more sophisticated decision-making logic. Here's an example of how they might be structured and used:

# complex_condition = ComplexCondition(
#     reflex_brain_uid="brain_123",
#     condition_type="AND",
#     subconditions=[
#         {
#             "type": "OR",
#             "conditions": [
#                 {"analysis_uid": "analysis_1", "operator": ">", "value": "10"},
#                 {"analysis_uid": "analysis_1", "operator": "<", "value": "5"}
#             ]
#         },
#         {
#             "type": "AND",
#             "conditions": [
#                 {"analysis_uid": "analysis_2", "operator": "=", "value": "positive"},
#                 {"analysis_uid": "analysis_3", "operator": "!=", "value": "negative"}
#             ]
#         }
#     ]
# )

# In the ReflexEngineService
# async def evaluate_complex_conditions(self, complex_conditions: List[ComplexCondition], results_pool: List[AnalysisResult]) -> bool:
#     for condition in complex_conditions:
#         if condition.condition_type == "AND":
#             if not all(self._evaluate_subcondition(sub, results_pool) for sub in condition.subconditions):
#                 return False
#         elif condition.condition_type == "OR":
#             if not any(self._evaluate_subcondition(sub, results_pool) for sub in condition.subconditions):
#                 return False
#     return True

# def _evaluate_subcondition(self, subcondition: Dict, results_pool: List[AnalysisResult]) -> bool:
#     if subcondition["type"] in ["AND", "OR"]:
#         return self.evaluate_complex_conditions([ComplexCondition(**subcondition)], results_pool)
#     else:
#         result = next((r for r in results_pool if r.analysis_uid == subcondition["analysis_uid"]), None)
#         if not result:
#             return False
#         return self._compare_values(result.result, subcondition["operator"], subcondition["value"])

# def _compare_values(self, result_value, operator, condition_value):
#     if operator == "=":
#         return result_value == condition_value
#     elif operator == "!=":
#         return result_value != condition_value
#     elif operator == ">":
#         return float(result_value) > float(condition_value)
#     elif operator == "<":
#         return float(result_value) < float(condition_value)
#     # Add more operators as needed

# Custom Logic Example:
# Custom logic allows for even more flexibility by using a string representation of a logical expression. Here's an example:

# reflex_brain = ReflexBrain(
#     uid="brain_456",
#     custom_logic="(analysis_1 > 10 or analysis_1 < 5) and analysis_2 == 'positive' and analysis_3 != 'negative'"
# )

# # In the ReflexEngineService
# async def evaluate_custom_logic(self, custom_logic: str, results_pool: List[AnalysisResult]) -> bool:
#     # Create a dictionary of analysis results for easy access
#     results_dict = {result.analysis_uid: result.result for result in results_pool}

#     # Replace analysis UIDs with their actual values in the custom logic string
#     for analysis_uid, result in results_dict.items():
#         custom_logic = custom_logic.replace(analysis_uid, f"'{result}'")

#     # Evaluate the custom logic
#     try:
#         return eval(custom_logic)
#     except Exception as e:
#         logger.error(f"Error evaluating custom logic: {e}")
#         return False


# 3. Using Conditions in ReflexBrainAddition and ReflexBrainFinal:
# The new conditions field in these entities allows for conditional execution of additions or finalizations:

# addition = ReflexBrainAddition(
#     analysis_uid="new_analysis_1",
#     reflex_brain_uid="brain_789",
#     count=1,
#     conditions={
#         "type": "AND",
#         "conditions": [
#             {"analysis_uid": "analysis_4", "operator": ">", "value": "20"},
#             {"analysis_uid": "analysis_5", "operator": "<", "value": "50"}
#         ]
#     }
# )

# final = ReflexBrainFinal(
#     analysis_uid="final_analysis_1",
#     reflex_brain_uid="brain_789",
#     value="Abnormal",
#     conditions={
#         "type": "OR",
#         "conditions": [
#             {"analysis_uid": "analysis_6", "operator": "=", "value": "positive"},
#             {"analysis_uid": "analysis_7", "operator": ">", "value": "100"}
#         ]
#     }
# )

# # In the ReflexEngineService
# async def execute_matching_actions(self, brain: ReflexBrain, results_pool: List[AnalysisResult]) -> None:
#     logger.info("Perfect match found. Executing actions.")

#     # Add new Analyses
#     logger.info(f"Adding new analyses: {brain.add_new}")
#     for assoc in brain.add_new:
#         if self._evaluate_conditions(assoc.conditions, results_pool):
#             for _ in range(assoc.count):
#                 await self.create_analyte_for(assoc.analysis_uid)

#     # Finalise Analyses
#     logger.info(f"Finalizing analyses: {brain.finalise}")
#     for final in brain.finalise:
#         if self._evaluate_conditions(final.conditions, results_pool):
#             await self.create_final_for(final.analysis.uid, final.value)

#     # Clean up: hide reports for results that were used in this decision
#     for r in results_pool:
#         if r.reportable:
#             await self.analysis_result_service.hide_report(r.uid)

# def _evaluate_conditions(self, conditions: Dict, results_pool: List[AnalysisResult]) -> bool:
#     if not conditions:
#         return True
#     return self.evaluate_complex_conditions([ComplexCondition(**conditions)], results_pool)


# These examples demonstrate how the new fields and structures can be used to create more sophisticated and flexible reflex testing rules. The complex conditions allow for nested logical operations, while custom logic provides a way to write arbitrary logical expressions. The conditional additions and finalizations allow for more granular control over when new analyses are added or when final results are created.
# Remember to implement proper security measures when using eval() for custom logic, as it can be a security risk if not properly sanitized and restricted.


# Certainly! I'll provide guidance on how users can input custom logic and complex conditions, along with examples for each.
# 1. Custom Logic:
# Custom logic allows users to write arbitrary logical expressions using analysis results. Users can use analysis UIDs as variables, along with logical operators (and, or, not) and comparison operators (==, !=, >, <, >=, <=).
# Guidance for users:
# Use analysis UIDs as variables (e.g., "analysis_1", "analysis_2")
# Use logical operators: and, or, not
# Use comparison operators: ==, !=, >, <, >=, <=
# Wrap complex expressions in parentheses
# Examples:
# a. Simple condition:
# (analysis_1 > 10 and analysis_2 < 5) or analysis_3 == "positive"
# b. Complex condition:
# (analysis_1 > 10 and analysis_2 < 5) or (analysis_3 == "positive" and analysis_4 != "negative")
# c. Custom logic:
# (analysis_1 > 10 or analysis_1 < 5) and analysis_2 == 'positive' and analysis_3 != 'negative'   

# More complex condition:
# (analysis_1 > 10 or analysis_1 < 5) and (analysis_2 == 'positive' or analysis_3 != 'negative')

# Using multiple analyses:
# (analysis_1 > analysis_2) and (analysis_3 == 'high' or analysis_4 < 100)


# In the UI, you can provide a text area for users to input these custom logic expressions:

# <template>
#   <div>
#     <label for="custom-logic">Custom Logic:</label>
#     <textarea
#       id="custom-logic"
#       v-model="customLogic"
#       rows="4"
#       placeholder="Enter custom logic (e.g., analysis_1 > 10 and analysis_2 == 'positive')"
#     ></textarea>
#   </div>
# </template>

# <script setup>
# import { ref } from 'vue';

# const customLogic = ref('');
# </script>


# Complex Conditions:
# Complex conditions allow users to create nested logical structures with AND/OR operators. Each condition can have subconditions, creating a tree-like structure.
# Guidance for users:
# Start with a root condition (AND or OR)
# Add subconditions, which can be either simple comparisons or nested AND/OR conditions
# For simple comparisons, select an analysis, an operator, and a value
# For nested conditions, choose AND or OR and add more subconditions
# Examples:
# a. Simple AND condition:


# {
#   "type": "AND",
#   "conditions": [
#     { "analysis_uid": "analysis_1", "operator": ">", "value": "10" },
#     { "analysis_uid": "analysis_2", "operator": "=", "value": "positive" }
#   ]
# }

# b. Nested OR condition:

# {
#   "type": "OR",
#   "conditions": [
#     {
#       "type": "AND",
#       "conditions": [
#         { "analysis_uid": "analysis_1", "operator": ">", "value": "10" },
#         { "analysis_uid": "analysis_2", "operator": "=", "value": "positive" }
#       ]
#     },
#     {
#       "type": "AND",
#       "conditions": [
#         { "analysis_uid": "analysis_3", "operator": "<", "value": "5" },
#         { "analysis_uid": "analysis_4", "operator": "!=", "value": "negative" }
#       ]
#     }
#   ]
# }

# For complex conditions, you'll want to create a more interactive UI component. Here's a simplified example of how you might structure such a component:

# <template>
#   <div class="complex-condition">
#     <select v-model="condition.type">
#       <option value="AND">AND</option>
#       <option value="OR">OR</option>
#     </select>
#     <div v-for="(subCondition, index) in condition.conditions" :key="index">
#       <div v-if="typeof subCondition === 'object' && (subCondition.type === 'AND' || subCondition.type === 'OR')">
#         <ComplexCondition v-model="condition.conditions[index]" />
#       </div>
#       <div v-else>
#         <select v-model="subCondition.analysis_uid">
#           <option v-for="analysis in analyses" :key="analysis.uid" :value="analysis.uid">
#             {{ analysis.name }}
#           </option>
#         </select>
#         <select v-model="subCondition.operator">
#           <option value="=">=</option>
#           <option value="!=">!=</option>
#           <option value=">">&gt;</option>
#           <option value="<">&lt;</option>
#           <option value=">=">&gt;=</option>
#           <option value="<=">&lt;=</option>
#         </select>
#         <input v-model="subCondition.value" type="text" />
#         <button @click="removeSubCondition(index)">Remove</button>
#       </div>
#     </div>
#     <button @click="addSubCondition">Add Condition</button>
#     <button @click="addNestedCondition">Add Nested Condition</button>
#   </div>
# </template>

# <script setup>
# import { ref, defineProps, defineEmits } from 'vue';

# const props = defineProps(['modelValue']);
# const emit = defineEmits(['update:modelValue']);

# const condition = ref(props.modelValue);

# function addSubCondition() {
#   condition.value.conditions.push({
#     analysis_uid: '',
#     operator: '=',
#     value: ''
#   });
#   emit('update:modelValue', condition.value);
# }

# function addNestedCondition() {
#   condition.value.conditions.push({
#     type: 'AND',
#     conditions: []
#   });
#   emit('update:modelValue', condition.value);
# }

# function removeSubCondition(index) {
#   condition.value.conditions.splice(index, 1);
#   emit('update:modelValue', condition.value);
# }
# </script>


# This component allows users to build complex nested conditions interactively. You would use this component in your main form like this:


# <template>
#   <div>
#     <h3>Complex Condition</h3>
#     <ComplexCondition v-model="complexCondition" />
#   </div>
# </template>

# <script setup>
# import { ref } from 'vue';
# import ComplexCondition from './ComplexCondition.vue';

# const complexCondition = ref({
#   type: 'AND',
#   conditions: []
# });
# </script>


# Remember to provide clear instructions and examples to your users on how to use these features. You might want to include a help section or tooltips explaining the syntax for custom logic and how to build complex conditions.
