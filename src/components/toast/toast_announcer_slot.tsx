/**
 * @internal empty live regions rendered inside an open Modal or Drawer, so
 * toasts are announced from within the `aria-modal` subtree. The Toaster
 * writes into them. Not part of the public API.
 */
export const ToastAnnouncerSlot = () => (
	<>
		<div role="status" className="sr-only" data-ms-toast-announcer="polite" />
		<div role="alert" className="sr-only" data-ms-toast-announcer="assertive" />
	</>
);
