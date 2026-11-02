import '@testing-library/jest-dom/vitest';

import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { CopyButton } from '#components/copy_button/copy_button';
import { UIProvider } from '#components/ui_provider/ui_provider';

function stubClipboard(writeText: (text: string) => Promise<void>) {
	Object.defineProperty(navigator, 'clipboard', {
		value: { writeText },
		configurable: true,
	});
}

describe('CopyButton', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		stubClipboard(vi.fn().mockResolvedValue(undefined));
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	test('starts uncopied', () => {
		render(
			<CopyButton value="hello">
				{({ copied }) => <span>{copied ? 'copied' : 'idle'}</span>}
			</CopyButton>
		);
		expect(screen.getByText('idle')).toBeInTheDocument();
	});

	test('writes the value to the clipboard and flips to copied', async () => {
		const writeText = vi
			.fn<(text: string) => Promise<void>>()
			.mockResolvedValue(undefined);
		stubClipboard(writeText);

		render(
			<CopyButton value="hello">
				{({ copied, copy }) => (
					<button onClick={() => void copy()}>
						{copied ? 'copied' : 'idle'}
					</button>
				)}
			</CopyButton>
		);

		await act(async () => {
			screen.getByRole('button').click();
		});

		expect(writeText).toHaveBeenCalledWith('hello');
		expect(screen.getByText('copied')).toBeInTheDocument();
	});

	test('reverts to uncopied after the indicator timeout', async () => {
		render(
			<CopyButton value="hello">
				{({ copied, copy }) => (
					<button onClick={() => void copy()}>
						{copied ? 'copied' : 'idle'}
					</button>
				)}
			</CopyButton>
		);

		await act(async () => {
			screen.getByRole('button').click();
		});
		expect(screen.getByText('copied')).toBeInTheDocument();

		await act(async () => {
			vi.advanceTimersByTime(2_000);
		});
		expect(screen.getByText('idle')).toBeInTheDocument();
	});

	test('stays uncopied when the clipboard write fails', async () => {
		const onError = vi.fn<() => void>();
		stubClipboard(vi.fn().mockRejectedValue(new Error('denied')));

		render(
			<CopyButton value="hello" onError={onError}>
				{({ copied, copy }) => (
					<button onClick={() => void copy()}>
						{copied ? 'copied' : 'idle'}
					</button>
				)}
			</CopyButton>
		);

		await act(async () => {
			screen.getByRole('button').click();
		});

		expect(screen.getByText('idle')).toBeInTheDocument();
	});

	test('reports the failure to onError instead of swallowing it', async () => {
		const onError = vi.fn<() => void>();
		const clipboardError = new Error('denied');
		stubClipboard(vi.fn().mockRejectedValue(clipboardError));

		render(
			<CopyButton value="hello" onError={onError}>
				{({ copy }) => <button onClick={() => void copy()}>copy</button>}
			</CopyButton>
		);

		await act(async () => {
			screen.getByRole('button').click();
		});

		expect(onError).toHaveBeenCalledWith(clipboardError);
	});

	test('should announce the copy in a status region when the copy succeeds', async () => {
		render(
			<CopyButton value="hello">
				{({ copy }) => <button onClick={() => void copy()}>copy</button>}
			</CopyButton>
		);
		expect(screen.getByRole('status')).toBeEmptyDOMElement();

		await act(async () => {
			screen.getByRole('button').click();
		});
		await act(async () => {
			vi.advanceTimersByTime(0);
		});

		expect(screen.getByRole('status')).toHaveTextContent('Copied');
	});

	test('should re-announce when copied twice within the indicator window', async () => {
		render(
			<CopyButton value="hello">
				{({ copy }) => <button onClick={() => void copy()}>copy</button>}
			</CopyButton>
		);
		await act(async () => {
			screen.getByRole('button').click();
		});
		await act(async () => {
			vi.advanceTimersByTime(0);
		});
		expect(screen.getByRole('status')).toHaveTextContent('Copied');

		await act(async () => {
			screen.getByRole('button').click();
		});
		expect(screen.getByRole('status')).toBeEmptyDOMElement();

		await act(async () => {
			vi.advanceTimersByTime(0);
		});
		expect(screen.getByRole('status')).toHaveTextContent('Copied');
	});

	describe('default UI', () => {
		test('should render an icon button named Copy when children are omitted', () => {
			const { container } = render(<CopyButton value="hello" />);
			expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
			expect(
				container.querySelector('.i-mdi-content-copy')
			).toBeInTheDocument();
		});

		test('should name the button from the label prop', () => {
			render(<CopyButton value="hello" label="Copy the command" />);
			expect(
				screen.getByRole('button', { name: 'Copy the command' })
			).toBeInTheDocument();
		});

		test('should name the button from the copy label of UIProvider', () => {
			render(
				<UIProvider labels={{ copy: 'Copier' }}>
					<CopyButton value="hello" />
				</UIProvider>
			);
			expect(
				screen.getByRole('button', { name: 'Copier' })
			).toBeInTheDocument();
		});

		test('should swap the copy icon for a check while copied', async () => {
			const { container } = render(<CopyButton value="hello" />);

			await act(async () => {
				screen.getByRole('button').click();
			});

			expect(container.querySelector('.i-mdi-check')).toBeInTheDocument();
			expect(container.querySelector('.i-mdi-content-copy')).toBeNull();

			await act(async () => {
				vi.advanceTimersByTime(2_000);
			});
			expect(
				container.querySelector('.i-mdi-content-copy')
			).toBeInTheDocument();
		});

		test('should write the value and announce the copy', async () => {
			const writeText = vi
				.fn<(text: string) => Promise<void>>()
				.mockResolvedValue(undefined);
			stubClipboard(writeText);
			render(<CopyButton value="hello" />);

			await act(async () => {
				screen.getByRole('button').click();
			});
			await act(async () => {
				vi.advanceTimersByTime(0);
			});

			expect(writeText).toHaveBeenCalledWith('hello');
			expect(screen.getByRole('status')).toHaveTextContent('Copied');
		});

		test('should keep the render prop in charge when children are given', () => {
			render(
				<CopyButton value="hello" label="ignored">
					{() => <button>custom</button>}
				</CopyButton>
			);
			expect(screen.getAllByRole('button')).toHaveLength(1);
			expect(
				screen.getByRole('button', { name: 'custom' })
			).toBeInTheDocument();
		});
	});
});
