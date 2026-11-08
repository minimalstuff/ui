import type { Meta, StoryObj } from '@storybook/react-vite';
import { type SyntheticEvent, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { page } from 'vitest/browser';

import { Combobox, type ComboboxOption } from '#components/combobox/combobox';
import {
	expectActiveOptionInView,
	expectBoundedOptionCount,
	expectFocusOn,
	expectWindowedActiveOptionInView,
	findOptionAtPosition,
	getActiveOptionPosition,
	pressKeyUntilActivePosition,
} from '#storybook/play_helpers';

const defaultOptions: ComboboxOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'orange', label: 'Orange' },
];

const meta = {
	title: 'Components/Combobox',
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
		description: {
			control: 'text',
			description: 'Help text below the field',
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
		filterOption: {
			control: false,
			description:
				'Replaces the default case-insensitive "label contains the query" match',
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
				await userEvent.keyboard(
					`{ArrowDown>${LONG_LIST_ARROW_DOWN_PRESSES}/}`
				);
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

			await waitFor(async () => {
				const optionRect = activeOptionElement.getBoundingClientRect();
				const containerRect = scrollContainer.getBoundingClientRect();

				await expect(optionRect.top).toBeGreaterThanOrEqual(containerRect.top);
				await expect(optionRect.bottom).toBeLessThanOrEqual(
					containerRect.bottom
				);
			});
		});
	},
};

const THOUSANDS_OPTION_COUNT = 3000;

const LONG_LABEL_INTERVAL = 50;
const LONG_LABEL_OFFSET = 25;

function getThousandsLabel(position: number): string {
	return position % LONG_LABEL_INTERVAL === LONG_LABEL_OFFSET
		? `Saint-Martin-de-Bienfaite-la-Cressonnière ${position}`
		: `City ${position}`;
}

const thousandsOfOptions: ComboboxOption[] = Array.from(
	{ length: THOUSANDS_OPTION_COUNT },
	(_, index) => ({
		value: `city-${index + 1}`,
		label: getThousandsLabel(index + 1),
	})
);

const THOUSANDS_PAGE_DOWN_PRESSES = 10;
const THOUSANDS_MAX_PAGE_UP_PRESSES = 15;
const THOUSANDS_DEEP_INDEX = 1500;

async function openThousandsListbox(
	canvasElement: HTMLElement
): Promise<{ combobox: HTMLElement; listbox: HTMLElement }> {
	const canvas = within(canvasElement);
	const combobox = canvas.getByRole('combobox', { name: 'City' });
	await userEvent.click(combobox);
	const listbox = await canvas.findByRole('listbox');
	return { combobox, listbox };
}

export const ThousandsOfOptions: Story = {
	args: {
		label: 'City',
		options: thousandsOfOptions,
		optionLabelOverflow: 'wrap-active',
	},
	play: async ({ canvasElement, step }) => {
		const { combobox, listbox } = await openThousandsListbox(canvasElement);

		await step('mounts only a bounded number of options', async () => {
			await expectBoundedOptionCount(listbox, 2);
			const firstOption = findOptionAtPosition(listbox, 1);
			await expect(firstOption).toHaveAttribute(
				'aria-setsize',
				String(THOUSANDS_OPTION_COUNT)
			);
		});

		await step(
			'repeated PageDown keeps the active option in view',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				for (let press = 0; press < THOUSANDS_PAGE_DOWN_PRESSES; press += 1) {
					// oxlint-disable-next-line no-await-in-loop -- each press builds on the previous position
					await userEvent.keyboard('{PageDown}');
					// oxlint-disable-next-line no-await-in-loop -- the position is checked after every press
					await expectWindowedActiveOptionInView(combobox, listbox);
				}
				await expect(getActiveOptionPosition(combobox)).toBeGreaterThan(
					THOUSANDS_PAGE_DOWN_PRESSES
				);
			}
		);

		await step('PageUp goes back to the first option', async () => {
			await pressKeyUntilActivePosition(
				combobox,
				'PageUp',
				1,
				THOUSANDS_MAX_PAGE_UP_PRESSES
			);
			await expectWindowedActiveOptionInView(combobox, listbox);
		});
	},
};

