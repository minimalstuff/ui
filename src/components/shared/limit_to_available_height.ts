import { size, type Middleware } from '@floating-ui/react-dom';

import { FLOATING_VIEWPORT_PADDING } from '#components/shared/floating';

/** CSS custom property holding the room left in the viewport, set on the floating element. */
const FLOATING_MAX_HEIGHT_PROPERTY = '--ms-floating-max-height';

/**
 * `size()` middleware that publishes the height still free in the viewport as
 * `--ms-floating-max-height`. The panel inside the floating element caps its
 * own height with it (`ms-floating-panel-scroll`), because a percentage
 * max-height would not resolve against the auto-sized floating element.
 * Place it after `flip()` so it measures the side the panel ends up on.
 */
export function limitToAvailableHeight(): Middleware {
	return size({
		padding: FLOATING_VIEWPORT_PADDING,
		apply({ availableHeight, elements }) {
			elements.floating.style.setProperty(
				FLOATING_MAX_HEIGHT_PROPERTY,
				`${Math.max(0, availableHeight)}px`
			);
		},
	});
}
