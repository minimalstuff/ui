import { minimalstuffPreset } from '@minimalstuff/tooling/oxc/lint';

const COMPONENT_FILES = ['src/components/**'];

/**
 * API Extractor crashes when the root entry re-exports the barrels through
 * subpath imports, so it keeps relative paths.
 */
const ROOT_ENTRY_FILES = ['src/index.ts'];

/**
 * Components implement WAI-ARIA patterns by hand: custom roles on divs,
 * backdrop mouse dismissal mirrored by Escape, a native-checked role=switch,
 * roving-focus containers and intentional autofocus. These rules assume native
 * elements and conflict with that design.
 */
const ARIA_WIDGET_CONFLICTING_RULES = [
	'jsx-a11y/prefer-tag-over-role',
	'jsx-a11y/no-noninteractive-element-to-interactive-role',
	'jsx-a11y/click-events-have-key-events',
	'jsx-a11y/no-static-element-interactions',
	'jsx-a11y/no-noninteractive-element-interactions',
	'jsx-a11y/interactive-supports-focus',
	'jsx-a11y/role-has-required-aria-props',
	'jsx-a11y/no-autofocus',
];

/** The deprecated toast API (`ToastProvider`, `useToast`) stays published and is still implemented, exported and tested here. */
const DEPRECATED_TOAST_API_FILES = [
	'src/components/toast/**',
	'src/components/index.ts',
	'src/components/ssr.test.tsx',
];

export default minimalstuffPreset({
	react: true,
	vitest: true,
	ignorePatterns: ['**/*.md'],
	overrides: [
		{
			files: COMPONENT_FILES,
			rules: Object.fromEntries(
				ARIA_WIDGET_CONFLICTING_RULES.map((rule) => [rule, 'off'])
			),
		},
		{
			files: DEPRECATED_TOAST_API_FILES,
			rules: { 'typescript/no-deprecated': 'off' },
		},
		{
			files: ROOT_ENTRY_FILES,
			rules: { 'no-restricted-imports': 'off' },
		},
	],
});
