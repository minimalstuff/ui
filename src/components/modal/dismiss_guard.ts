/**
 * Decides whether a user dismissal (Escape, backdrop click, close button) of
 * a `Modal` or `Drawer` may proceed: `true` lets it through, `false` keeps the
 * dialog open. May be async, e.g. to ask for confirmation.
 */
export type DismissGuard = () => boolean | Promise<boolean>;
