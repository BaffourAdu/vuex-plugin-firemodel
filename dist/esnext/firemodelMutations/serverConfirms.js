/**
 * **serverConfirms**
 *
 * When the client originates an event, it first triggers `local` mutations
 * as the first part of the "two phased commit", then when this action is
 * validated by the Firebase DB it sends a confirm message.
 *
 * The goal of this plugin for _confirms_ is to do nothing more than handle the
 * event. If for some reason the consuming application wants to go further, they
 * may override the confirm funtions.
 */
export function serverConfirms(propOffset) {
    return {
        ["ADD_CONFIRMATION" /* serverAddConfirm */]() {
            //
        },
        ["CHANGE_CONFIRMATION" /* serverChangeConfirm */]() {
            console.log("server change confirmed");
        },
        ["REMOVE_CONFIRMATION" /* serverRemoveConfirm */]() {
            //
        }
    };
}
