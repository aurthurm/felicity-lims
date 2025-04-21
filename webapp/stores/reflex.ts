import { defineStore } from 'pinia';

import useApiUtil from '@/composables/api_util';
import { GetAllReflexRulesDocument, GetAllReflexRulesQuery, GetAllReflexRulesQueryVariables, GetReflexRuleByUidDocument, GetReflexRuleByUidQuery, GetReflexRuleByUidQueryVariables } from '@/graphql/operations/reflex.queries';
import { ReflexActionType, ReflexBrainType, ReflexRuleType } from '@/types/gql';

const { withClientQuery } = useApiUtil();

type ReflexStateType = {
    reflexRules: ReflexRuleType[];
    fetchingReflexRules: boolean;
    reflexRule?: ReflexRuleType;
    fetchingReflexRule: boolean;
};

export const useReflexStore = defineStore('reflex', {
    state: (): ReflexStateType => ({
        reflexRules: [],
        fetchingReflexRules: false,
        reflexRule: undefined,
        fetchingReflexRule: false,
    }),
    getters: {
        getReflexRules: (state): ReflexRuleType[] => state.reflexRules,
        getReflexRule: (state): ReflexRuleType | undefined => state.reflexRule,
    },
    actions: {
        async fetchAllReflexRules(): Promise<void> {
            try {
                this.fetchingReflexRules = true;
                const result = await withClientQuery<GetAllReflexRulesQuery, GetAllReflexRulesQueryVariables>(
                    GetAllReflexRulesDocument, 
                    {}, 
                    'reflexRuleAll'
                );
                
                if (result && typeof result === 'object' && 'items' in result) {
                    this.reflexRules = result.items as ReflexRuleType[];
                } else {
                    console.error('Invalid reflex rules data received:', result);
                }
            } catch (error) {
                console.error('Error fetching reflex rules:', error);
            } finally {
                this.fetchingReflexRules = false;
            }
        },
        
        async fetchReflexRuleByUid(uid: string): Promise<void> {
            if (!uid) {
                console.error('Invalid uid provided to fetchReflexRuleByUid');
                return;
            }
            
            try {
                this.fetchingReflexRule = true;
                const result = await withClientQuery<GetReflexRuleByUidQuery, GetReflexRuleByUidQueryVariables>(
                    GetReflexRuleByUidDocument, 
                    { uid }, 
                    'reflexRuleByUid'
                );
                
                if (result && typeof result === 'object') {
                    this.reflexRule = result as ReflexRuleType;
                } else {
                    console.error('Invalid reflex rule data received:', result);
                }
            } catch (error) {
                console.error('Error fetching reflex rule:', error);
            } finally {
                this.fetchingReflexRule = false;
            }
        },
        
        addReflexRule(rr: ReflexRuleType): void {
            if (!rr?.uid) {
                console.error('Invalid reflex rule payload:', rr);
                return;
            }
            this.reflexRules.unshift(rr);
        },
        
        updateReflexRule(rr: ReflexRuleType): void {
            if (!rr?.uid) {
                console.error('Invalid reflex rule payload:', rr);
                return;
            }
            const index = this.reflexRules.findIndex(x => x.uid === rr.uid);
            if (index > -1) {
                this.reflexRules[index] = rr;
            }
        },

        addReflexAction(action: ReflexActionType): void {
            if (!action?.uid || !this.reflexRule) {
                console.error('Invalid reflex action payload or no reflex rule selected:', action);
                return;
            }
            
            if (!this.reflexRule.reflexActions) {
                this.reflexRule.reflexActions = [];
            }
            
            this.reflexRule.reflexActions.push(action);
        },
        
        updateReflexAction(action: ReflexActionType): void {
            if (!action?.uid || !this.reflexRule?.reflexActions) {
                console.error('Invalid reflex action payload or no reflex rule selected:', action);
                return;
            }
            
            const index = this.reflexRule.reflexActions.findIndex(x => x.uid === action.uid);
            if (index > -1) {
                this.reflexRule.reflexActions[index] = action;
            }
        },

        addReflexBrain(brain: ReflexBrainType): void {
            if (!brain?.uid || !brain?.reflexActionUid || !this.reflexRule?.reflexActions) {
                console.error('Invalid reflex brain payload or no reflex rule selected:', brain);
                return;
            }
            
            const action = this.reflexRule.reflexActions.find(act => act.uid === brain.reflexActionUid);
            if (action) {
                if (!action.brains) {
                    action.brains = [];
                }
                action.brains.push(brain);
            } else {
                console.error(`No reflex action found with uid ${brain.reflexActionUid}`);
            }
        },
        
        updateReflexBrain(brain: ReflexBrainType): void {
            if (!brain?.uid || !brain?.reflexActionUid || !this.reflexRule?.reflexActions) {
                console.error('Invalid reflex brain payload or no reflex rule selected:', brain);
                return;
            }
            
            const action = this.reflexRule.reflexActions.find(act => act.uid === brain.reflexActionUid);
            if (action && action.brains) {
                const index = action.brains.findIndex(x => x.uid === brain.uid);
                if (index > -1) {
                    action.brains[index] = brain;
                }
            } else {
                console.error(`No reflex action found with uid ${brain.reflexActionUid} or no brains array`);
            }
        },
        
        deleteReflexBrain(actionUid: string, brainUid: string): void {
            if (!actionUid || !brainUid || !this.reflexRule?.reflexActions) {
                console.error('Invalid parameters for deleteReflexBrain:', { actionUid, brainUid });
                return;
            }
            
            const action = this.reflexRule.reflexActions.find(act => act.uid === actionUid);
            if (action && action.brains) {
                const index = action.brains.findIndex(brain => brain.uid === brainUid);
                if (index > -1) {
                    action.brains.splice(index, 1);
                } else {
                    console.error(`No reflex brain found with uid ${brainUid}`);
                }
            } else {
                console.error(`No reflex action found with uid ${actionUid} or no brains array`);
            }
        },
    },
});

