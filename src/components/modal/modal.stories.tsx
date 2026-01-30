import { Button } from '#components/button/button';
import { Modal } from '#components/modal/modal';
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
