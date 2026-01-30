import React from 'react';
import { addons, types } from 'storybook/manager-api';
import {
	THEME_STORAGE_KEY,
	getThemePreference,
	type ThemePreference,
} from '../../theme/index.ts';

const OPTIONS: { value: ThemePreference; label: string }[] = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'system', label: 'System' },
];

function ThemeTool() {
	const [preference, setPreference] =
		React.useState<ThemePreference>(getThemePreference);

	React.useEffect(() => {
		setPreference(getThemePreference());
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value as ThemePreference;
		window.localStorage.setItem(THEME_STORAGE_KEY, value);
		setPreference(value);
		window.top?.location?.reload();
	};

	return React.createElement(
		'select',
		{
			value: preference,
			onChange: handleChange,
			title: 'Theme',
			'aria-label': 'Theme',
			style: {
				margin: 0,
				padding: '4px 8px',
				border: '1px solid rgba(0,0,0,.1)',
				borderRadius: 4,
				background: 'var(--sb-manager-background-color, #fff)',
				color: 'var(--sb-manager-text-color, #333)',
				fontSize: 12,
				cursor: 'pointer',
			},
		},
		OPTIONS.map((opt) =>
			React.createElement(
				'option',
				{ key: opt.value, value: opt.value },
				opt.label
			)
		)
	);
}

function ThemePanel() {
	return React.createElement(
		'div',
		{
			style: {
				padding: 16,
				display: 'flex',
				flexDirection: 'column',
				gap: 12,
			},
		},
		React.createElement('strong', { style: { fontSize: 12 } }, 'Theme'),
		React.createElement(ThemeTool)
	);
}

addons.register('minimalstuff-ui/theme', () => {
	addons.add('minimalstuff-ui/theme/panel', {
		id: 'minimalstuff-ui/theme',
		title: 'Theme',
		type: types.PANEL,
		render: () => React.createElement(ThemePanel),
	});
	addons.add('minimalstuff-ui/theme/toolbar', {
		id: 'minimalstuff-ui/theme-toolbar',
		title: 'Theme',
		type: types.TOOL,
		render: () => React.createElement(ThemeTool),
	});
});
