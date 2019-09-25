import { MutationTree } from "vuex";
import { Model } from "firemodel";
import { IDictionary } from "firemock";
export declare type ListPropertyCandidates<T> = Pick<T, {
    [K in keyof T]: T[K] extends Model[] ? K : never;
}[keyof T]>;
/**
 * **firebaseMutations**
 *
 * A prepacked set of mutations which will handle all the mutations
 * which the **Firemodel Vuex Plugin** will send relating to CRUD based
 * changes to the underlying Firebase database.
 *
 * These mutations can/should be brought into parts of the state tree which
 * are managed by a Firemodel `Model` (and are being "watched" by your frontend).
 * This export is able to manage the mutations for both `record` and `list` based
 * watchers.
 *
 * An example of how to incorporate into your state tree:
```typescript
const vuexModule: Module<IMyStateModule, IRootState> = {
    state,
    ...firemodelMutations(),
    getters,
    namespaced: true
}
```
 */
export declare function firemodelMutations<T extends IDictionary>(
/**
 * If you are using a **list** based watcher you will almost always want
 * the list of records to be "offset" from the root of the local state
 * module. If not stated, this property will be offset to `all` but you can
 * explicitly set it to whatever you like including an empty string which will
 * in effect put the list onto the root of the local state module.
 *
 * In the case of a **record** based watcher you should typically leave this property
 * `undefined` but if you have an edge case then you can set it to whatever you like
 * and it will honored.
 */
propOffset?: keyof T & string): MutationTree<T>;
