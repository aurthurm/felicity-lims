import { reactive } from "vue"
import { useQuery } from "urql"
import { urqlClient } from '../urql';
import {
  GET_ALL_REFLEX_RULES,
   GET_EFLEX_RULE_BY_UID
} from '../graphql/reflex.queries';
import { IReflexAction, IReflexBrain, IReflexRule } from "../models/reflex"
import useNotifyToast from "./alert_toast";

const { gqlResponseHandler } = useNotifyToast();

const _state = reactive({
    reflexRules: [] as IReflexRule[],
    reflexRule: null as IReflexRule | null,
})

export default function useReflexComposable(){

    const fetchAllReflexRules = async () => {
        await urqlClient
        .query( GET_ALL_REFLEX_RULES)
        .toPromise()
        .then((res) => {
          const data = gqlResponseHandler(res)
          setReflexRules(data?.reflexRuleAll?.items)
        });
    }

    const fetchReflexRuleByUid = async (uid: number) => {
        await urqlClient
          .query( GET_EFLEX_RULE_BY_UID, { uid })
          .toPromise()
          .then((res) => {
            const data = gqlResponseHandler(res)
            setReflexRule(data?.reflexRuleByUid)
          });
    }

    return {
        state: _state, 
        fetchAllReflexRules,
        fetchReflexRuleByUid,
        _addReflexRule, _updateReflexRule,
        _addReflexAction, _updateReflexAction,
        _addReflexBrain, _updateReflexBrain 
    }
}

const setReflexRules = (reflexRules: IReflexRule[]) => {
    _state.reflexRules = reflexRules;
}

const setReflexRule = (reflexRule: IReflexRule) => {
    _state.reflexRule = reflexRule;
}

const _addReflexRule = (rr: IReflexRule) => _state.reflexRules.push(rr);

const _updateReflexRule = (rr: IReflexRule) => {
    const index = _state.reflexRules.findIndex(x => x.uid === rr.uid);
    if(index > -1) _state.reflexRules[index] = rr;
}

const _addReflexAction = (action: IReflexAction) => _state.reflexRule?.reflexActions?.push(action);

const _updateReflexAction = (action: IReflexAction) => {
    const index = _state.reflexRule?.reflexActions?.findIndex(x => x.uid === action.uid) || -1;
    if(index > -1) _state.reflexRule!.reflexActions[index] = action;
}

const _addReflexBrain = (brain: IReflexBrain) => {
    const action = _state.reflexRule?.reflexActions?.find(act => act.uid == brain.reflexActionUid);
    if(action) action.brains?.push(brain);
}

const _updateReflexBrain = (brain: IReflexBrain) => {
    let action = _state.reflexRule?.reflexActions?.find(act => act.uid == brain.reflexActionUid);
    if(action) {
        const index = action?.brains?.findIndex(x => x.uid === brain.uid) || -1;
        if(index > -1) action!.brains![index] = brain;
    }
}
