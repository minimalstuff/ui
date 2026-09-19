import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	expect,
	userEvent,
	waitFor,
	waitForElementToBeRemoved,
	within,
} from 'storybook/test';

import { Menu } from '#components/menu/menu';
import { Input } from '#components/input/input';
import { Button } from '#components/button/button';
import { Select } from '#components/select/select';
import { Textarea } from '#components/textarea/textarea';
import { Combobox } from '#components/combobox/combobox';
import { MenuItem } from '#components/menu_item/menu_item';
import { ModalFooter } from '#components/modal/modal_footer';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { IconButton } from '#components/icon_button/icon_button';
import { Modal, type ModalProps } from '#components/modal/modal';
import { RadioOptions } from '#components/radio_options/radio_options';
import {
	expectFocusOn,
	getPortalScope,
	waitPastModalExitAnimation,
} from '../../../.storybook/play_helpers';

function ModalTrigger(props: ModalProps) {
	const handleOpen = () => {
		void Modal.call(props);
	};

	return <Button onClick={handleOpen}>Open modal</Button>;
}
// Pins the name the "Show code" panel reconstructs from `component.name` —
// without it, production minification mangles `ModalTrigger` (e.g. to `f`).
ModalTrigger.displayName = 'Modal';

const meta = {
	title: 'Example/Modal',
	component: ModalTrigger,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg', 'xl'],
			description: 'Modal width',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius',
		},
		title: {
			control: 'text',
			description: 'Header title',
		},
		children: {
			control: 'text',
			description: 'Body content',
		},
	},
	args: {
		title: 'Modal title',
		children: 'Modal content goes here.',
		size: 'md',
	},
} satisfies Meta<typeof ModalTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open modal' });

		await step('Tab to the trigger and open it with Enter', async () => {
			await userEvent.tab();
			await expectFocusOn(trigger);
			await userEvent.keyboard('{Enter}');
		});

		const dialog = await body.findByRole('dialog', { name: 'Modal title' });

		await step('Tab cycles inside the dialog', async () => {
			await userEvent.tab();
			await expect(dialog.contains(document.activeElement)).toBe(true);
		});

		await step(
			'Escape closes the dialog and returns focus to the trigger',
			async () => {
				await userEvent.keyboard('{Escape}');
				await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
				await expectFocusOn(trigger);
			}
		);
	},
};

export const WithoutTitle: Story = {
	args: {
		title: undefined,
		children: 'This modal has no header.',
		'aria-label': 'Notice',
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open modal' });

		await step('opens named by aria-label', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Notice' });
		});

		await step('close it', async () => {
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
		});
	},
};

export const Small: Story = {
	args: {
		title: 'Small modal',
		size: 'sm',
		children: 'Narrow width (max-w-md).',
	},
};

export const Large: Story = {
	args: {
		title: 'Large modal',
		size: 'lg',
		children: 'Wide modal for more content.',
	},
};

export const SquareRadius: Story = {
	args: {
		title: 'Square corners',
		radius: 'none',
		children: 'Border radius is fully customizable via the radius prop.',
	},
};

export const ExtraLarge: Story = {
	args: {
		title: 'Extra large modal',
		size: 'xl',
		children: 'Maximum width (max-w-4xl).',
	},
};

export const LongContent: Story = {
	args: {
		title: 'Scrollable content',
		children: (
			<>
				<p className="mb-4">First paragraph.</p>
				<p className="mb-4">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua.
				</p>
				<p className="mb-4">
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
					nisi ut aliquip ex ea commodo consequat.
				</p>
				<p className="mb-4">
					Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
					dolore eu fugiat nulla pariatur.
				</p>
				<p>
					Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
					officia deserunt mollit anim id est laborum.
				</p>
			</>
		),
	},
};

export const NonDismissible: Story = {
	args: {
		title: 'Complete your setup',
		dismissible: false,
		children: (
			<>
				This modal cannot be closed via Escape, backdrop click, or the close
				button. Finish the action below to continue.
				<ModalFooter>
					<Button size="sm">Finish setup</Button>
				</ModalFooter>
			</>
		),
	},
};

export const WithFooter: Story = {
	args: {
		title: 'Modal with footer',
		children: (
			<>
				This modal has a footer with action buttons.
				<ModalFooter>
					<Button variant="outline" color="neutral" size="sm">
						Cancel
					</Button>
					<Button size="sm">Save</Button>
				</ModalFooter>
			</>
		),
	},
};

