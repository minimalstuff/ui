import '@testing-library/jest-dom/vitest';

import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { CopyButton } from './copy_button';

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
		const writeText = vi.fn().mockResolvedValue(undefined);
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
		const onError = vi.fn();
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
		const onError = vi.fn();
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
});
