import { createStore } from 'vuex';

// root state
import { state } from './state';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

// modules
import { admin } from './modules/admin';
import { clients } from './modules/client';
import { patients } from './modules/patient';
import { samples } from './modules/sample';
import { analyses } from './modules/analysis';
import { cases } from './modules/cases';
import { worksheets } from './modules/worksheet';
import { markdown } from './modules/markdown';
import { kanban } from './modules/kanban';
import { toast } from './modules/toast';
import { setup } from './modules/setup';

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
    admin,
    clients,
    patients,
    samples,
    analyses,
    cases,
    worksheets,
    kanban,
    setup,
    toast,
    markdown,
  },
});
