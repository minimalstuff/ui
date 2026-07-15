export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const RADIUS_CLASSES: Record<Radius, string> = {
	none: 'rounded-none',
	sm: 'rounded-sm',
	md: 'rounded-md',
	lg: 'rounded-lg',
	xl: 'rounded-xl',
	full: 'rounded-full',
};