export const LongContentWithFooter: Story = {
	args: {
		title: 'Long scrollable content with footer',
		children: (
			<>
				{Array.from({ length: 50 }, (_, i) => (
					<p key={i} className="mb-4">
						Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur
						adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
						dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo
						consequat. Duis aute irure dolor in reprehenderit in voluptate velit
						esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
						cupidatat non proident, sunt in culpa qui officia deserunt mollit
						anim id est laborum.
					</p>
				))}
				<ModalFooter>
					<Button variant="outline" color="neutral" size="sm">
						Cancel
					</Button>
					<Button size="sm">Confirm</Button>
				</ModalFooter>
			</>
		),
	},
};

export const SmallForm: Story = {
	args: {
		title: 'Create user',
		size: 'md',
		children: (
			<>
				<div className="space-y-4">
					<Input label="Name" required placeholder="Enter your name" />
					<Input
						label="Email"
						type="email"
						required
						placeholder="Enter your email"
					/>
					<Select
						label="Role"
						options={[
							{ value: 'admin', label: 'Administrator' },
							{ value: 'user', label: 'User' },
							{ value: 'guest', label: 'Guest' },
						]}
						placeholder="Select a role"
						required
					/>
				</div>
				<ModalFooter>
					<Button variant="outline" color="neutral" size="sm">
						Cancel
					</Button>
					<Button size="sm">Create</Button>
				</ModalFooter>
			</>
		),
	},
};

// Mirrors real usage: the modal's `children` is a dedicated content
// component, and `ModalFooter` is declared *inside* that component's own
// render output — one level below what `Modal.call` sees directly. This is
// the shape that broke the old structural-detection approach (it only ever
// saw the outer `<NestedFormContent/>` element, never the `ModalFooter`
// nested inside it) — regression coverage for that exact failure.
const NestedFormContent = () => (
	<>
		<div className="space-y-4">
			<Input label="Name" required placeholder="Enter a name" />
			<Input
				label="URL"
				type="url"
				required
				placeholder="https://example.com"
			/>
			<Textarea label="Description" rows={3} />
		</div>
		<ModalFooter>
			<Button variant="outline" color="neutral" size="sm">
				Cancel
			</Button>
			<Button size="sm">Create</Button>
		</ModalFooter>
	</>
);

export const FooterFromNestedComponent: Story = {
	args: {
		title: 'Create a link',
		size: 'md',
		children: <NestedFormContent />,
	},
};

export const LongForm: Story = {
	args: {
		title: 'Complete profile',
		size: 'lg',
		children: (
			<>
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<Input label="First name" required placeholder="John" />
						<Input label="Last name" required placeholder="Doe" />
					</div>
					<Input
						label="Email"
						type="email"
						required
						placeholder="john.doe@example.com"
					/>
					<Input label="Phone" type="tel" placeholder="+1 234 567 8900" />
					<Input label="Address" placeholder="123 Main Street" />
					<div className="grid grid-cols-2 gap-4">
						<Input label="City" placeholder="New York" />
						<Input label="State" placeholder="NY" />
					</div>
					<Input label="ZIP code" placeholder="10001" />
					<Select
						label="Country"
						options={[
							{ value: 'us', label: 'United States' },
							{ value: 'ca', label: 'Canada' },
							{ value: 'uk', label: 'United Kingdom' },
							{ value: 'fr', label: 'France' },
							{ value: 'de', label: 'Germany' },
						]}
						placeholder="Select a country"
						required
					/>
					<Input label="Company" placeholder="Acme Inc." />
					<Input label="Job title" placeholder="Software Engineer" />
					<Textarea
						label="Bio"
						placeholder="Tell us about yourself..."
						rows={4}
					/>
					<Input label="Website" type="url" placeholder="https://example.com" />
					<Input
						label="LinkedIn"
						type="url"
						placeholder="https://linkedin.com/in/username"
					/>
					<Input
						label="Twitter"
						type="url"
						placeholder="https://twitter.com/username"
					/>
					<Textarea
						label="Additional notes"
						placeholder="Any additional information..."
						rows={3}
					/>
				</div>
				<ModalFooter>
					<Button variant="outline" color="neutral" size="sm">
						Cancel
					</Button>
					<Button size="sm">Save profile</Button>
				</ModalFooter>
			</>
		),
	},
};

