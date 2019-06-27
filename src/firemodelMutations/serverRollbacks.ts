import { MutationTree } from "vuex";
import { IDictionary } from "firemock";
import { FmCrudMutation } from "../types/mutations/FmCrudMutation";
import { Model } from "firemodel";
import { IFiremodelState } from "../types";
import { changeRoot } from "../shared/changeRoot";
import { updateList } from "../shared/updateList";

/**
 * **serverConfirms**
 *
 * When the client originates an event, it first triggers `local` mutations
 * as the first part of the "two phased commit", then when this action is
 * validated by the Firebase DB it sends a confirm message.
 *
 * The goal of this plugin for _rollbacks_ is to immediately change the state
 * back to what it had been before it had been optimistically set by the `local`
 * mutation.
 */
export function serverRollbacks<T extends Model>(
  propOffset?: keyof T
): MutationTree<T> {
  // default to "all"
  const offset = !propOffset ? ("all" as keyof T) : propOffset;

  return {
    [FmCrudMutation.serverAddRollback](state, payload) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.serverChangeRollback](state, payload) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    },

    [FmCrudMutation.serverRemoveRollback](state, payload) {
      const isRecord = payload.watcherSource === "record";
      if (isRecord) {
        changeRoot<T>(state, payload.value);
      } else {
        updateList<T>(state, offset, payload.value);
      }
    }
  };
}
