import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import {
	MultiCombobox,
	type MultiComboboxOption,
} from '#components/multi_combobox/multi_combobox';
import {
	expectActiveOptionInView,
	expectBoundedOptionCount,
	expectFocusOn,
	expectWindowedActiveOptionInView,
	findOptionAtPosition,
	getActiveOptionPosition,
	pressKeyUntilActivePosition,
} from '#storybook/play_helpers';

const defaultOptions: MultiComboboxOption[] = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'orange', label: 'Orange' },
	{ value: 'grape', label: 'Grape' },
	{ value: 'mango', label: 'Mango' },
];

const sortOptions: MultiComboboxOption[] = [
	{ value: 'name', label: 'Name' },
	{ value: 'name_desc', label: 'Name (desc)' },
	{ value: 'date', label: 'Date' },
	{ value: 'date_desc', label: 'Date (desc)' },
	{ value: 'price', label: 'Price' },
	{ value: 'price_desc', label: 'Price (desc)' },
];

function findOppositeSortOption(optionValue: string): string {
	return optionValue.endsWith('_desc')
		? optionValue.replace('_desc', '')
		: `${optionValue}_desc`;
}

function isSortOptionDisabled(
	optionValue: string,
	selectedValues: readonly string[]
): boolean {
	return selectedValues.includes(findOppositeSortOption(optionValue));
}

const meta = {
	title: 'Components/MultiCombobox',
	component: MultiCombobox,
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
			description: 'Trigger text shown when nothing is selected',
		},
		searchPlaceholder: {
			control: 'text',
			description: 'Placeholder for the dropdown search input',
		},
		noResultsText: {
			control: 'text',
			description: 'Text shown when the search matches nothing',
		},
		clearLabel: {
			control: 'text',
			description: 'Accessible label for the clear icon button',
		},
		clearText: {
			control: 'text',
			description: 'Label for the footer clear button',
		},
		maxSelectedValues: {
			control: 'number',
			description: 'Caps how many options can be selected at once',
		},
		maxDisplayedValues: {
			control: 'number',
			description: 'Pills shown on the trigger before collapsing into +N more',
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
		placeholder: 'Select fruits...',
	},
	decorators: [
		(Story) => (
			<div style={{ width: 320 }}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof MultiCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		'aria-label': 'Fruits',
	},
};

export const WithLabel: Story = {
	args: {
		label: 'Fruits',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Fruits' });

		await step('Tab focuses the trigger', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step(
			'ArrowUp opens the listbox with the last option active',
			async () => {
				await userEvent.keyboard('{ArrowUp}');
				const searchInput = canvas.getByRole('combobox', { name: /Search/ });
				const lastOption = canvas.getByRole('option', { name: 'Mango' });
				await expect(searchInput).toHaveAttribute(
					'aria-activedescendant',
					lastOption.id
				);
			}
		);

		await step('Enter selects the active option', async () => {
			await userEvent.keyboard('{Enter}');
			await expect(
				canvas.getByRole('option', { name: 'Mango' })
			).toHaveAttribute('aria-selected', 'true');
		});

		await step(
			'Escape closes the listbox, returns focus to the trigger, and leaves no stale aria-activedescendant on it',
			async () => {
				await userEvent.keyboard('{Escape}');
				await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
				await expectFocusOn(trigger);
				await expect(trigger).not.toHaveAttribute('aria-activedescendant');
			}
		);

		await step('Tab moves focus to the "Clear selection" button', async () => {
			await userEvent.tab();
			await expectFocusOn(
				canvas.getByRole('button', { name: 'Clear selection' })
			);
		});

		await step(
			'activating the clear button empties the selection, returns focus to the trigger, and restores the placeholder',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expectFocusOn(trigger);
				await expect(trigger).toHaveTextContent('Select fruits...');
			}
		);
	},
};

export const Capped: Story = {
	args: {
		label: 'Sort by',
		options: sortOptions,
		placeholder: 'Select sort order...',
		maxSelectedValues: 2,
		isOptionDisabled: isSortOptionDisabled,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Sort by' });

		await step('Tab focuses the trigger', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step(
			'ArrowDown opens the listbox with the first option active and moves focus into the named search input',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				const searchInput = canvas.getByRole('combobox', { name: /Search/ });
				await expectFocusOn(searchInput);
				await expect(searchInput).toHaveAccessibleDescription(
					'You can select up to 2 items'
				);
				const nameOption = canvas.getByRole('option', { name: 'Name' });
				await expect(searchInput).toHaveAttribute(
					'aria-activedescendant',
					nameOption.id
				);
			}
		);

		await step('Enter selects "Name"', async () => {
			await userEvent.keyboard('{Enter}');
			await expect(
				canvas.getByRole('option', { name: 'Name' })
			).toHaveAttribute('aria-selected', 'true');
		});

		await step(
			'moving to "Date" and pressing Enter selects it, reaching the cap',
			async () => {
				await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
				await expect(
					canvas.getByRole('option', { name: 'Date' })
				).toHaveAttribute('aria-selected', 'true');
			}
		);

		await step(
			'ArrowDown lands on the disabled "Date (desc)" option, which still shows as active',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				const searchInput = canvas.getByRole('combobox', { name: /Search/ });
				const dateDescOption = canvas.getByRole('option', {
					name: 'Date (desc)',
				});
				await expect(searchInput).toHaveAttribute(
					'aria-activedescendant',
					dateDescOption.id
				);
				await expect(dateDescOption).toHaveAttribute('aria-disabled', 'true');
				const dateDescStyle = getComputedStyle(dateDescOption);
				await expect(dateDescStyle.backgroundColor).not.toBe(
					'rgba(0, 0, 0, 0)'
				);
				await expect(dateDescStyle.outlineStyle).toBe('solid');
			}
		);

		await step(
			'Enter on the disabled active option does not select it',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expect(
					canvas.getByRole('option', { name: 'Date (desc)' })
				).toHaveAttribute('aria-selected', 'false');
			}
		);

		await step(
			'Tab moves focus straight to the footer Clear button',
			async () => {
				await userEvent.tab();
				await expectFocusOn(canvas.getByRole('button', { name: 'Clear' }));
			}
		);

		await step(
			'activating the footer Clear button empties the selection and refocuses the search input',
			async () => {
				await userEvent.keyboard('{Enter}');
				await expectFocusOn(canvas.getByRole('combobox', { name: /Search/ }));
				await expect(
					canvas.getByRole('option', { name: 'Name' })
				).toHaveAttribute('aria-selected', 'false');
				await expect(
					canvas.getByRole('option', { name: 'Date' })
				).toHaveAttribute('aria-selected', 'false');
			}
		);
	},
};

