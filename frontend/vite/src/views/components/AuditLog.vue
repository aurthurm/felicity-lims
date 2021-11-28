<template>
    <div class="relative mt-4">
        <div class="border-r-2 border-gray-400 border-dotted absolute h-full top-0 z-0" style="left: 7px"></div>
        <ul class="list-none m-0 p-0">
            <li 
            v-for="log in auditLogs" :key="log.uid"
            class="mb-2">
                <div class="flex items-center mb-1">
                    <div class="bg-indigo-600 rounded-full h-4 w-4 border-gray-200 border-2 z-10">
                    </div>
                    <div class="ml-4 font-medium">
                        <span> {{ translateUser(log?.userId) }} {{ translateAction(log?.action) }} {{ log?.targetType }} </span>
                        on <span> {{ parseDate(log?.stateAfter?.updated_at) }}</span>
                    </div>
                </div>
                <div class="ml-12 w-100">
                     <div v-for="trail of changes(log)" class="grid grid-cols-4">
                        <span class="col-span-1">
                            <span class="text-sm text-gray-600 italic">{{trail?.key}}</span>
                        </span>
                        <span class="col-span-3">
                            <span class="text-muted text-xs text-red-400">{{trail?.old}}</span> 
                            &rarr; 
                            <span class="text-muted text-xs text-green-400">{{trail?.new}}</span>
                        </span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex';
import { ActionTypes } from '../../store/actions'
import { parseDate } from '../../utils'

export default {
    name: "tab-logs",
    props: {
        targetId: Number,
        targetType: String
    },
    setup(props){
        const store = useStore();

        const { targetType, targetId } = toRefs(props);

        store.dispatch(ActionTypes.FETCH_USERS)
        store.dispatch(ActionTypes.RESET_AUDIT_LOGS)
        store.dispatch(ActionTypes.FETCH_AUDIT_LOGS, { targetType: targetType.value, targetId: targetId.value })

        let auditLogs = computed(() => store.getters.getAuditLogs)
        let users = computed(() => store.getters.getUsers)

        function translateUser(userId: any): string {
            const user = users?.value?.find((u: any) => u['uid']?.toString() === userId?.toString())
            if(!user) return '';
            // console.log(user['firstName'], user['lastName'], user['auth']['userName'])
            return user['auth']['userName']
        }

        function translateAction(action: number): string {
            if(action === 1) return "created"
            if(action === 2) return "updated"
            if(action === 3) return "deleted"
            return '';
        }

        function changes(log: any): any {
            let trails = new Set();
            
            Object.entries(log?.stateBefore)?.map(([keyB, valueB]) => {
                Object.entries(log?.stateAfter)?.map(([keyA, valueA]) => {
                    if((keyB === keyA) && (valueB !== valueA)) {

                        // dates parsing

                        // user_uids translation
                        if(keyA && keyA === 'updated_by_uid'){
                            keyA = 'updated_by'
                            valueB = translateUser(valueB)
                            valueA = translateUser(valueA)
                        }
                        if(keyA && keyA === 'submitted_by_uid'){
                            keyA = 'submitted_by'
                            valueB = translateUser(valueB)
                            valueA = translateUser(valueA)
                        }
                        if(keyA && keyA === 'verified_by_uid'){
                            keyA = 'verified_by'
                            valueB = translateUser(valueB)
                            valueA = translateUser(valueA)
                        }
                        if(keyA && keyA === 'updated_at'){
                            keyA = 'updated_on'
                            valueB = parseDate(valueB)
                            valueA = parseDate(valueA)
                        }

                        trails.add({
                            key: keyA,
                            old: valueB,
                            new: valueA,
                        })
                    }
                })
            })
            return trails;
        }

        return {
            auditLogs,
            changes,
            parseDate,
            translateUser,
            translateAction
        }
    }
}
</script>