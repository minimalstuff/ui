import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef, useState, type SyntheticEvent } from 'react';
import {
	expect,
	userEvent,
	waitFor,
	waitForElementToBeRemoved,
	within,
} from 'storybook/test';

import { Badge } from '#components/badge/badge';
import { Button } from '#components/button/button';
import { Combobox } from '#components/combobox/combobox';
import { IconButton } from '#components/icon_button/icon_button';
import { Input } from '#components/input/input';
import { Menu } from '#components/menu/menu';
import { MenuItem } from '#components/menu_item/menu_item';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { Modal, type ModalProps } from '#components/modal/modal';
import { ModalFooter } from '#components/modal/modal_footer';
import { useDismissGuard } from '#components/modal/use_dismiss_guard';
import { RadioOptions } from '#components/radio_options/radio_options';
import { Select } from '#components/select/select';
import { Switch } from '#components/switch/switch';
import { Tabs } from '#components/tabs/tabs';
import { Textarea } from '#components/textarea/textarea';
import { consumerUtilitiesDecorator } from '../../../.storybook/consumer_utilities_decorator';
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
		height: {
			control: 'select',
			options: ['auto', 'fixed'],
			description: 'Modal height',
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

async function expectBackdropPaddingTopAfterOpening(
	canvasElement: HTMLElement,
	expectedPaddingTop: string
): Promise<void> {
	const canvas = within(canvasElement);
	const body = getPortalScope(canvasElement);

	await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
	const dialog = await body.findByRole('dialog', { name: 'Modal title' });
	const backdrop = dialog.parentElement as HTMLElement;

	await expect(getComputedStyle(backdrop).paddingTop).toBe(expectedPaddingTop);
}

export const DesktopBackdropPaddingWithConsumerUtilities: Story = {
	decorators: [consumerUtilitiesDecorator],
	globals: { viewport: { value: 'desktop', isRotated: false } },
	play: ({ canvasElement }) =>
		expectBackdropPaddingTopAfterOpening(canvasElement, '80px'),
};

export const TabletBackdropPaddingWithConsumerUtilities: Story = {
	decorators: [consumerUtilitiesDecorator],
	globals: { viewport: { value: 'tablet', isRotated: false } },
	play: ({ canvasElement }) =>
		expectBackdropPaddingTopAfterOpening(canvasElement, '48px'),
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

export const AlertDialog: Story = {
	args: {
		title: 'Connection lost',
		role: 'alertdialog',
		dismissible: false,
		children: (close) => (
			<>
				The tunnel dropped and could not be restored. Reconnect to continue.
				<ModalFooter>
					<Button size="sm" onClick={close}>
						Reconnect
					</Button>
				</ModalFooter>
			</>
		),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await step('opens as an alertdialog that ignores Escape', async () => {
			await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
			await body.findByRole('alertdialog', { name: 'Connection lost' });
			await userEvent.keyboard('{Escape}');
			await expect(body.getByRole('alertdialog')).toBeInTheDocument();
		});

		await step('the action button closes it', async () => {
			await userEvent.click(body.getByRole('button', { name: 'Reconnect' }));
			await waitForElementToBeRemoved(() => body.queryByRole('alertdialog'));
		});
	},
};

const unknownHostRejectRef = createRef<HTMLButtonElement>();

export const InitialFocus: Story = {
	args: {
		title: 'Unknown host',
		initialFocusRef: unknownHostRejectRef,
		children: (close) => (
			<>
				The host key for 203.0.113.7 is not known. Verify its fingerprint before
				trusting it; focus starts on Reject rather than the first button.
				<ModalFooter>
					<Button variant="outline" color="neutral" size="sm">
						Copy fingerprint
					</Button>
					<Button
						ref={unknownHostRejectRef}
						color="danger"
						size="sm"
						onClick={close}
					>
						Reject
					</Button>
					<Button size="sm" onClick={close}>
						Accept
					</Button>
				</ModalFooter>
			</>
		),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await step('focus lands on Reject, not Copy fingerprint', async () => {
			await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
			const reject = await body.findByRole('button', { name: 'Reject' });
			await expectFocusOn(reject);
		});

		await step('close it', async () => {
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
		});
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

export const FixedHeight: Story = {
	args: {
		title: 'Fixed height',
		height: 'fixed',
		children: (
			<>
				<div className="flex-1 min-h-0 overflow-y-auto">
					{Array.from({ length: 50 }, (_, i) => (
						<p key={i} className="mb-4">
							Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur
							adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
							dolore magna aliqua.
						</p>
					))}
				</div>
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

const SETTINGS_FORM_ID = 'settings-form';

const LONG_PANEL_FIELD_COUNT = 24;

const LOG_LEVEL_OPTIONS = [
	{ value: 'info', label: 'Info' },
	{ value: 'warn', label: 'Avertissement' },
	{ value: 'error', label: 'Erreur' },
];

interface SettingsFormProps {
	onCancel: () => void;
}

function SettingsForm({ onCancel }: Readonly<SettingsFormProps>) {
	const [serverName, setServerName] = useState('');
	const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
	const serverNameError =
		hasAttemptedSubmit && !serverName ? 'Le nom est requis' : undefined;

	const handleSubmit = (
		event: SyntheticEvent<HTMLFormElement, SubmitEvent>
	) => {
		event.preventDefault();
		setHasAttemptedSubmit(true);
		if (serverName) onCancel();
	};

	const items = [
		{
			title: 'Général',
			badge: serverNameError && <Badge color="danger">1 erreur</Badge>,
			content: (
				<div className="space-y-4">
					<Input
						label="Nom du serveur"
						required
						value={serverName}
						error={serverNameError}
						onChange={(event) => setServerName(event.target.value)}
					/>
					<Input label="Description" />
					<Switch label="Démarrer au lancement" />
				</div>
			),
		},
		{
			title: 'Réseau',
			content: (
				<div className="space-y-4">
					<Input label="Hôte" placeholder="localhost" />
					<Input label="Port" type="number" />
					<Switch label="Activer le proxy" />
				</div>
			),
		},
		{
			title: 'Sécurité',
			content: (
				<div className="space-y-4">
					{Array.from({ length: LONG_PANEL_FIELD_COUNT }, (_, index) => (
						<Input key={index} label={`Règle d'accès ${index + 1}`} />
					))}
				</div>
			),
		},
		{
			title: 'Notifications',
			content: (
				<div className="space-y-4">
					<Switch label="Notifications par e-mail" />
					<Switch label="Notifications push" />
					<Input label="Adresse e-mail" type="email" />
				</div>
			),
		},
		{
			title: 'Avancé',
			content: (
				<div className="space-y-4">
					<Select
						label="Niveau de journalisation"
						options={LOG_LEVEL_OPTIONS}
					/>
					<Input label="Délai d'attente (ms)" type="number" />
				</div>
			),
		},
	];

	return (
		<form
			id={SETTINGS_FORM_ID}
			noValidate
			className="flex-1 min-h-0 flex flex-col"
			onSubmit={handleSubmit}
		>
			<Tabs
				orientation="vertical"
				keepMounted
				className="flex-1 min-h-0"
				items={items}
			/>
			<ModalFooter>
				<Button variant="outline" color="neutral" size="sm" onClick={onCancel}>
					Annuler
				</Button>
				<Button size="sm" type="submit" form={SETTINGS_FORM_ID}>
					Enregistrer
				</Button>
			</ModalFooter>
		</form>
	);
}

export const SettingsWithVerticalTabs: Story = {
	args: {
		title: 'Paramètres',
		size: 'xl',
		height: 'fixed',
		children: (close) => <SettingsForm onCancel={close} />,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
		const dialog = await body.findByRole('dialog', { name: 'Paramètres' });
		const dialogScope = within(dialog);

		await step('ArrowDown moves to the next tab', async () => {
			await userEvent.click(dialogScope.getByRole('tab', { name: 'Général' }));
			await userEvent.keyboard('{ArrowDown}');
			await expect(
				dialogScope.getByRole('tab', { name: 'Réseau' })
			).toHaveFocus();
		});

		await step('a typed value survives switching tabs', async () => {
			await userEvent.click(dialogScope.getByRole('tab', { name: 'Général' }));
			await userEvent.type(
				dialogScope.getByLabelText(/Description/),
				'Mon serveur'
			);
			await userEvent.click(dialogScope.getByRole('tab', { name: 'Avancé' }));
			await userEvent.click(dialogScope.getByRole('tab', { name: 'Général' }));
			await expect(dialogScope.getByLabelText(/Description/)).toHaveValue(
				'Mon serveur'
			);
		});

		await step('the save button stays visible', async () => {
			await expect(
				dialogScope.getByRole('button', { name: 'Enregistrer' })
			).toBeVisible();
		});

		await userEvent.click(dialogScope.getByRole('button', { name: 'Annuler' }));
		await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
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

const INITIAL_DISPLAY_NAME = 'Ada Lovelace';

function GuardedSettingsForm({ onCancel }: Readonly<{ onCancel: () => void }>) {
	const [displayName, setDisplayName] = useState(INITIAL_DISPLAY_NAME);
	const isDirty = displayName !== INITIAL_DISPLAY_NAME;

	useDismissGuard(
		() =>
			ConfirmModal.call({
				title: 'Discard your changes?',
				confirmLabel: 'Discard',
				confirmColor: 'danger',
			}),
		isDirty
	);

	return (
		<>
			<Input
				label="Display name"
				value={displayName}
				onChange={(event) => setDisplayName(event.target.value)}
			/>
			<ModalFooter>
				<Button variant="outline" color="neutral" size="sm" onClick={onCancel}>
					Cancel
				</Button>
				<Button size="sm">Save</Button>
			</ModalFooter>
		</>
	);
}

export const DismissGuard: Story = {
	args: {
		title: 'Profile',
		children: (close) => <GuardedSettingsForm onCancel={close} />,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open modal' });

		await step('a clean form closes on Escape without asking', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Profile' });
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
		});

		await step('a dirty form asks before closing', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Profile' });
			await userEvent.type(body.getByLabelText('Display name'), ' King');
			await userEvent.keyboard('{Escape}');
			await body.findByRole('alertdialog', { name: 'Discard your changes?' });
		});

		await step(
			'declining keeps the form open with focus on the input',
			async () => {
				await userEvent.keyboard('{Escape}');
				await waitForElementToBeRemoved(() => body.queryByRole('alertdialog'));
				await waitPastModalExitAnimation();
				await expect(
					body.getByRole('dialog', { name: 'Profile' })
				).toBeInTheDocument();
				await expectFocusOn(body.getByLabelText('Display name'));
			}
		);

		await step('discarding closes the form', async () => {
			await userEvent.keyboard('{Escape}');
			await userEvent.click(
				await body.findByRole('button', { name: 'Discard' })
			);
			await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
		});
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