export const ThousandsOfOptionsFarEnd: Story = {
	args: {
		label: 'City',
		options: thousandsOfOptions,
		optionLabelOverflow: 'wrap-active',
	},
	play: async ({ canvasElement, step }) => {
		const { combobox, listbox } = await openThousandsListbox(canvasElement);

		await step('ArrowUp from the first option wraps to the last', async () => {
			await userEvent.keyboard('{ArrowDown}{ArrowUp}');
			await waitFor(async () => {
				await expect(getActiveOptionPosition(combobox)).toBe(
					THOUSANDS_OPTION_COUNT
				);
			});
			await expectWindowedActiveOptionInView(combobox, listbox);
		});

		await step('PageUp, ArrowDown and ArrowUp keep it in view', async () => {
			for (const key of [
				'PageUp',
				'PageUp',
				'PageUp',
				'ArrowDown',
				'ArrowUp',
			]) {
				// oxlint-disable-next-line no-await-in-loop -- each key builds on the previous position
				await userEvent.keyboard(`{${key}}`);
				// oxlint-disable-next-line no-await-in-loop -- the position is checked after every key
				await expectWindowedActiveOptionInView(combobox, listbox);
			}
		});

		await step(
			'the far active option stays mounted and absolutely placed',
			async () => {
				const farPosition = getActiveOptionPosition(combobox);
				listbox.scrollTop = 0;
				await waitFor(async () => {
					const activeId = combobox.getAttribute('aria-activedescendant');
					const activeOption = activeId
						? canvasElement.ownerDocument.getElementById(activeId)
						: null;
					await expect(activeOption).not.toBeNull();
					await expect(activeOption).toHaveAttribute(
						'aria-posinset',
						String(farPosition)
					);
					await expect(getComputedStyle(activeOption as Element).position).toBe(
						'absolute'
					);
				});
				await userEvent.keyboard('{ArrowDown}');
				await waitFor(async () => {
					await expect(getActiveOptionPosition(combobox)).toBe(farPosition + 1);
				});
				await expectWindowedActiveOptionInView(combobox, listbox);
			}
		);

		await step(
			'scrolling the listbox to the bottom mounts the last option',
			async () => {
				listbox.scrollTop = listbox.scrollHeight;
				await waitFor(async () => {
					await expect(
						findOptionAtPosition(listbox, THOUSANDS_OPTION_COUNT)
					).not.toBeNull();
				});
				await expectBoundedOptionCount(listbox);
			}
		);
	},
};

export const ThousandsOfOptionsSelection: Story = {
	args: {
		label: 'City',
		options: thousandsOfOptions,
		optionLabelOverflow: 'wrap-active',
	},
	play: async ({ canvasElement, step }) => {
		const { combobox, listbox } = await openThousandsListbox(canvasElement);

		await step('Enter selects the last option', async () => {
			await userEvent.keyboard('{ArrowUp}');
			await expectWindowedActiveOptionInView(combobox, listbox);
			await userEvent.keyboard('{Enter}');
			await waitFor(async () => {
				await expect(combobox).toHaveValue(`City ${THOUSANDS_OPTION_COUNT}`);
			});
		});

		await step('reopening shows the selected option in view', async () => {
			await userEvent.click(combobox);
			const reopenedListbox = await within(canvasElement).findByRole('listbox');
			await waitFor(async () => {
				const selectedOption = findOptionAtPosition(
					reopenedListbox,
					THOUSANDS_OPTION_COUNT
				);
				await expect(selectedOption).toHaveAttribute('aria-selected', 'true');
				const optionRect = selectedOption?.getBoundingClientRect();
				const listboxRect = reopenedListbox.getBoundingClientRect();
				await expect(optionRect?.top).toBeGreaterThanOrEqual(listboxRect.top);
				await expect(optionRect?.bottom).toBeLessThanOrEqual(
					listboxRect.bottom
				);
			});
		});
	},
};

export const ThousandsOfOptionsFiltering: Story = {
	args: {
		label: 'City',
		options: thousandsOfOptions,
		optionLabelOverflow: 'wrap-active',
	},
	play: async ({ canvasElement, step }) => {
		const { combobox, listbox } = await openThousandsListbox(canvasElement);

		await step(
			'a broad query still mounts a bounded number of options',
			async () => {
				await userEvent.type(combobox, '9');
				await expectBoundedOptionCount(listbox, 2);
				const firstOption = listbox.querySelector('[role="option"]');
				await expect(
					Number(firstOption?.getAttribute('aria-setsize'))
				).toBeGreaterThan(100);
			}
		);

		await step('a narrow query mounts exactly the matches', async () => {
			await userEvent.clear(combobox);
			await userEvent.type(combobox, 'City 299');
			await waitFor(async () => {
				await expect(listbox.querySelectorAll('[role="option"]')).toHaveLength(
					11
				);
			});
		});
	},
};

