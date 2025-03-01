import { IDictionary, epoch } from "common-types";
import { IFirebaseClientConfig, DB } from "abstracted-client";
import { Watch, Record, List, Model, IModelOptions } from "firemodel";
import { Commit, Dispatch } from "vuex";
import { IAuthPersistenceStrategy } from "./auth";
import { FirebaseAuth } from "@firebase/auth-types";
import { IFiremodelState } from "./firemodel";
export declare type IFmLifecycleContext<T> = IFmAuthenticatatedContext<T> | IFmConnectedContext<T> | IFmLoginEventContext<T> | IFmLogoutEventContext<T> | IFmUserChangeEventContext<T> | IFmRouteEventContext<T>;
/** the base properties which all events have */
export interface IFmEventBase<T> {
    Watch: typeof Watch;
    Record: typeof Record;
    List: typeof List;
    /** dispatcher to Vuex for asynchronous change */
    dispatch: Dispatch;
    /** commit to Vuex for direct state change */
    commit: Commit;
    /** the root state of Vuex */
    state: T & {
        "@firemodel": IFiremodelState<T>;
    };
}
/**
 * Once connected to the Auth API, the Auth API
 * is provided as context for all subsequent events
 */
export interface IFmAuthenticatatedContext<T> extends IFmEventBase<T>, IFmConnectedContext<T> {
    /** the full Firebase AUTH api */
    auth: FirebaseAuth;
    /** the logged in user's UID (if logged in) */
    uid?: string;
    /** a flag indicating whether the user is anonymous or not */
    isAnonymous?: boolean;
    /** is there a logged in user; anonymous or otherwise */
    isLoggedIn?: boolean;
}
export interface IFmConnectedContext<T> extends IFmEventBase<T> {
    /** the database configuration that was used */
    config: IFiremodelConfig<T>;
    /** the connection to the DB via `abstracted-client` */
    db: DB;
}
/** Context provided to a _logged in_ user */
export interface IFmLoginEventContext<T> extends IFmEventBase<T>, IFmConnectedContext<T>, IFmAuthenticatatedContext<T> {
    /** the logged in user's `uid` */
    uid: string;
    email?: string | null;
    emailVerified: boolean;
    /** a flag indicating whether the user is anonymous or not */
    isAnonymous: boolean;
    /** is there a logged in user; anonymous or otherwise */
    isLoggedIn: true;
}
export interface IFmLogoutEventContext<T> extends IFmEventBase<T>, IFmConnectedContext<T>, IFmAuthenticatatedContext<T> {
    uid: undefined;
    email: null;
    emailVerified: false;
    isLoggedIn: false;
    isAnonymous: false;
}
/**
 * Context provided to a user who is _connected_ but not _logged into_ the
 * Firebase database
 */
export interface IFmLogoutEventContext<T> extends IFmConnectedContext<T>, IFmEventBase<T> {
}
/**
 * When a Firebase user changes due to _abandonment_ of an anonymous user
 * in favor of a logged in user there may be cases where aspects of the old
 * profile need to be brought over to the new profile.
 */
export interface IFmUserChangeEventContext<T> extends IFmLoginEventContext<T> {
    priorUid: string;
    /**
     * this is a hash of user properties that are being moved from the old user
     * to the new
     */
    priorProfile?: IDictionary;
}
export interface IFmRouteEventContext<T> extends IFmEventBase<T> {
    /** the route which was _left_ */
    leaving: string;
    /** the route which was _entered_ */
    entering: string;
    /** the Query parameters on the entering route */
    queryParams: IDictionary;
}
export declare type FmCallback = () => Promise<void>;
export declare type IFmOnConnect<T> = (ctx: IFmConnectedContext<T>) => Promise<void>;
export declare type IFmOnDisconnect<T> = (ctx: IFmEventBase<T>) => Promise<void>;
export declare type IFmOnLogin<T> = (ctx: IFmLoginEventContext<T>) => Promise<void>;
export declare type IFmOnLogout<T> = (ctx: IFmAuthenticatatedContext<T>) => Promise<void>;
export declare type IFmUserUpgrade<T> = (ctx: IFmUserChangeEventContext<T>) => Promise<void>;
export declare type IFmRouteChanged<T> = (ctx: IFmRouteEventContext<T>) => Promise<void>;
/**
 * **Firemodel Config**
 *
 * This configuration requires that you provide a means to connect to the DB
 * and then allows you to do two things:
 *
 * 1. Turn on/off core services of this plugin
 * 2. Hook into _lifecycle_ events (typically to watch/unwatch certain db paths)
 */
