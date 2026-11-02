import '@testing-library/jest-dom/vitest';

import { act, render, screen, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Spinner } from '#components/spinner/spinner';
import { UIProvider } from '#components/ui_provider/ui_provider';

describe('Spinner', () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	test('should expose a status role', () => {
		render(<Spinner />);
		expect(screen.getByRole('status')).toBeInTheDocument();
	});

	test('should render the status region empty on mount and fill it after the effect', () => {
		const html = renderToString(<Spinner />);
		expect(html).not.toContain('Loading');

		vi.useFakeTimers();
		render(<Spinner />);
		expect(screen.getByRole('status').textContent).toBe('');

		act(() => {
			vi.advanceTimersByTime(0);
		});
		expect(screen.getByRole('status')).toHaveTextContent('Loading');
	});

	test('should announce the loading label when no label is given', async () => {
		render(<Spinner />);
		expect(await screen.findByText('Loading')).toHaveClass('sr-only');
	});

	test('should announce the translated loading label from UIProvider', async () => {
		render(
			<UIProvider labels={{ loading: 'Chargement' }}>
				<Spinner />
			</UIProvider>
		);
		expect(await screen.findByText('Chargement')).toBeInTheDocument();
	});

	test('should show a custom label visibly instead of the loading label', async () => {
		render(<Spinner label="Saving" />);
		expect(await screen.findByText('Saving')).not.toHaveClass('sr-only');
		expect(screen.queryByText('Loading')).not.toBeInTheDocument();
	});

	test('should hide both icons from assistive technology', () => {
		const { container } = render(<Spinner />);
		const icons = container.querySelectorAll('[aria-hidden="true"]');
		expect(icons).toHaveLength(2);
	});

	test('should animate the Button loading icon and keep a static icon for reduced motion', () => {
		const { container } = render(<Spinner />);
		expect(container.querySelector('.i-svg-spinners-3-dots-fade')).toHaveClass(
			'ms-spinner-animated'
		);
		expect(container.querySelector('.i-mdi-loading')).toHaveClass(
			'ms-spinner-static'
		);
	});

	test('should size the icon from the size prop', () => {
		const { container } = render(<Spinner size="lg" />);
		expect(container.querySelector('.i-mdi-loading')).toHaveClass('w-6', 'h-6');
	});

	test('should strip built-in styling when unstyled but keep the icon switch', () => {
		const { container } = render(
			<Spinner unstyled className="mine" iconClassName="icon-mine" />
		);
		const status = screen.getByRole('status');
		expect(status).toHaveClass('mine');
		expect(status).not.toHaveClass('inline-flex');
		const animatedIcon = container.querySelector('.i-svg-spinners-3-dots-fade');
		expect(animatedIcon).toHaveClass('icon-mine', 'ms-spinner-animated');
		expect(animatedIcon).not.toHaveClass('w-5');
	});

	test('should merge className onto the root', () => {
		render(<Spinner className="custom" />);
		expect(screen.getByRole('status')).toHaveClass('custom', 'inline-flex');
	});

	test('should have no accessibility violations', async () => {
		const { container } = render(<Spinner label="Saving" />);
		await waitFor(() => expect(screen.getByText('Saving')).toBeInTheDocument());
		expect(await axe(container)).toHaveNoViolations();
	});
});
