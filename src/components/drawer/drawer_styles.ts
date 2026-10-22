import { type Radius } from '#components/shared/radius';

export type DrawerSize = 'sm' | 'md' | 'lg';

export type DrawerSide = 'right' | 'left';

export const SIZE_CLASSES: Record<DrawerSize, string> = {
	sm: 'sm:w-[22.5rem]',
	md: 'sm:w-[26.25rem]',
	lg: 'sm:w-[32.5rem]',
};

export const SIDE_CLASSES: Record<DrawerSide, string> = {
	right: 'right-0',
	left: 'left-0',
};

/** Reduced motion keeps the panel in place so it only fades with its wrapper. */
export const OFFSCREEN_CLASSES: Record<DrawerSide, string> = {
	right: 'translate-x-full motion-reduce:translate-x-0',
	left: '-translate-x-full motion-reduce:translate-x-0',
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
