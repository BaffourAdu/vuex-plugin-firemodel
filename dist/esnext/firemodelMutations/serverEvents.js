import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";
export function serverEvents(propOffset) {
    return {
        ["SERVER_ADD" /* serverAdd */](
        /**
         * either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            const isRecord = payload.watcherSource === "record";
            state = isRecord
                ? changeRoot(state, payload.value)
                : propOffset
                    ? state[propOffset].push(payload.value)
                    : state.push(payload.value);
        },
        ["SERVER_CHANGE" /* serverChange */](
        /**
         * either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (payload.value === null) {
                // a "remove" event will also be picked up by the "change" event
                // passed by Firebase. This mutation will be ignored with the
                // assumption that the "remove" mutation will handle the state
                // change.
                return;
            }
            const ids = isRecord
                ? []
                : propOffset
                    ? state[propOffset].map((i) => i.id)
                    : state.map((i) => i.id);
            if (!isRecord && ids.includes(payload.value.id)) {
                // The "change" is to a record which did not previously
                // exist. This is because "change" is a superset of add/remove/update.
                // It is asssumed in this case that the "serverAdd" event will have
                // taken care of the needed state change.
                return;
            }
            if (isRecord) {
                changeRoot(state, payload.value);
            }
            else {
                propOffset
                    ? updateList(state, propOffset, payload.value)
                    : updateList(state, undefined, payload.value);
            }
        },
        ["SERVER_REMOVE" /* serverRemove */](
        /**
         * either a dictionary which includes the "offsetProp" or the array
         * of records at the root of the state structure
         */
        state, payload) {
            const isRecord = payload.watcherSource === "record";
            if (isRecord) {
                changeRoot(state, null);
            }
            else {
                // TODO: need to ensure that the payload.value is indeed "NULL";
                // alternatively need to understand why typing is getting confused by
                propOffset
                    ? updateList(state, propOffset, payload.value)
                    : updateList(state, undefined, null);
            }
        }
    };
}