function DeleteConfirmationContent() {
	const handleDeleteClick = () => {
		void ConfirmModal.call({
			title: 'Delete item?',
			children: 'This action cannot be undone.',
		});
	};

	return <Button onClick={handleDeleteClick}>Delete…</Button>;
}

export const ComboboxInModal: Story = {
	args: {
		title: 'Pick a fruit',
		children: (
			<div className="space-y-4">
				<Combobox
					label="Fruit"
					options={[
						{ value: 'apple', label: 'Apple' },
						{ value: 'banana', label: 'Banana' },
						{ value: 'orange', label: 'Orange' },
					]}
				/>
				<Input label="Notes" />
			</div>
		),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open modal' });

		await step('opening the modal focuses the combobox', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Pick a fruit' });
			await expectFocusOn(body.getByRole('combobox', { name: 'Fruit' }));
		});

		await step(
			'ArrowDown then Escape closes the listbox, not the dialog',
			async () => {
				await userEvent.keyboard('{ArrowDown}');
				await body.findByRole('listbox');
				await userEvent.keyboard('{Escape}');
				await waitFor(async () => {
					await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
				});
				await waitPastModalExitAnimation();
				await expect(
					body.getByRole('dialog', { name: 'Pick a fruit' })
				).toBeInTheDocument();
			}
		);

		await step('Escape again closes the dialog', async () => {
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
			await expectFocusOn(trigger);
		});
	},
};

export const MenuInModal: Story = {
	args: {
		title: 'Item actions',
		children: (
			<Menu
				trigger={
					<IconButton
						icon="i-mdi-dots-vertical"
						aria-label="Options"
						size="sm"
					/>
				}
			>
				<MenuItem icon="i-mdi-arrow-up" onClick={() => {}}>
					Move up
				</MenuItem>
				<MenuItem icon="i-mdi-delete" danger onClick={() => {}}>
					Delete
				</MenuItem>
			</Menu>
		),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open modal' });

		await step('opening the modal focuses the menu trigger', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Item actions' });
			await expectFocusOn(body.getByRole('button', { name: 'Options' }));
		});

		await step('ArrowDown opens the menu', async () => {
			await userEvent.keyboard('{ArrowDown}');
			const menu = await body.findByRole('menu');
			await expectFocusOn(within(menu).getByText('Move up'));
		});

		await step(
			'Escape closes the menu but leaves the dialog open',
			async () => {
				await userEvent.keyboard('{Escape}');
				await waitForElementToBeRemoved(() => body.queryByRole('menu'));
				await waitPastModalExitAnimation();
				await expect(
					body.getByRole('dialog', { name: 'Item actions' })
				).toBeInTheDocument();
			}
		);

		await step(
			'Escape again closes the dialog and returns focus to the "Open modal" trigger',
			async () => {
				await userEvent.keyboard('{Escape}');
				await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
				await expectFocusOn(trigger);
			}
		);
	},
};

export const StackedModals: Story = {
	args: {
		title: 'Manage item',
		children: <DeleteConfirmationContent />,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open modal' });

		await step('open the modal and trigger the confirm modal', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Manage item' });
			await userEvent.click(body.getByRole('button', { name: 'Delete…' }));
			await body.findByRole('alertdialog');
		});

		await step('Escape closes only the alertdialog', async () => {
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('alertdialog'));
			await waitPastModalExitAnimation();
			await expect(
				body.getByRole('dialog', { name: 'Manage item' })
			).toBeInTheDocument();
			await expectFocusOn(body.getByRole('button', { name: 'Delete…' }));
		});

		await step('Escape closes the remaining dialog', async () => {
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
		});
	},
};

export const RadioLast: Story = {
	args: {
		title: 'Choose a size',
		children: (
			<RadioOptions
				label="Size"
				options={['Small', 'Medium', 'Large']}
				defaultValue="Medium"
			/>
		),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open modal' });

		await step('opening the modal focuses the checked radio', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Choose a size' });
			await expectFocusOn(body.getByRole('radio', { name: 'Medium' }));
		});

		await step('Tab wraps back to the close button', async () => {
			await userEvent.tab();
			await expectFocusOn(body.getByRole('button', { name: 'Close' }));
		});

		await step('close it', async () => {
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
		});
	},
};