export interface IFiremodelConfig<T> extends IFiremodelLifecycleHooks<T>, IFiremodelPluginCoreServices {
    /**
     * Firemodel must be able to connect to the database -- using
     * `abstracted-client` to do so -- and therefore the configuration
     * must include either a Firebase Config (and this plugin will
     * create an instance of `abstracted-client`) or you can just pass
     * in an instance of abstracted client here as well.
     */
    db: IFirebaseClientConfig;
    /**
     * A flag which which determines whether the database connection should be
     * established immediately on this plugin's initialization.
     *
     * Default is `true`
     */
    connect?: boolean;
}
export interface IFiremodelPluginCoreServices {
    /**
     * **Use Auth**
     *
     * This turns on usage of Firebase's Authentication/Authorization
     * solution. When this is turned on this plugin will ensure
     * that the `@firemodel/currentUser` is kept up-to-date
     * and also that the `onLoggedIn` and `onLoggedOut` lifecycle
     * events are fired.
     *
     * If not stated, this option defaults to `false`.
     */
    useAuth?: boolean;
    /**
     * If you are using Firebase's **Auth** module you can state the
     * persistance model you would like to use. The types and descriptions
     * are made available on the `AuthPersistenceStrategy` enumeration.
     *
     * [Reference Doc](https://firebase.google.com/docs/auth/web/auth-state-persistence)
     */
    authPersistence?: IAuthPersistenceStrategy;
    /**
     * **Anonymous Auth**
     *
     * Once Firebase has connected to the DB, this service
     * will ensure that the user is logged in. Of course if
     * a user already had a valid token/session then it's
     * normal for **Firebase** to reconnect you but in the
     * cases where there is no valid token, this service will
     * login the user as an _anonymous_ user.
     *
     * If not stated, this option defaults to `false`.
     */
    anonymousAuth?: boolean;
    /**
     * **Watch Route Changes**
     *
     * if your project is using the popular vuex plugin
     */
    watchRouteChanges?: boolean;
}
export interface IFiremodelLifecycleHooks<T> {
    /**
     * A callback function which is executed any time the
     * database is connected
     */
    onConnect?: IFmOnConnect<T>;
    /**
     * A callback function which is executed when the
     * database is disconnected
     */
    onDisconnect?: IFmOnDisconnect<T>;
    /**
     * A callback function which is executed when firebase
     * logs in; this is true for both anonymous and known
     * users
     */
    onLogin?: IFmOnLogin<T>;
    /**
     * A callback function which is executed when firebase
     * is logged out of (aka, not authenticated)
     */
    onLogout?: IFmOnLogout<T>;
    /**
     * A callback function which is executed when firebase
     * upgrades an "anonymous" user to a "known" user
     */
    onUserUpgrade?: IFmUserUpgrade<T>;
    /**
     * the path in the state tree where the "route" can be found;
     * it defaults to "route"
     */
    pathToRouterSync?: "route" | string;
    /**
     * A callback function which is executed every time the
     */
    onRouteChange?: IFmRouteChanged<T>;
}
export declare type IFmEventActions = "add" | "update" | "remove" | "unknown";
export interface IFmLocalChange<T extends Model = Model> {
    /** the location in the database */
    dbPath: string;
    /** the CRUD action */
    action: IFmEventActions;
    /** the location in local state management */
    localPath: string;
    /** the new value that has been set locally */
    value: T;
    /** when the local change was made */
    timestamp: epoch;
}
export declare type IFmModelConstructor<T extends Model = Model> = new () => T;
export declare type IFmLifecycleEvents = "connected" | "disconnected" | "logged-in" | "logged-out" | "user-upgraded" | "user-abandoned" | "route-changed";
export interface IFmQueuedAction<T> {
    /** a descriptive name for the queued action */
    name: string;
    /**
     * Lifecycle events which will trigger the
     * given queued action
     */
    on?: IFmLifecycleEvents;
    /** the callback function */
    cb: IFmQueueCallback<T>;
    /**
     * if this action was run but resulted in an error then
     * the error will be captured here
     */
    errorMessage?: string;
    errorStack?: string[];
}
export interface IFmWatchItem {
    /** the id assigned to the watcher when started */
    watchId: string;
    /** the database path where the record is found */
    dbPath: string;
    /** where in the local state tree this record should be synced */
    localPath: string;
}
export declare type IFmQueueCallback<T> = (ctx: IFmEventBase<T>) => Promise<void>;
export interface IFmActionWatchRecord {
    id: string;
    model: IFmModelConstructor;
    options: IModelOptions;
    on: IFmLifecycleEvents;
}
export interface IRouteSyncChange {
    readonly path: string;
    readonly params: IDictionary;
    readonly query: IDictionary;
}
export interface IRouteState {
    fullPath: string;
    hash: string;
    meta: IDictionary;
    name: string | null;
    params: IDictionary;
    path: string;
    query: IDictionary;
}
