import { ActionTree } from "vuex";
import { IFiremodelState, IGenericStateTree } from "../..";
import { FmEvents, IFmWatchEvent } from "firemodel";
import { FmCrudMutation } from "../../types/mutations/FmCrudMutation";
import { determineLocalStateNode } from "../../shared/determineLocalStateNode";

export const recordConfirms: ActionTree<IFiremodelState, IGenericStateTree> = {
  [FmEvents.RECORD_ADDED_CONFIRMATION](
    { commit, state },
    payload: IFmWatchEvent
  ) {
    commit(FmCrudMutation.serverAddConfirm, payload);
    commit(
      determineLocalStateNode(payload, FmCrudMutation.serverAddConfirm),
      payload,
      {
        root: true
      }
    );
  },

  [FmEvents.RECORD_CHANGED_CONFIRMATION](
    { commit, state },
    payload: IFmWatchEvent
  ) {
    commit(FmCrudMutation.serverChangeConfirm, payload);
    commit(
      determineLocalStateNode(payload, FmCrudMutation.serverChangeConfirm),
      payload,
      {
        root: true
      }
    );
  },

  [FmEvents.RECORD_REMOVED_CONFIRMATION](
    { commit, state },
    payload: IFmWatchEvent
  ) {
    commit(FmCrudMutation.serverRemoveConfirm, payload);
    commit(
      determineLocalStateNode(payload, FmCrudMutation.serverChangeRollback),
      payload,
      {
        root: true
      }
    );
  }
};
