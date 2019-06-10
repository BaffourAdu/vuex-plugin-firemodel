import { FmConfigAction } from "./FmConfigActions";
import { actionsCrud } from "../../store/actionsCrud";
import { FmEvents } from "firemodel";
export * from "./FmConfigActions";

export type IFmConfigActions = keyof typeof FmConfigAction;
export type IFmCrudActions = keyof typeof FmEvents;
export type IFmActions = IFmConfigActions & IFmCrudActions;
