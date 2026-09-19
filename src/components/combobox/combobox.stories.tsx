import { type FormEvent, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Combobox, type ComboboxOption } from './combobox';
import { expectFocusOn } from '../../../.storybook/play_helpers';

const defaultOptions: ComboboxOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'orange', label: 'Orange' },
];

const meta = {
	title: 'Example/Combobox',
	component: Combobox,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
			description: 'Label above the combobox',
		},
		error: {
			control: 'text',
			description: 'Error message below the combobox',
		},
		placeholder: {
			control: 'text',
			description: 'Placeholder shown when nothing is selected',
		},
		noResultsText: {
			control: 'text',
			description: 'Text shown when the search matches nothing',
		},
		disabled: {
			control: 'boolean',
			description: 'Disable the combobox',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius',
		},
		unstyled: {
			control: 'boolean',
			description: 'Strip all built-in styling',
		},
	},
	args: {
		options: defaultOptions,
		placeholder: 'Search a fruit...',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithLabel: Story = {
	args: {
		label: 'Fruit',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: 'Fruit' });

		await step('Tab focuses the combobox without opening it', async () => {
			await userEvent.tab();
			await expectFocusOn(combobox);
			await expect(combobox).toHaveAttribute('aria-expanded', 'false');
		});

		await step(
			'ArrowDown opens the listbox with the first option active',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				await expect(combobox).toHaveAttribute('aria-expanded', 'true');
				await expect(combobox).toHaveAttribute('aria-activedescendant');
			}
		);

		await step(
			'Enter selects the active option and closes the list',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expect(combobox).toHaveValue('Apple');
				await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
			}
		);

		await step('Tab moves focus to the clear button', async () => {
			await userEvent.tab();
			await expectFocusOn(
				canvas.getByRole('button', { name: 'Clear selection' })
			);
		});

		await step(
			'activating the clear button empties the value and refocuses the input',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expectFocusOn(combobox);
				await expect(combobox).toHaveValue('');
			}
		);
	},
};

export const WithError: Story = {
	args: {
		label: 'Fruit',
		error: 'Please select a fruit',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Fruit',
		disabled: true,
	},
};

export const Required: Story = {
	args: {
		label: 'Fruit',
		required: true,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step(
			'the combobox is marked as required for assistive tech',
			async () => {
				await expect(canvas.getByRole('combobox')).toHaveAttribute(
					'aria-required',
					'true'
				);
			}
		);
	},
};

export const Controlled: Story = {
	args: {
		label: 'Fruit',
		value: 'banana',
	},
};

export const ManyOptions: Story = {
	args: {
		label: 'Country',
		placeholder: 'Search a country...',
		options: [
			{ value: 'fr', label: 'France' },
			{ value: 'de', label: 'Germany' },
			{ value: 'es', label: 'Spain' },
			{ value: 'it', label: 'Italy' },
			{ value: 'gb', label: 'United Kingdom' },
			{ value: 'us', label: 'United States' },
		],
	},
};

const LONG_LIST_OPTION_COUNT = 30;
const LONG_LIST_ARROW_DOWN_PRESSES = 20;

const longListOptions: ComboboxOption[] = Array.from(
	{ length: LONG_LIST_OPTION_COUNT },
	(_, index) => ({
		value: `option-${index}`,
		label: `Option ${index + 1}`,
	})
);

export const LongList: Story = {
	args: {
		label: 'Option',
		options: longListOptions,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: 'Option' });

		await step(
			'open the list and move well past the visible options',
			async () => {
				await userEvent.click(combobox);
				for (let index = 0; index < LONG_LIST_ARROW_DOWN_PRESSES; index += 1) {
					await userEvent.keyboard('{ArrowDown}');
				}
			}
		);

		await step('the active option is scrolled into view', async () => {
			const activeOptionId = combobox.getAttribute('aria-activedescendant');
			if (!activeOptionId) throw new Error('expected an active option');

			const activeOptionElement =
				canvasElement.ownerDocument.getElementById(activeOptionId);
			if (!activeOptionElement) {
				throw new Error('expected the active option element to exist');
			}

			const scrollContainer = canvas.getByRole('listbox');

			const optionRect = activeOptionElement.getBoundingClientRect();
			const containerRect = scrollContainer.getBoundingClientRect();

			await expect(optionRect.top).toBeGreaterThanOrEqual(containerRect.top);
			await expect(optionRect.bottom).toBeLessThanOrEqual(containerRect.bottom);
		});
	},
};

export const NoResults: Story = {
	args: {
		label: 'Fruit',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: 'Fruit' });

		await step(
			'typing a query with no matches announces "No results found"',
			async () => {
				await userEvent.click(combobox);
				await userEvent.type(combobox, 'zzz');
				await expect(canvas.getByRole('status')).toHaveTextContent(
					'No results found'
				);
			}
		);
	},
};

function InFormExample() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Combobox label="Fruit" options={defaultOptions} />
			<button type="submit" className="mt-4">
				Submit
			</button>
			{isSubmitted && <p role="status">Submitted</p>}
		</form>
	);
}

export const InForm: Story = {
	render: () => <InFormExample />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: 'Fruit' });

		await step('Enter with no active option submits the form', async () => {
			await userEvent.click(combobox);
			await userEvent.keyboard('{Enter}');
			await expect(canvas.getByRole('status')).toHaveTextContent('Submitted');
		});
	},
};

export const InFormNoResults: Story = {
	render: () => <InFormExample />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: 'Fruit' });

		await step(
			'Enter still submits the form when the query matches nothing',
			async () => {
				await userEvent.click(combobox);
				await userEvent.type(combobox, 'zzz');
				await expect(combobox).not.toHaveAttribute('aria-activedescendant');
				await userEvent.keyboard('{Enter}');
				await expect(canvas.getByRole('status')).toHaveTextContent('Submitted');
			}
		);
	},
};

export const Unstyled: Story = {
	args: {
		label: 'Fruit',
		unstyled: true,
	},
};
