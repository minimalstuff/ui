import type { Theme } from '#types/theme';

const DEFAULT_TRANSITION_DURATION = 750;
const DEFAULT_TRANSITION_EASING = 'ease-in-out';

interface SwitchThemeProps {
	theme: Theme;
	element: HTMLElement;
	transitionDuration?: number;
	transitionEasing?: string;
	applyThemeCallback: (theme: Theme) => void;
}

export async function switchTheme({
	theme,
	element,
	transitionDuration = DEFAULT_TRANSITION_DURATION,
	transitionEasing = DEFAULT_TRANSITION_EASING,
	applyThemeCallback,
}: SwitchThemeProps) {
	if (
		!document.startViewTransition ||
		globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
	) {
		applyThemeCallback(theme);
		return;
	}

	const { top, left, width, height } = element.getBoundingClientRect();
	const x = left + width / 2;
	const y = top + height / 2;
	const right = globalThis.innerWidth - x;
	const bottom = globalThis.innerHeight - y;
	const radius = Math.hypot(Math.max(x, right), Math.max(y, bottom));

	await document.startViewTransition(() => {
		applyThemeCallback(theme);
	}).ready;

	document.documentElement.animate(
		{
			clipPath: [
				`circle(0px at ${x}px ${y}px)`,
				`circle(${radius}px at ${x}px ${y}px)`,
			],
		},
		{
			duration: transitionDuration,
			easing: transitionEasing,
			pseudoElement: '::view-transition-new(root)',
		}
	);
}

export function getNextTheme(prev: Theme): Theme {
	if (prev === 'light') return 'dark';
	if (prev === 'dark') return 'system';
	return 'light';
}
