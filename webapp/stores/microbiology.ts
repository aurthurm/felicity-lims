import {defineStore} from 'pinia';

import useApiUtil from '@/composables/api_util';

const {withClientQuery, withClientMutation} = useApiUtil();

export const useMicrobiologyStore = defineStore('microbiology', {
    state: () => {
        return {
            antibiotics: [],
            organisms: [],
            organismSerotypes: [],
            breakpoints: [],
            astPanels: [],
        }
    },
    getters: {},
    actions: {}
});
