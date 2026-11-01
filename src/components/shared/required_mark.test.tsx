import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Checkbox } from '#components/checkbox/checkbox';
import { RadioOptions } from '#components/radio_options/radio_options';
import { Switch } from '#components/switch/switch';

const OPTIONS = [{ value: 'a', label: 'Option A' }];

const REQUIRED_CASES = [
	{
		name: 'Checkbox',
		role: 'checkbox',
		controlRole: 'checkbox',
		element: <Checkbox label="Accept" required />,
	},
	{
		name: 'Switch',
		role: 'switch',
		controlRole: 'switch',
		element: <Switch label="Accept" required />,
	},
	{
		name: 'RadioOptions',
		role: 'radiogroup',
		controlRole: 'radio',
		element: <RadioOptions options={OPTIONS} label="Accept" required />,
	},
];

describe('required indicator', () => {
	test.each(REQUIRED_CASES)(
		'should not include the asterisk in the accessible name of $name when required',
		({ role, element }) => {
			render(element);

			expect(screen.getByRole(role)).toHaveAccessibleName('Accept');
		}
	);

	test.each(REQUIRED_CASES)(
		'should expose $name as required natively when required',
		({ controlRole, element }) => {
			render(element);

			expect(screen.getByRole(controlRole)).toBeRequired();
		}
	);

	test.each(REQUIRED_CASES)(
		'should hide the asterisk of $name from assistive technology when required',
		({ element }) => {
			render(element);

			expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
		}
	);
});
