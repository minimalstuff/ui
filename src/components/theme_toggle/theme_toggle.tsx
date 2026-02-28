import { useIsClient } from '#hooks/use_is_client/use_is_client';
import { type Theme } from '#types/theme';
import { applyTheme } from '#utils/theme';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getNextTheme, switchTheme } from '../../lib/theme_transition';
import './theme_toggle.css';

function getIcon(theme: Theme): React.ReactNode {
	const iconClasses = {
		light: 'i-tabler-sun text-yellow-500',
		dark: 'i-tabler-moon-stars text-gray-700 dark:text-yellow-500',
		system: 'i-tabler-device-desktop text-blue-500',
	};

	return (
		<div
			className={clsx(iconClasses[theme], 'w-5 h-5')}
			style={{ width: 20, height: 20 }}
		/>
	);
}

interface ThemeToggleProps {
	isTransitionEnabled?: boolean;
	transitionDuration?: number;
	transitionEasing?: string;
}

export function ThemeToggle({
	isTransitionEnabled = true,
	transitionDuration,
	transitionEasing,
}: Readonly<ThemeToggleProps>) {
	const [theme, setTheme] = useState<Theme>('system');
	const isClient = useIsClient();
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') as Theme;
		requestAnimationFrame(() => {
			if (savedTheme) {
				setTheme(savedTheme);
				applyTheme(savedTheme);
			} else {
				setTheme('system');
				applyTheme('system');
			}
		});
	}, []);

	useEffect(() => {
		const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');

		const handleSystemThemeChange = () => {
			if (theme === 'system') {
				applyTheme('system');
			}
		};

		mediaQuery.addEventListener('change', handleSystemThemeChange);

		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		};
	}, [theme]);

	const toggleTheme = useCallback(async () => {
		const newTheme = getNextTheme(theme);
		const element = buttonRef.current;

		if (element && isTransitionEnabled) {
			await switchTheme({
				theme: newTheme,
				element,
				transitionDuration,
				transitionEasing,
				applyThemeCallback: applyTheme,
			});
		} else {
			applyTheme(newTheme);
		}

		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	}, [theme, isTransitionEnabled, transitionDuration, transitionEasing]);

	return (
		<button
			ref={buttonRef}
			onClick={toggleTheme}
			className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
			aria-label={`Thème actuel: ${theme}`}
		>
			{isClient ? (
				getIcon(theme)
			) : (
				<div
					className="i-tabler-device-desktop w-5 h-5 text-gray-400"
					style={{ width: '20px', height: '20px' }}
				/>
			)}
		</button>
	);
}
