import { Button } from '#components/button/button';
import { Input } from '#components/input/input';
import { Modal } from '#components/modal/modal';
import { Select } from '#components/select/select';
import { Textarea } from '#components/textarea/textarea';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

type ModalWrapperProps = Omit<
	React.ComponentProps<typeof Modal>,
	'isOpen' | 'onClose'
> & { defaultOpen?: boolean };

function ModalWrapper({
	defaultOpen = false,
	title,
	children,
	footer,
	size,
	className,
}: ModalWrapperProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);
	return (
		<>
			<Button onClick={() => setIsOpen(true)}>Open modal</Button>
			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				title={title}
				footer={footer}
				size={size}
				className={className}
			>
				{children}
			</Modal>
		</>
	);
}

const meta = {
	title: 'Example/Modal',
	component: Modal,
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
		title: {
			control: 'text',
			description: 'Header title',
		},
		children: {
			control: 'text',
			description: 'Body content',
		},
		defaultOpen: {
			control: 'boolean',
			description: 'Open by default in story',
		},
	},
	args: {
		title: 'Modal title',
		children: 'Modal content goes here.',
		size: 'md',
		defaultOpen: false,
	},
	render: (args) => <ModalWrapper {...args} />,
} satisfies Meta<typeof ModalWrapper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithoutTitle: Story = {
	args: {
		title: undefined,
		children: 'This modal has no header.',
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

export const WithFooter: Story = {
	args: {
		title: 'Modal with footer',
		children: 'This modal has a footer with action buttons.',
		footer: (
			<>
				<Button variant="secondary" size="sm">
					Cancel
				</Button>
				<Button variant="primary" size="sm">
					Save
				</Button>
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
			</>
		),
		footer: (
			<>
				<Button variant="secondary" size="sm">
					Cancel
				</Button>
				<Button variant="primary" size="sm">
					Confirm
				</Button>
			</>
		),
	},
};

export const SmallForm: Story = {
	args: {
		title: 'Create user',
		size: 'md',
		children: (
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
		),
		footer: (
			<>
				<Button variant="secondary" size="sm">
					Cancel
				</Button>
				<Button variant="primary" size="sm">
					Create
				</Button>
			</>
		),
	},
};

export const LongForm: Story = {
	args: {
		title: 'Complete profile',
		size: 'lg',
		children: (
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
		),
		footer: (
			<>
				<Button variant="secondary" size="sm">
					Cancel
				</Button>
				<Button variant="primary" size="sm">
					Save profile
				</Button>
			</>
		),
	},
};
