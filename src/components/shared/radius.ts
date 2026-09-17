export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const RADIUS_CLASSES: Record<Radius, string> = {
	none: 'rounded-none',
	sm: 'rounded-sm',
	md: 'rounded-md',
	lg: 'rounded-lg',
	xl: 'rounded-xl',
	full: 'rounded-full',
};

/**
 * Panels are taller than they are round: `rounded-full` would bow their sides
 * into an ellipse, so the panel scale caps at the largest corner that still
 * reads as a rectangle.
 */
export const PANEL_RADIUS_CLASSES: Record<Radius, string> = {
	...RADIUS_CLASSES,
	full: RADIUS_CLASSES.lg,
};
