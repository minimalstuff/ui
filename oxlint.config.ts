import { minimalstuffPreset } from '@minimalstuff/tooling/oxc/lint';

const COMPONENT_FILES = ['src/components/**'];

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
	],
});
