import { reactive } from "vue"
import { urqlClient } from '../urql';
import {
  GET_GROUPS_AND_PERMISSIONS
} from '../graphql/_queries';
import { IGroup } from "../models/auth"
import useNotifyToast from "./alert_toast";

const { gqlResponseHandler } = useNotifyToast();

const _state = reactive({
    groups: [] as IGroup[],
})

export default function useGroupPermComposable() {

    const fetchGroupsPerms = async () => {
        await urqlClient
          .query( GET_GROUPS_AND_PERMISSIONS )
          .toPromise()
          .then((res) => {
            const data = gqlResponseHandler(res)
            setGroups(data?.groupAll)
        });
    }

    const getRoles = () => {
        const final = new Map();
        for (const role of _state.groups) {
          final.set(role.name, role.name)
        }
        return final
    }

    return {
        state: _state, 
        fetchGroupsPerms,
        getRoles
    }
}

const setGroups = (groups: IGroup[]) => {
    _state.groups = groups;
}
