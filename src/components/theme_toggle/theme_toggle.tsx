import './theme_toggle.css';

import { useCallback, useRef } from 'react';

import { type Theme } from '#types/theme';
import { isWebKitGtk } from '#lib/is_webkit_gtk';
import { type Radius } from '#components/shared/radius';
import { useLabels } from '#components/ui_provider/use_labels';
import { useThemeStore } from '#stores/theme_store/theme_store';
import { useIsClient } from '#hooks/use_is_client/use_is_client';
import { IconButton } from '#components/icon_button/icon_button';
import { getNextTheme, switchTheme } from '#lib/theme_transition';
import { type ButtonVariant } from '#components/shared/button_styles';
import { type IconButtonTooltip } from '#components/icon_button/icon_button_tooltip';

const THEME_ICON_CLASSES: Record<Theme, string> = {
	light: 'i-tabler-sun text-yellow-500',
	dark: 'i-tabler-moon-stars text-gray-700 dark:text-yellow-500',
	system: 'i-tabler-device-desktop text-blue-500',
};

const FALLBACK_ICON_CLASS = 'i-tabler-device-desktop text-gray-400';

export interface ThemeToggleProps {
	/**
	 * Animate the theme change with the View Transition API.
	 * Defaults to automatic: enabled, except on WebKitGTK where
	 * `startViewTransition` crashes the web process (2.54).
	 * `prefers-reduced-motion` is always respected.
	 */
	isTransitionEnabled?: boolean;
	transitionDuration?: number;
	transitionEasing?: string;
	size?: 'sm' | 'md' | 'lg';
	radius?: Radius;
	variant?: ButtonVariant;
	getAriaLabel?: (theme: Theme) => string;
	tooltip?: IconButtonTooltip;
}

export function ThemeToggle({
	isTransitionEnabled,
	transitionDuration,
	transitionEasing,
	size = 'md',
	radius,
	variant,
	getAriaLabel,
	tooltip,
}: Readonly<ThemeToggleProps>) {
	const theme = useThemeStore((state) => state.theme);
	const setTheme = useThemeStore((state) => state.setTheme);
	const labels = useLabels();
	const isClient = useIsClient();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const toggleTheme = useCallback(async () => {
		const newTheme = getNextTheme(theme);
		const element = buttonRef.current;

		const isTransitionActive =
			isTransitionEnabled ?? !isWebKitGtk(navigator.userAgent);

		if (element && isTransitionActive) {
			await switchTheme({
				theme: newTheme,
				element,
				transitionDuration,
				transitionEasing,
				applyThemeCallback: setTheme,
			});
		} else {
			setTheme(newTheme);
		}
	}, [
		theme,
		isTransitionEnabled,
		transitionDuration,
		transitionEasing,
		setTheme,
	]);

	const iconClass = isClient ? THEME_ICON_CLASSES[theme] : FALLBACK_ICON_CLASS;

	return (
		<IconButton
			ref={buttonRef}
			icon={iconClass}
			aria-label={(getAriaLabel ?? labels.currentTheme)(theme)}
			size={size}
			radius={radius}
			variant={variant}
			tooltip={tooltip}
			onClick={() => {
				void toggleTheme();
			}}
		/>
	);
}
