import { IconButton } from '#components/icon_button/icon_button';
import { useIsClient } from '#hooks/use_is_client/use_is_client';
import { type Theme } from '#types/theme';
import {
	followThemeState,
	getCurrentTheme,
	setCurrentTheme,
} from '#utils/theme';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getNextTheme, switchTheme } from '../../lib/theme_transition';
import './theme_toggle.css';

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
}

export function ThemeToggle({
	isTransitionEnabled = true,
	transitionDuration,
	transitionEasing,
	size = 'md',
}: Readonly<ThemeToggleProps>) {
	const [theme, setTheme] = useState<Theme>('system');
	const isClient = useIsClient();
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const currentTheme = getCurrentTheme();
		requestAnimationFrame(() => {
			setTheme(currentTheme);
			setCurrentTheme(currentTheme);
		});

		return followThemeState((nextTheme) => {
			setTheme(nextTheme);
		});
	}, []);

	const toggleTheme = useCallback(async () => {
		const newTheme = getNextTheme(theme);
		const element = buttonRef.current;

		if (element && isTransitionEnabled) {
			await switchTheme({
				theme: newTheme,
				element,
				transitionDuration,
				transitionEasing,
				applyThemeCallback: setCurrentTheme,
			});
		} else {
			setCurrentTheme(newTheme);
		}
	}, [theme, isTransitionEnabled, transitionDuration, transitionEasing]);

	const iconClass = isClient ? THEME_ICON_CLASSES[theme] : FALLBACK_ICON_CLASS;

	return (
		<IconButton
			ref={buttonRef}
			icon={iconClass}
			aria-label={`Thème actuel: ${theme}`}
			size={size}
			onClick={() => {
				void toggleTheme();
			}}
			className="!bg-gray-100 dark:!bg-gray-700/50 border border-gray-200 dark:border-gray-600 !hover:bg-gray-200 dark:!hover:bg-gray-600 transition-all duration-200"
		/>
	);
}
