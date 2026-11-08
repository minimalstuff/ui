import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { Alert } from '#components/alert/alert';
import { Button } from '#components/button/button';

const RADIUS_OPTIONS = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const;

const meta = {
	title: 'Components/Alert',
	component: Alert,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	argTypes: {
		tone: {
			control: 'select',
			options: ['info', 'success', 'warning', 'danger'],
		},
		radius: { control: 'select', options: RADIUS_OPTIONS },
		role: { control: 'select', options: [undefined, 'alert', 'note'] },
		icon: { control: 'text' },
		unstyled: { control: 'boolean' },
	},
	args: {
		title: 'Heads up',
		children: 'Your changes are saved automatically.',
	},
	decorators: [
		(Story) => (
			<div className="w-96 max-w-full">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

async function expectCloseButtonReachable(
	canvasElement: HTMLElement,
	closeButton: HTMLElement
) {
	const { left, top, width, height } = closeButton.getBoundingClientRect();
	const hit = canvasElement.ownerDocument.elementFromPoint(
		left + width / 2,
		top + height / 2
	);
	await expect(closeButton.contains(hit)).toBe(true);
	await expect(width).toBeGreaterThanOrEqual(24);
	await expect(height).toBeGreaterThanOrEqual(24);
}

export const Default: Story = {};

export const Tones: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			<Alert tone="info" title="Information">
				A new version is available.
			</Alert>
			<Alert tone="success" title="Success">
				Your profile has been updated.
			</Alert>
			<Alert tone="warning" title="Warning">
				Your trial ends in 3 days.
			</Alert>
			<Alert tone="danger" title="Error">
				The payment could not be processed.
			</Alert>
		</div>
	),
};

export const WithoutTitle: Story = {
	args: { title: undefined, children: 'Your changes are saved automatically.' },
};

export const WithActions: Story = {
	args: {
		title: 'Install the app',
		children: 'Add it to your home screen to use it offline.',
		actions: (
			<>
				<Button size="sm" variant="solid" color="primary">
					Install
				</Button>
				<Button size="sm" variant="outline" color="primary">
					Later
				</Button>
			</>
		),
	},
};

function DynamicErrorDemo() {
	const [hasError, setHasError] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			<Button onClick={() => setHasError(true)}>Save</Button>
			{hasError && (
				<Alert
					tone="danger"
					role="alert"
					title="Could not save"
					actions={
						<Button
							size="sm"
							variant="outline"
							color="danger"
							onClick={() => setHasError(false)}
						>
							Retry
						</Button>
					}
				>
					The server did not answer. Check your connection.
				</Alert>
			)}
		</div>
	);
}

export const DynamicError: Story = {
	render: () => <DynamicErrorDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.queryByRole('alert')).toBeNull();
		await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
		const alert = await canvas.findByRole('alert');
		await expect(alert).toHaveTextContent('Could not save');
		await expect(
			within(alert).getByRole('button', { name: 'Retry' })
		).toBeVisible();
	},
};

function DismissibleDemo() {
	const [isVisible, setIsVisible] = useState(true);
	const headingReference = useRef<HTMLHeadingElement>(null);

	const handleDismiss = () => {
		setIsVisible(false);
		headingReference.current?.focus();
	};

	return (
		<div className="flex flex-col gap-3">
			<h2
				ref={headingReference}
				tabIndex={-1}
				className="text-lg font-semibold"
			>
				Notifications
			</h2>
			{isVisible && (
				<Alert tone="warning" title="Maintenance" onDismiss={handleDismiss}>
					The service will be unavailable tonight.
				</Alert>
			)}
		</div>
	);
}

export const Dismissible: Story = {
	render: () => <DismissibleDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const closeButton = canvas.getByRole('button', { name: 'Close' });
		await expectCloseButtonReachable(canvasElement, closeButton);
		await userEvent.click(closeButton);
		await waitFor(() => expect(canvas.queryByText('Maintenance')).toBeNull());
		await expect(
			canvas.getByRole('heading', { name: 'Notifications' })
		).toHaveFocus();
	},
};

export const LongText: Story = {
	args: {
		tone: 'danger',
		title: 'Verylongtitlewithoutanyspacesthatmustwrapinsidethealertbox',
		children:
			'This message is long on purpose so that it wraps over several lines while the icon and the close button stay aligned at the top of the alert. Averyveryverylongunbrokenwordtoprovethatnothingoverflowstherow.',
		onDismiss: () => undefined,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const closeButton = canvas.getByRole('button', { name: 'Close' });
		await expectCloseButtonReachable(canvasElement, closeButton);
		const alertBox = closeButton.parentElement;
		if (!alertBox) throw new Error('expected the alert root');
		await expect(alertBox.scrollWidth).toBeLessThanOrEqual(
			alertBox.clientWidth
		);
	},
};

export const WithoutIcon: Story = {
	args: { icon: false },
};

export const Radius: Story = {
	render: () => (
		<div className="flex flex-col gap-3">
			{RADIUS_OPTIONS.map((radius) => (
				<Alert key={radius} radius={radius} title={`radius ${radius}`}>
					Panel corner scale.
				</Alert>
			))}
		</div>
	),
};

export const Unstyled: Story = {
	args: { unstyled: true, onDismiss: () => undefined },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expectCloseButtonReachable(
			canvasElement,
			canvas.getByRole('button', { name: 'Close' })
		);
	},
};