const LONG_LABEL_POSITION = 25;

export const ThousandsOfOptionsLongActiveLabel: Story = {
	decorators: [
		(Story) => (
			<div style={{ width: 200 }}>
				<Story />
			</div>
		),
	],
	args: {
		label: 'City',
		options: thousandsOfOptions,
		optionLabelOverflow: 'wrap-active',
	},
	play: async ({ canvasElement, step }) => {
		const { combobox, listbox } = await openThousandsListbox(canvasElement);

		await step('the active long label wraps and is fully in view', async () => {
			await userEvent.keyboard(`{ArrowDown>${LONG_LABEL_POSITION}/}`);
			await waitFor(async () => {
				await expect(getActiveOptionPosition(combobox)).toBe(
					LONG_LABEL_POSITION
				);
			});
			await expectWindowedActiveOptionInView(combobox, listbox);
			const activeOption = findOptionAtPosition(listbox, LONG_LABEL_POSITION);
			const regularOption = findOptionAtPosition(
				listbox,
				LONG_LABEL_POSITION - 1
			);
			await expect(
				activeOption?.getBoundingClientRect().height
			).toBeGreaterThan(regularOption?.getBoundingClientRect().height ?? 0);
		});
	},
};

const overflowOptions: ComboboxOption[] = ['a', 'b', 'c'].map((value) => ({
	value,
	label:
		value === 'c'
			? 'Court'
			: `Saint-Martin-de-Bienfaite-la-Cressonnière ${value}`,
}));

export const OptionLabelOverflow: Story = {
	decorators: [
		(Story) => (
			<div style={{ width: 200 }}>
				<Story />
			</div>
		),
	],
	args: {
		label: 'City',
		options: overflowOptions,
		optionLabelOverflow: 'wrap-active',
	},
	play: async ({ canvasElement }) => {
		const { combobox, listbox } = await openThousandsListbox(canvasElement);
		await userEvent.keyboard('{ArrowDown}{ArrowDown}');

		await waitFor(async () => {
			const [inactiveRow, activeRow] = within(listbox).getAllByRole('option');
			await expect(activeRow.getBoundingClientRect().height).toBeGreaterThan(
				inactiveRow.getBoundingClientRect().height
			);
			await expect(getActiveOptionPosition(combobox)).toBe(2);
		});

		const [longInactiveRow, , shortRow] =
			within(listbox).getAllByRole('option');
		await userEvent.hover(longInactiveRow);
		await waitFor(async () => {
			await expect(longInactiveRow).toHaveAttribute('title');
		});
		await userEvent.hover(shortRow);
		await expect(shortRow).not.toHaveAttribute('title');

		for (const row of within(listbox).getAllByRole('option')) {
			const { left, top, width, height } = row.getBoundingClientRect();
			const hit = canvasElement.ownerDocument.elementFromPoint(
				left + width / 2,
				top + height / 2
			);
			// oxlint-disable-next-line no-await-in-loop -- one assertion per row
			await expect(row.contains(hit)).toBe(true);
		}
	},
};

export const SelectedOptionDeepInList: Story = {
	args: {
		label: 'City',
		options: thousandsOfOptions,
		optionLabelOverflow: 'wrap-active',
		defaultValue: thousandsOfOptions[THOUSANDS_DEEP_INDEX].value,
	},
	play: async ({ canvasElement }) => {
		const { listbox } = await openThousandsListbox(canvasElement);

		await waitFor(async () => {
			const selectedOption = listbox.querySelector('[aria-selected="true"]');
			await expect(selectedOption).not.toBeNull();
			const optionRect = selectedOption?.getBoundingClientRect();
			const listboxRect = listbox.getBoundingClientRect();
			await expect(optionRect?.top).toBeGreaterThanOrEqual(listboxRect.top);
			await expect(optionRect?.bottom).toBeLessThanOrEqual(listboxRect.bottom);
		});
	},
};

const PAGE_NAVIGATION_OPTION_COUNT = LONG_LIST_OPTION_COUNT;
const PAGE_NAVIGATION_MAX_PRESSES = 10;

