import { defineStore } from 'pinia';

import useApiUtil from '@/composables/api_util';
import { GetAllReflexRulesDocument, GetAllReflexRulesQuery, GetAllReflexRulesQueryVariables } from '@/graphql/operations/reflex.queries';
import type { ReflexRuleType } from '@/types/gql';

// New schema imports
import { GetReflexRuleByUidDocument, GetReflexRuleByUidQuery, GetReflexRuleByUidQueryVariables } from '@/graphql/operations/reflex.queries';
import {
    CreateReflexDecisionDocument,
    CreateReflexDecisionMutation,
    CreateReflexDecisionMutationVariables,
    UpdateReflexDecisionDocument,
    UpdateReflexDecisionMutation,
    UpdateReflexDecisionMutationVariables,
    CreateReflexTriggerDocument,
    CreateReflexTriggerMutation,
    CreateReflexTriggerMutationVariables,
    UpdateReflexTriggerDocument,
    UpdateReflexTriggerMutation,
    UpdateReflexTriggerMutationVariables,
    SaveReflexRuleGraphDocument,
    SaveReflexRuleGraphMutation,
    SaveReflexRuleGraphMutationVariables,
    EditReflexRuleDocument,
    EditReflexRuleMutation,
    EditReflexRuleMutationVariables,
} from '@/graphql/operations/reflex.mutations';

const { withClientQuery, withClientMutation } = useApiUtil();

/**
 * Validation error for graph
 */
export interface ValidationError {
    nodeId?: string;
    edgeId?: string;
    type: 'error' | 'warning';
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    field?: string;
    code: string;
}

/**
 * Draft state
 */
export interface DraftState {
    nodes: any[];
    edges: any[];
    timestamp: number;
    version: number;
}

type ReflexStateType = {
    reflexRules: ReflexRuleType[];
    fetchingReflexRules: boolean;
    reflexRule?: any; // Full rule with triggers, decisions, etc.
    fetchingReflexRule: boolean;
    draft?: DraftState;
    validationErrors: ValidationError[];
    validationWarnings: ValidationError[];
};

