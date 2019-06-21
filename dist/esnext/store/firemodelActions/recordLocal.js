import { FmEvents } from "firemodel";
import get from "lodash.get";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";
export const recordLocal = {
    [FmEvents.RECORD_CHANGED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign({}, payload, { priorValue: get(rootState, payload.localPath) });
        commit("CHANGED_LOCALLY" /* changedLocally */, payloadPlus);
        commit(determineLocalStateNode(payload, "CHANGED_LOCALLY" /* changedLocally */), payloadPlus, {
            root: true
        });
    },
    [FmEvents.RECORD_ADDED_LOCALLY]({ commit, rootState }, payload) {
        const payloadPlus = Object.assign({}, payload, { priorValue: get(rootState, payload.localPath) });
        commit("ADDED_LOCALLY" /* addedLocally */, payloadPlus);
        commit(determineLocalStateNode(payload, "ADDED_LOCALLY" /* addedLocally */), payloadPlus, {
            root: true
        });
    },
    [FmEvents.RECORD_REMOVED_LOCALLY]({ commit }, payload) {
        commit("REMOVED_LOCALLY" /* removedLocally */, payload);
        commit(determineLocalStateNode(payload, "REMOVED_LOCALLY" /* removedLocally */), payload, {
            root: true
        });
    }
};