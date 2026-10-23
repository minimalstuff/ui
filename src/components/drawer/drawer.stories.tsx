import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
	expect,
	userEvent,
	waitForElementToBeRemoved,
	within,
} from 'storybook/test';

import { Button } from '#components/button/button';
import { Drawer, type DrawerProps } from '#components/drawer/drawer';
import { Input } from '#components/input/input';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { ModalFooter } from '#components/modal/modal_footer';
import {
	expectFocusOn,
	getPortalScope,
	waitPastModalExitAnimation,
} from '../../../.storybook/play_helpers';

type DrawerTriggerProps = Omit<DrawerProps, 'isOpen' | 'onClose'>;

function DrawerTrigger(props: DrawerTriggerProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open drawer</Button>
			<Drawer {...props} isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
}
// Pins the name the "Show code" panel reconstructs from `component.name` —
// without it, production minification mangles `DrawerTrigger`.
DrawerTrigger.displayName = 'Drawer';

const LongBody = () => (
	<>
		{Array.from({ length: 40 }, (_, index) => (
			<p key={index} className="mb-4">
				Paragraph {index + 1}: Lorem ipsum dolor sit amet, consectetur
				adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
				magna aliqua.
			</p>
		))}
	</>
);

const CancelAndSave = (
	<>
		<Button variant="outline" color="neutral" size="sm">
			Cancel
		</Button>
		<Button size="sm">Save</Button>
	</>
);

const meta = {
	title: 'Example/Drawer',
	component: DrawerTrigger,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
			description: 'Drawer width from the sm breakpoint up',
		},
		side: {
			control: 'select',
			options: ['right', 'left'],
			description: 'Edge the drawer is attached to',
		},
		radius: {
			control: 'select',
			options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
			description: 'Border radius of the corners facing the page',
		},
		title: {
			control: 'text',
			description: 'Header title',
		},
	},
	args: {
		title: 'Settings',
		children: <LongBody />,
		footer: CancelAndSave,
	},
} satisfies Meta<typeof DrawerTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);
		const trigger = canvas.getByRole('button', { name: 'Open drawer' });

		await step('opens named by its title', async () => {
			await userEvent.click(trigger);
			await body.findByRole('dialog', { name: 'Settings' });
		});

		await step(
			'Escape closes it and returns focus to the trigger',
			async () => {
				await userEvent.keyboard('{Escape}');
				await waitForElementToBeRemoved(() => body.queryByRole('dialog'));
				await expectFocusOn(trigger);
			}
		);
	},
};

export const Left: Story = {
	args: { side: 'left' },
};

export const Sizes: Story = {
	args: { children: 'The width is set by the size prop.' },
	render: (args) => (
		<div className="flex gap-3">
			{(['sm', 'md', 'lg'] as const).map((size) => (
				<DrawerTrigger
					key={size}
					{...args}
					size={size}
					title={`Size ${size}`}
				/>
			))}
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(
			canvas.getAllByRole('button', { name: 'Open drawer' })[2]
		);

		await body.findByRole('dialog', { name: 'Size lg' });
	},
};

export const NonDismissible: Story = {
	args: {
		dismissible: false,
		children: 'Use the footer to leave.',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
		await body.findByRole('dialog', { name: 'Settings' });
		await userEvent.keyboard('{Escape}');
		await waitPastModalExitAnimation();

		await expect(body.getByRole('dialog', { name: 'Settings' })).toBeVisible();
	},
};

function DrawerWithConfirmContent() {
	const handleDiscard = () => {
		void ConfirmModal.call({
			title: 'Discard changes?',
			children: 'Your changes will be lost.',
		});
	};

	return <Button onClick={handleDiscard}>Discard changes…</Button>;
}

export const WithConfirmModal: Story = {
	args: {
		children: <DrawerWithConfirmContent />,
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
		const drawer = await body.findByRole('dialog', { name: 'Settings' });

		await step('the confirmation takes Escape first', async () => {
			await userEvent.click(
				body.getByRole('button', { name: 'Discard changes…' })
			);
			await body.findByRole('alertdialog', { name: 'Discard changes?' });
			await userEvent.keyboard('{Escape}');
			await waitForElementToBeRemoved(() => body.queryByRole('alertdialog'));
			await expect(drawer).toBeVisible();
		});

		await step('focus returns inside the drawer', async () => {
			await expect(drawer.contains(document.activeElement)).toBe(true);
		});
	},
};

const FORM_ID = 'drawer-profile-form';

const ProfileForm = () => (
	<form id={FORM_ID} className="space-y-4" onSubmit={(e) => e.preventDefault()}>
		<Input label="Name" required placeholder="Enter a name" />
		<Input label="Email" type="email" required placeholder="you@example.com" />
	</form>
);

export const WithForm: Story = {
	args: {
		title: 'Profile',
		children: <ProfileForm />,
		footer: (
			<>
				<Button variant="outline" color="neutral" size="sm">
					Cancel
				</Button>
				<Button size="sm" type="submit" form={FORM_ID}>
					Save
				</Button>
			</>
		),
	},
};

export const WithModalFooter: Story = {
	args: {
		title: 'Profile',
		footer: undefined,
		children: (
			<>
				<ProfileForm />
				<ModalFooter>{CancelAndSave}</ModalFooter>
			</>
		),
	},
};

export const NoSlideUnderReducedMotion: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = getPortalScope(canvasElement);

		await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
		const panel = await body.findByRole('dialog', { name: 'Settings' });
		await userEvent.click(body.getByRole('button', { name: 'Close' }));

		await expect(getComputedStyle(panel).translate).not.toContain('100%');
		await expect(getComputedStyle(panel).translate).toMatch(/^(none|0px)/);
	},
};