export const useReflexStore = defineStore('reflex', {
    state: (): ReflexStateType => ({
        reflexRules: [],
        fetchingReflexRules: false,
        reflexRule: undefined,
        fetchingReflexRule: false,
        draft: undefined,
        validationErrors: [],
        validationWarnings: [],
    }),
    getters: {
        getReflexRules: (state): ReflexRuleType[] => state.reflexRules,
        getReflexRule: (state): any => state.reflexRule,
        getDraft: (state): DraftState | undefined => state.draft,
        getValidationErrors: (state): ValidationError[] => state.validationErrors,
        getValidationWarnings: (state): ValidationError[] => state.validationWarnings,
        isValid: (state): boolean => state.validationErrors.length === 0,
    },
    actions: {
        /**
         * Fetch all reflex rules (list view)
         */
        async fetchAllReflexRules(): Promise<void> {
            try {
                this.fetchingReflexRules = true;
                const result = await withClientQuery<GetAllReflexRulesQuery, GetAllReflexRulesQueryVariables>(
                    GetAllReflexRulesDocument,
                    {},
                    'reflexRuleAll',
                );

                if (result && typeof result === 'object' && 'items' in result) {
                    this.reflexRules = result.items as ReflexRuleType[];
                } else {
                }
            } catch {
            } finally {
                this.fetchingReflexRules = false;
            }
        },

        /**
         * Fetch reflex rule with full schema (triggers, decisions, rule groups)
         *
         * @param uid - Rule UID
         */
        async fetchReflexRuleByUid(uid: string): Promise<void> {
            if (!uid) {
                return;
            }

            try {
                this.fetchingReflexRule = true;

                const result = await withClientQuery<GetReflexRuleByUidQuery, GetReflexRuleByUidQueryVariables>(
                    GetReflexRuleByUidDocument,
                    { uid },
                    'reflexRuleByUid',
                );

                if (result && typeof result === 'object') {
                    this.reflexRule = result;
                } else {
                }
            } catch {
            } finally {
                this.fetchingReflexRule = false;
            }
        },

        /**
         * Create reflex trigger
         *
         * @param payload - Trigger payload
         * @returns Created trigger or error
         */
        async createReflexTrigger(payload: any): Promise<any> {
            try {
                const result = await withClientMutation<CreateReflexTriggerMutation, CreateReflexTriggerMutationVariables>(
                    CreateReflexTriggerDocument,
                    { payload },
                );

                if (result && result.__typename === 'ReflexTriggerType') {
                    // Update local state
                    if (this.reflexRule) {
                        if (!this.reflexRule.reflexTriggers) {
                            this.reflexRule.reflexTriggers = [];
                        }
                        this.reflexRule.reflexTriggers.push(result);
                    }
                    return result;
                } else if (result && result.__typename === 'OperationError') {
                    return result;
                }
            } catch (error) {
                throw error;
            }
        },

        /**
         * Create reflex decision with nested rule groups and actions
         *
         * @param payload - Decision payload with nested structures
         * @returns Created decision or error
         */
        async createReflexDecision(payload: any): Promise<any> {
            try {
                const result = await withClientMutation<CreateReflexDecisionMutation, CreateReflexDecisionMutationVariables>(
                    CreateReflexDecisionDocument,
                    { payload },
                );

                if (result && result.__typename === 'ReflexDecisionType') {
                    // Update local state
                    if (this.reflexRule) {
                        const trigger = this.reflexRule.reflexTriggers?.find((t: any) => t.uid === payload.reflex_trigger_uid);
                        if (trigger) {
                            if (!trigger.decisions) {
                                trigger.decisions = [];
                            }
                            trigger.decisions.push(result);
                        }
                    }
                    return result;
                } else if (result && result.__typename === 'OperationError') {
                    return result;
                }
            } catch (error) {
                throw error;
            }
        },

        /**
         * Update reflex decision
         *
         * @param uid - Decision UID
         * @param payload - Updated decision payload
         * @returns Updated decision or error
         */
        async updateReflexDecision(uid: string, payload: any): Promise<any> {
            try {
                const result = await withClientMutation<UpdateReflexDecisionMutation, UpdateReflexDecisionMutationVariables>(
                    UpdateReflexDecisionDocument,
                    { uid, payload },
                );

                if (result && result.__typename === 'ReflexDecisionType') {
                    // Update local state
                    if (this.reflexRule) {
                        this.reflexRule.reflexTriggers?.forEach((trigger: any) => {
                            const index = trigger.decisions?.findIndex((d: any) => d.uid === uid);
                            if (index !== undefined && index > -1) {
                                trigger.decisions[index] = result;
                            }
                        });
                    }
                    return result;
                } else if (result && result.__typename === 'OperationError') {
                    return result;
                }
            } catch (error) {
                throw error;
            }
        },

        /**
         * Save entire reflex rule graph (convert from nodes/edges to schema)
         *
         * @param ruleUid - Rule UID
         * @param graph - Graph data with nodes and edges
         * @returns Success or error
         */
        async saveReflexRuleGraph(ruleUid: string, graph: { nodes: any[]; edges: any[] }): Promise<any> {
            try {
                // Convert graph to trigger/decision structure
                const payload = this.convertGraphToPayload(ruleUid, graph);

                // Create/update triggers and decisions
                const results = [];

                for (const triggerData of payload.triggers) {
                    // Create or update trigger
                    let trigger;
                    if (triggerData.uid) {
                        // Update existing
                        // trigger = await this.updateReflexTrigger(triggerData.uid, triggerData);
                    } else {
                        // Create new
                        trigger = await this.createReflexTrigger(triggerData);
                    }

                    // Create/update decisions for this trigger
                    for (const decisionData of triggerData.decisions || []) {
                        let decision;
                        if (decisionData.uid) {
                            // Update existing
                            decision = await this.updateReflexDecision(decisionData.uid, decisionData);
                        } else {
                            // Create new
                            decision = await this.createReflexDecision(decisionData);
                        }
                        results.push(decision);
                    }
                }

                return { success: true, results };
            } catch (error) {
                return { success: false, error };
            }
        },

        /**
         * Convert graph (nodes + edges) to payload structure
         *
         * @param ruleUid - Rule UID
         * @param graph - Graph with nodes and edges
         * @returns Payload structure for mutations
         */
        convertGraphToPayload(ruleUid: string, graph: { nodes: any[]; edges: any[] }): any {
            const { nodes, edges } = graph;

            // Group nodes by type
            const triggerNodes = nodes.filter(n => n.type === 'trigger');
            const decisionNodes = nodes.filter(n => n.type === 'decision');
            const ruleNodes = nodes.filter(n => n.type === 'rule');
            const actionNodes = nodes.filter(n => n.type === 'action');
            const ruleNodeMap = new Map(ruleNodes.map(rule => [rule.id, rule]));
            const actionNodeMap = new Map(actionNodes.map(action => [action.id, action]));
            const ruleEdges = edges.filter(
                e => nodes.find(n => n.id === e.source && n.type === 'rule') && nodes.find(n => n.id === e.target && n.type === 'rule'),
            );
            const ruleAdjacency = new Map<string, string[]>();
            ruleEdges.forEach(edge => {
                const list = ruleAdjacency.get(edge.source) ?? [];
                list.push(edge.target);
                ruleAdjacency.set(edge.source, list);
            });

            const buildRuleChains = (startId: string): string[][] => {
                const chains: string[][] = [];
                const dfs = (currentId: string, path: string[]) => {
                    if (path.includes(currentId)) return;
                    const nextPath = [...path, currentId];
                    const nextRules = ruleAdjacency.get(currentId) ?? [];
                    if (nextRules.length === 0) {
                        chains.push(nextPath);
                        return;
                    }
                    nextRules.forEach(nextId => dfs(nextId, nextPath));
                };
                dfs(startId, []);
                return chains.length > 0 ? chains : [[startId]];
            };

            // Build triggers with nested decisions
            const triggers = triggerNodes.map(trigger => {
                // Find decisions connected to this trigger
                const connectedDecisionIds = edges.filter(e => e.source === trigger.id).map(e => e.target);

                const decisions = decisionNodes
                    .filter(d => connectedDecisionIds.includes(d.id))
                    .map(decision => {
                        // Find rules connected to this decision (OR roots)
                        const connectedRuleIds = edges
                            .filter(e => e.source === decision.id && nodes.find(n => n.id === e.target && n.type === 'rule'))
                            .map(e => e.target);

                        // Build rule groups: each root rule creates a rule group (OR),
                        // chaining rules (rule -> rule) are AND within the group.
                        const ruleGroups = connectedRuleIds.flatMap(ruleId => {
                            const chains = buildRuleChains(ruleId);
                            return chains.map(chain => {
                                return {
                                    description: decision.data.description || 'Rule group',
                                    priority: 0,
                                    rules: chain
                                        .map(ruleChainId => ruleNodeMap.get(ruleChainId))
                                        .filter((rule): rule is any => Boolean(rule))
                                        .map(rule => ({
                                            analysis_uid: rule.data.analysis_uid,
                                            operator: rule.data.operator,
                                            value: rule.data.value,
                                            priority: rule.data.priority || 0,
                                        })),
                                };
                            });
                        });

                        // Find actions connected to this decision or its rule chains
                        const connectedActionIds = new Set(
                            edges
                                .filter(e => e.source === decision.id && nodes.find(n => n.id === e.target && n.type === 'action'))
                                .map(e => e.target),
                        );

                        const addAnalyses = Array.from(connectedActionIds)
                            .map(actionId => actionNodeMap.get(actionId))
                            .filter((action): action is any => Boolean(action) && action.data.actionType === 'add')
                            .map(action => ({
                                analysis_uid: action.data.analysis_uid,
                                count: action.data.count || 1,
                            }));

                        const finalizeAnalyses = Array.from(connectedActionIds)
                            .map(actionId => actionNodeMap.get(actionId))
                            .filter((action): action is any => Boolean(action) && action.data.actionType === 'finalize')
                            .map(action => ({
                                analysis_uid: action.data.analysis_uid,
                                value: action.data.value,
                            }));

                        return {
                            uid: decision.data.uid, // Include if updating
                            reflex_trigger_uid: trigger.data.uid || trigger.id,
                            description: decision.data.description,
                            priority: decision.data.priority,
                            rule_groups: ruleGroups,
                            add_analyses: addAnalyses,
                            finalize_analyses: finalizeAnalyses,
                        };
                    });

                return {
                    uid: trigger.data.uid, // Include if updating
                    reflex_rule_uid: ruleUid,
                    level: trigger.data.level,
                    description: trigger.data.description,
                    sample_type_uid: trigger.data.sample_type_uid,
                    analyses: trigger.data.analyses?.map((a: any) => (typeof a === 'string' ? a : a.uid)) || [],
                    decisions,
                };
            });

            return { triggers };
        },

        /**
         * Save draft to state
         *
         * @param draft - Draft data
         */
        saveDraft(draft: DraftState): void {
            this.draft = draft;
        },

        /**
         * Clear draft from state
         */
        clearDraft(): void {
            this.draft = undefined;
        },

        /**
         * Set validation results
         *
         * @param errors - Validation errors
         * @param warnings - Validation warnings
         */
        setValidation(errors: ValidationError[], warnings: ValidationError[]): void {
            this.validationErrors = errors;
            this.validationWarnings = warnings;
        },

        /**
         * Clear validation results
         */
        clearValidation(): void {
            this.validationErrors = [];
            this.validationWarnings = [];
        },

        /**
         * Save reflex rule graph to backend (unified create/update)
         *
         * Uses the new saveReflexRuleGraph mutation that handles the entire graph
         * conversion on the backend. Much simpler and more atomic than individual mutations.
         *
         * The is_active flag is managed separately via publish/unpublish methods.
         *
         * @param ruleUid - Rule UID
         * @param nodes - Vue Flow nodes with positions
         * @param edges - Vue Flow edges (define relationships)
         */
        async saveReflexRule(ruleUid: string, nodes: any[], edges: any[]): Promise<any> {
            try {
                // Convert Vue Flow format to GraphQL input format (camelCase for GraphQL)
                const graphNodes = nodes.map(node => {
                    const position = node.position ?? node.computedPosition ?? { x: 0, y: 0 };
                    return {
                        id: node.id,
                        type: node.type,
                        positionX: position.x,
                        positionY: position.y,
                        data: node.data || {},
                    };
                });

                const graphEdges = edges.map(edge => ({
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle || null,
                    targetHandle: edge.targetHandle || null,
                }));

                const graph = {
                    nodes: graphNodes,
                    edges: graphEdges,
                };

                const result = await withClientMutation<SaveReflexRuleGraphMutation, SaveReflexRuleGraphMutationVariables>(
                    SaveReflexRuleGraphDocument,
                    { uid: ruleUid, graph },
                    'saveReflexRuleGraph',
                );

                if (result && result.__typename === 'ReflexRuleType') {
                    // Update local state with returned data (includes new UIDs)
                    this.reflexRule = result;
                    return result;
                } else if (result && result.__typename === 'OperationError') {
                    throw new Error(result.error);
                }
            } catch (error) {
                throw error;
            }
        },

        /**
         * Toggle publish status (is_active flag) of a reflex rule
         *
         * @param ruleUid - Rule UID
         * @param isActive - true = published, false = draft
         */
        async togglePublish(ruleUid: string, isActive: boolean): Promise<void> {
            try {
                // Get current rule data for name (required field)
                const currentRule = this.getReflexRule;
                if (!currentRule) {
                    throw new Error('Rule not loaded. Cannot toggle publish status.');
                }

                const result = await withClientMutation<EditReflexRuleMutation, EditReflexRuleMutationVariables>(EditReflexRuleDocument, {
                    uid: ruleUid,
                    payload: {
                        name: currentRule.name,
                        description: currentRule.description || '',
                        is_active: isActive,
                    },
                });

                if (result && result.__typename === 'ReflexRuleType') {
                    // Update local state
                    await this.fetchReflexRuleByUid(ruleUid);
                } else if (result && result.__typename === 'OperationError') {
                    throw new Error(result.error);
                }
            } catch (error) {
                throw error;
            }
        },
    },
});
