import { type Radius } from '#components/shared/radius';

export type DrawerSize = 'sm' | 'md' | 'lg';

export type DrawerSide = 'right' | 'left';

export const SIZE_CLASSES: Record<DrawerSize, string> = {
	sm: 'ms-drawer-width-sm',
	md: 'ms-drawer-width-md',
	lg: 'ms-drawer-width-lg',
};

export const SIDE_CLASSES: Record<DrawerSide, string> = {
	right: 'right-0',
	left: 'left-0',
};

/** Reduced motion keeps the panel in place so it only fades with its wrapper. */
export const OFFSCREEN_CLASSES: Record<DrawerSide, string> = {
	right: 'ms-drawer-offscreen-right',
	left: 'ms-drawer-offscreen-left',
};

export const ONSCREEN_CLASSES = 'translate-x-0';

/** Only the corners on the edge facing the page are rounded; the other edge sits flush against the viewport. */
export const INNER_EDGE_RADIUS_CLASSES: Record<
	DrawerSide,
	Record<Radius, string>
> = {
	right: {
		none: 'rounded-l-none',
		sm: 'rounded-l-sm',
		md: 'rounded-l-md',
		lg: 'rounded-l-lg',
		xl: 'rounded-l-xl',
		full: 'rounded-l-lg',
	},
	left: {
		none: 'rounded-r-none',
		sm: 'rounded-r-sm',
		md: 'rounded-r-md',
		lg: 'rounded-r-lg',
		xl: 'rounded-r-xl',
		full: 'rounded-r-lg',
	},
};