export const WithError: Story = {
	args: {
		label: 'Fruits',
		error: 'Please select at least one fruit',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Fruits',
		disabled: true,
		defaultValues: ['apple'],
	},
};

export const Radius: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<MultiCombobox
				label="none"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="none"
			/>
			<MultiCombobox
				label="md"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="md"
			/>
			<MultiCombobox
				label="lg"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="lg"
			/>
			<MultiCombobox
				label="full"
				options={defaultOptions}
				placeholder="Select fruits..."
				radius="full"
			/>
		</div>
	),
};

export const Unstyled: Story = {
	args: {
		label: 'Fruits',
		unstyled: true,
	},
};

export const Required: Story = {
	args: {
		label: 'Fruits',
		required: true,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step(
			'the trigger is marked as required for assistive tech',
			async () => {
				await expect(canvas.getByRole('combobox')).toHaveAttribute(
					'aria-required',
					'true'
				);
			}
		);
	},
};

function FollowedByButtonExample() {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
			<MultiCombobox label="Fruits" options={defaultOptions} />
			<button type="button">Next</button>
		</div>
	);
}

export const FollowedByButton: Story = {
	render: () => <FollowedByButtonExample />,
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Fruits' });

		await step('Tab focuses the trigger', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
		});

		await step('ArrowDown opens the listbox', async () => {
			await userEvent.keyboard('{ArrowDown}');
			await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		});

		await step(
			'Tab moves focus to the "Next" button and closes the dropdown',
			async () => {
				await userEvent.tab();
				await expectFocusOn(canvas.getByRole('button', { name: 'Next' }));
				await expect(trigger).toHaveAttribute('aria-expanded', 'false');
			}
		);
	},
};

export const NoResults: Story = {
	args: {
		label: 'Fruits',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole('combobox', { name: 'Fruits' });

		await step(
			'typing a query with no matches announces "No results found"',
			async () => {
				await userEvent.click(trigger);
				const searchInput = canvas.getByRole('combobox', { name: /Search/ });
				await userEvent.type(searchInput, 'zzz');
				await waitFor(async () => {
					await expect(canvas.getByRole('status')).toHaveTextContent(
						'No results found'
					);
				});
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
		await userEvent.click(canvas.getByRole('combobox', { name: 'Drink' }));
		await userEvent.type(
			canvas.getByRole('combobox', { name: /Search/ }),
			'cafe'
		);
		await expect(canvas.getByRole('option', { name: 'Café' })).toBeVisible();
		await expect(canvas.getAllByRole('option')).toHaveLength(1);
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

const thousandsOfOptions: MultiComboboxOption[] = Array.from(
	{ length: THOUSANDS_OPTION_COUNT },
	(_, index) => ({
		value: `city-${index + 1}`,
		label: getThousandsLabel(index + 1),
	})
);

const THOUSANDS_PAGE_DOWN_PRESSES = 10;
const THOUSANDS_MAX_PAGE_UP_PRESSES = 15;

async function openThousandsListbox(
	canvasElement: HTMLElement
): Promise<{ combobox: HTMLElement; listbox: HTMLElement }> {
	const canvas = within(canvasElement);
	await userEvent.click(canvas.getByRole('combobox', { name: 'City' }));
	const combobox = await canvas.findByRole('combobox', { name: /Search/ });
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
				await expect(
					findOptionAtPosition(listbox, THOUSANDS_OPTION_COUNT)
				).toHaveAttribute('aria-selected', 'true');
			});
		});

		await step('Enter again deselects it', async () => {
			await userEvent.keyboard('{Enter}');
			await waitFor(async () => {
				await expect(
					findOptionAtPosition(listbox, THOUSANDS_OPTION_COUNT)
				).toHaveAttribute('aria-selected', 'false');
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

const overflowOptions: MultiComboboxOption[] = ['a', 'b', 'c'].map((value) => ({
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

const PAGE_NAVIGATION_OPTION_COUNT = 30;

const pageNavigationOptions: MultiComboboxOption[] = Array.from(
	{ length: PAGE_NAVIGATION_OPTION_COUNT },
	(_, index) => ({
		value: `option-${index}`,
		label: `Option ${index + 1}`,
	})
);
const PAGE_NAVIGATION_MAX_PRESSES = 10;

export const PageNavigation: Story = {
	args: {
		label: 'City',
		options: pageNavigationOptions,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('combobox', { name: 'City' }));
		const combobox = await canvas.findByRole('combobox', { name: /Search/ });

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
