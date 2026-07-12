/**
 * A no-op error handler for subscriptions to CartApi observables.
 *
 * CartApi already records failures in CartStore.error (surfaced in the UI),
 * so callers don't need to do anything further on error — this just
 * prevents RxJS from raising an unhandled-error console warning for
 * requests that have already been handled at the store level.
 */
export function ignoreHandledError(): void {
  // Intentionally empty — see comment above.
}
