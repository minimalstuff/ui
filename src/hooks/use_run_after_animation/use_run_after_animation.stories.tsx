import { useRunAfterAnimation } from '#hooks/use_run_after_animation/use_run_after_animation';
import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const DURATION_MS = 400;

function DemoBox() {
	const [shouldRender, setShouldRender] = useState(true);
	const [isExiting, setIsExiting] = useState(false);
	const runAfterAnimation = useRunAfterAnimation(DURATION_MS);

	useEffect(() => {
		if (!isExiting) return;
		return runAfterAnimation(() => setShouldRender(false));
	}, [isExiting, runAfterAnimation]);

	const handleRemove = () => setIsExiting(true);

	if (!shouldRender) {
		return (
			<div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 text-sm text-gray-500 dark:text-gray-400">
				Box removed after animation finished.
			</div>
		);
	}

	return (
		<div
			className={clsx(
				'rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-opacity duration-[400ms]',
				isExiting ? 'opacity-0' : 'opacity-100'
			)}
			style={{ transitionDuration: `${DURATION_MS}ms` }}
		>
			<p className="text-gray-700 dark:text-gray-300 mb-4">
				This box fades out over {DURATION_MS}ms. After the animation completes,
				the callback from <code>useRunAfterAnimation</code> runs and the content
				is replaced.
			</p>
			<button
				type="button"
				onClick={handleRemove}
				className="px-4 py-2 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
			>
				Remove (run after animation)
			</button>
		</div>
	);
}

const meta = {
	title: 'Hooks/useRunAfterAnimation',
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	render: () => <DemoBox />,
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