export const PageNavigation: Story = {
	args: {
		label: 'Option',
		options: longListOptions,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox', { name: 'Option' });
		await userEvent.click(combobox);

		await step('repeated PageDown reaches the last option', async () => {
			await pressKeyUntilActivePosition(
				combobox,
				'PageDown',
				PAGE_NAVIGATION_OPTION_COUNT,
				PAGE_NAVIGATION_MAX_PRESSES
			);
			await expectActiveOptionInView(combobox, canvas.getByRole('listbox'));
		});

		await step('repeated PageUp reaches the first option', async () => {
			await pressKeyUntilActivePosition(
				combobox,
				'PageUp',
				1,
				PAGE_NAVIGATION_MAX_PRESSES
			);
			await expectActiveOptionInView(combobox, canvas.getByRole('listbox'));
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
				await waitFor(async () => {
					await expect(canvas.getByRole('status')).toHaveTextContent(
						'No results found'
					);
				});
			}
		);
	},
};

function InFormExample() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (
		event: SyntheticEvent<HTMLFormElement, SubmitEvent>
	) => {
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

function removeAccents(text: string): string {
	return text.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export const AccentInsensitive: Story = {
	args: {
		label: 'Drink',
		placeholder: 'Try "cafe"',
		options: [
			{ value: 'cafe', label: 'Café' },
			{ value: 'the', label: 'Thé' },
			{ value: 'chocolat', label: 'Chocolat chaud' },
		],
		filterOption: (option, query) =>
			removeAccents(option.label)
				.toLowerCase()
				.includes(removeAccents(query).toLowerCase()),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const combobox = canvas.getByRole('combobox');
		await userEvent.type(combobox, 'cafe');
		await expect(canvas.getByRole('option', { name: 'Café' })).toBeVisible();
		await expect(canvas.getAllByRole('option')).toHaveLength(1);
	},
};

export const Unstyled: Story = {
	args: {
		label: 'Fruit',
		unstyled: true,
	},
};

export const WideDropdown: Story = {
	parameters: { layout: 'fullscreen' },
	decorators: [
		(Story) => (
			<div style={{ position: 'fixed', top: 16, right: 16, width: 200 }}>
				<Story />
			</div>
		),
	],
	args: {
		label: 'Fruit',
		dropdownClassName: 'w-96',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const field = canvas.getByRole('combobox', { name: 'Fruit' });
		await userEvent.click(field);
		const listbox = await canvas.findByRole('listbox');
		const panel = listbox.parentElement;
		if (!panel) throw new Error('expected the listbox to sit in a panel');

		await waitFor(async () => {
			const panelRect = panel.getBoundingClientRect();
			await expect(panelRect.left).toBeGreaterThanOrEqual(0);
			await expect(panelRect.right).toBeLessThanOrEqual(window.innerWidth);
			await expect(panelRect.width).toBeGreaterThan(
				field.getBoundingClientRect().width
			);
		});

		const option = canvas.getAllByRole('option')[0];
		const { left, top, width, height } = option.getBoundingClientRect();
		const hit = canvasElement.ownerDocument.elementFromPoint(
			left + width / 2,
			top + height / 2
		);
		await expect(option.contains(hit)).toBe(true);
	},
};

const NARROW_VIEWPORT_WIDTH = 320;
const NARROW_VIEWPORT_HEIGHT = 640;
const VIEWPORT_GUTTER = 8;

export const WideDropdownNarrowViewport: Story = {
	parameters: { layout: 'fullscreen' },
	decorators: [
		(Story) => (
			<div style={{ position: 'fixed', top: 16, right: 16, width: 200 }}>
				<Story />
			</div>
		),
	],
	args: {
		label: 'Fruit',
		dropdownClassName: 'min-w-80',
	},
	play: async ({ canvasElement }) => {
		const previousWidth = window.innerWidth;
		const previousHeight = window.innerHeight;
		await page.viewport(NARROW_VIEWPORT_WIDTH, NARROW_VIEWPORT_HEIGHT);
		try {
			const canvas = within(canvasElement);
			await userEvent.click(canvas.getByRole('combobox', { name: 'Fruit' }));
			const listbox = await canvas.findByRole('listbox');
			const panel = listbox.parentElement;
			if (!panel) throw new Error('expected the listbox to sit in a panel');
			const root = canvasElement.ownerDocument.documentElement;

			await waitFor(async () => {
				const panelRect = panel.getBoundingClientRect();
				await expect(panelRect.left).toBeGreaterThanOrEqual(VIEWPORT_GUTTER);
				await expect(panelRect.right).toBeLessThanOrEqual(
					root.clientWidth - VIEWPORT_GUTTER
				);
				await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
			});
		} finally {
			await page.viewport(previousWidth, previousHeight);
		}
	},
};
