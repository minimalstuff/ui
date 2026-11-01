import {
	DocsContainer,
	type DocsContainerProps,
} from '@storybook/addon-docs/blocks';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';

import { getDocsTheme } from '#storybook/theme/docs_theme';
import {
	getThemePreference,
	isThemePreference,
	type ThemePreference,
} from '#storybook/theme/index';

type GlobalsUpdatedPayload = { globals: { theme?: unknown } };

/**
 * Docs container that follows the toolbar theme global, so the docs page
 * changes theme in place instead of needing a reload.
 */
export function ThemedDocsContainer({
	context,
	children,
}: Readonly<PropsWithChildren<DocsContainerProps>>) {
	const [preference, setPreference] =
		useState<ThemePreference>(getThemePreference);

	useEffect(() => {
		const handleGlobalsUpdated = ({ globals }: GlobalsUpdatedPayload) => {
			if (isThemePreference(globals.theme)) setPreference(globals.theme);
		};
		context.channel.on(GLOBALS_UPDATED, handleGlobalsUpdated);
		return () => context.channel.off(GLOBALS_UPDATED, handleGlobalsUpdated);
	}, [context.channel]);

	return (
		<DocsContainer context={context} theme={getDocsTheme(preference)}>
			{children}
		</DocsContainer>
	);
}
