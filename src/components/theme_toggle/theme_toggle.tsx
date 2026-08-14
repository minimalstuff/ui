import './theme_toggle.css';

import { useCallback, useEffect, useRef } from 'react';

import { type Theme } from '#types/theme';
import { type Radius } from '#components/shared/radius';
import { useThemeStore } from '#stores/theme_store/theme_store';
import { IconButton } from '#components/icon_button/icon_button';
import { useIsClient } from '#hooks/use_is_client/use_is_client';
import { getNextTheme, switchTheme } from '#lib/theme_transition';
import { type ButtonVariant } from '#components/shared/button_styles';

const THEME_ICON_CLASSES: Record<Theme, string> = {
	light: 'i-tabler-sun text-yellow-500',
	dark: 'i-tabler-moon-stars text-gray-700 dark:text-yellow-500',
	system: 'i-tabler-device-desktop text-blue-500',
};

const FALLBACK_ICON_CLASS = 'i-tabler-device-desktop text-gray-400';

interface ThemeToggleProps {
	isTransitionEnabled?: boolean;
	transitionDuration?: number;
	transitionEasing?: string;
	size?: 'sm' | 'md' | 'lg';
	radius?: Radius;
	variant?: ButtonVariant;
}

export function ThemeToggle({
	isTransitionEnabled = true,
	transitionDuration,
	transitionEasing,
	size = 'md',
	radius,
	variant,
}: Readonly<ThemeToggleProps>) {
	const theme = useThemeStore((state) => state.theme);
	const setTheme = useThemeStore((state) => state.setTheme);
	const isClient = useIsClient();
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		setTheme(useThemeStore.getState().theme);
	}, [setTheme]);

	const toggleTheme = useCallback(async () => {
		const newTheme = getNextTheme(theme);
		const element = buttonRef.current;

		if (element && isTransitionEnabled) {
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
			aria-label={`Thème actuel: ${theme}`}
			size={size}
			radius={radius}
			variant={variant}
			onClick={() => {
				void toggleTheme();
			}}
		/>
	);
}
