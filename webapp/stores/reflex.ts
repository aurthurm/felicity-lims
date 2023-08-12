import { defineStore } from 'pinia';
import { GET_ALL_REFLEX_RULES, GET_EFLEX_RULE_BY_UID } from '../graphql/operations/reflex.queries';
import { IReflexAction, IReflexBrain, IReflexRule } from '../models/reflex';

import { useApiUtil } from '../composables';
const { withClientQuery } = useApiUtil();

export const useReflexStore = defineStore('reflex', {
    state: () =>
        ({
            reflexRules: [],
            fetchingReflexRules: false,
            reflexRule: undefined,
            fetchingReflexRule: false,
        } as {
            reflexRules: IReflexRule[];
            fetchingReflexRules: boolean;
            reflexRule?: IReflexRule;
            fetchingReflexRule: boolean;
        }),
    getters: {
        getReflexRules: state => state.reflexRules,
        getReflexRule: state => state.reflexRule,
    },
    actions: {
        async fetchAllReflexRules() {
            this.fetchingReflexRules = true;
            await withClientQuery(GET_ALL_REFLEX_RULES, {}, 'reflexRuleAll')
                .then(payload => {
                    this.fetchingReflexRules = false;
                    this.reflexRules = payload.items;
                })
                .catch(err => (this.fetchingReflexRules = false));
        },
        async fetchReflexRuleByUid(uid: string) {
            this.fetchingReflexRule = true;
            await withClientQuery(GET_EFLEX_RULE_BY_UID, { uid }, 'reflexRuleByUid')
                .then(payload => {
                    this.fetchingReflexRule = false;
                    this.reflexRule = payload;
                })
                .catch(err => (this.fetchingReflexRule = false));
        },
        addReflexRule(rr: IReflexRule) {
            this.reflexRules?.unshift(rr);
        },
        updateReflexRule(rr: IReflexRule) {
            const index = this.reflexRules.findIndex(x => x.uid === rr.uid);
            if (index > -1) this.reflexRules[index] = rr;
        },

        addReflexAction(action: IReflexAction) {
            this.reflexRule?.reflexActions?.push(action);
        },
        updateReflexAction(action: IReflexAction) {
            const index = this.reflexRule?.reflexActions?.findIndex(x => x.uid === action.uid) || -1;
            if (index > -1) this.reflexRule!.reflexActions[index] = action;
        },

        addReflexBrain(brain: IReflexBrain) {
            const action = this.reflexRule?.reflexActions?.find(act => act.uid == brain.reflexActionUid);
            if (action) action.brains?.push(brain);
        },
        updateReflexBrain(brain: IReflexBrain) {
            let action = this.reflexRule?.reflexActions?.find(act => act.uid == brain.reflexActionUid);
            if (action) {
                const index = action?.brains?.findIndex(x => x.uid === brain.uid) || -1;
                if (index > -1) action!.brains![index] = brain;
            }
        },
    },
});
