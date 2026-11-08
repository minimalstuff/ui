import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { Alert } from '#components/alert/alert';
import { type AlertTone } from '#components/alert/alert_tone';
import { FRENCH_UI_LABELS } from '#components/ui_provider/french_ui_labels';
import { UIProvider } from '#components/ui_provider/ui_provider';

const DEFAULT_ICONS: Record<AlertTone, string> = {
	info: 'i-mdi-information-outline',
	success: 'i-mdi-check-circle-outline',
	warning: 'i-mdi-alert-outline',
	danger: 'i-mdi-alert-circle-outline',
};

function getRoot(container: HTMLElement): HTMLElement {
	const root = container.firstElementChild;
	if (!(root instanceof HTMLElement)) throw new Error('expected a root');
	return root;
}

function getIcon(container: HTMLElement): Element | null {
	return container.querySelector('span[aria-hidden="true"]');
}

describe('Alert', () => {
	test('should have no role when none is given', () => {
		const { container } = render(<Alert>Body</Alert>);
		expect(getRoot(container)).not.toHaveAttribute('role');
	});

	test('should apply role alert when requested', () => {
		render(<Alert role="alert">Body</Alert>);
		expect(screen.getByRole('alert')).toHaveTextContent('Body');
	});

	test('should apply role note when requested', () => {
		render(<Alert role="note">Body</Alert>);
		expect(screen.getByRole('note')).toHaveTextContent('Body');
	});

	test('should render the title in a div and not a heading when a string is given', () => {
		render(<Alert title="Heads up">Body</Alert>);
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
		expect(screen.getByText('Heads up').tagName).toBe('DIV');
	});

	test('should keep the heading level when a heading is passed as title', () => {
		render(<Alert title={<h3>Heads up</h3>}>Body</Alert>);
		expect(
			screen.getByRole('heading', { level: 3, name: 'Heads up' })
		).toBeInTheDocument();
	});

	test.each(Object.entries(DEFAULT_ICONS))(
		'should render the default aria-hidden icon when the tone is %s',
		(tone, iconClass) => {
			const { container } = render(
				<Alert tone={tone as AlertTone}>Body</Alert>
			);
			const icon = getIcon(container);
			expect(icon).toHaveClass(iconClass);
			expect(icon).toHaveAttribute('aria-hidden', 'true');
		}
	);

	test('should render no icon when icon is false', () => {
		const { container } = render(<Alert icon={false}>Body</Alert>);
		expect(getIcon(container)).not.toBeInTheDocument();
	});

	test('should render the custom icon with the tone colour when icon is a class', () => {
		const { container } = render(
			<Alert tone="danger" icon="i-mdi-bell">
				Body
			</Alert>
		);
		const icon = getIcon(container);
		expect(icon).toHaveClass('i-mdi-bell', 'text-red-600');
		expect(icon).not.toHaveClass('i-mdi-alert-circle-outline');
	});

	test('should render no close button when onDismiss is missing', () => {
		render(<Alert>Body</Alert>);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	test('should name the close button Close when onDismiss is given', () => {
		render(<Alert onDismiss={() => {}}>Body</Alert>);
		expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
	});

	test('should name the close button in French when the provider uses French labels', () => {
		render(
			<UIProvider labels={FRENCH_UI_LABELS}>
				<Alert onDismiss={() => {}}>Body</Alert>
			</UIProvider>
		);
		expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
	});

	test('should name the close button with dismissLabel when it is given', () => {
		render(
			<Alert onDismiss={() => {}} dismissLabel="Dismiss the banner">
				Body
			</Alert>
		);
		expect(
			screen.getByRole('button', { name: 'Dismiss the banner' })
		).toBeInTheDocument();
	});

	test('should call onDismiss once when the close button is clicked', () => {
		const onDismiss = vi.fn<() => void>();
		render(<Alert onDismiss={onDismiss}>Body</Alert>);
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(onDismiss).toHaveBeenCalledTimes(1);
	});

	test('should render the actions when actions are given', () => {
		render(<Alert actions={<button type="button">Retry</button>}>Body</Alert>);
		expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
	});

	test('should strip tone, surface and default icon when unstyled', () => {
		const { container } = render(
			<Alert tone="danger" unstyled>
				Body
			</Alert>
		);
		const root = getRoot(container);
		expect(root).not.toHaveClass('border', 'bg-red-50', 'px-4', 'rounded-lg');
		expect(root).toHaveClass('flex', 'gap-3');
		expect(getIcon(container)).not.toBeInTheDocument();
	});

	test('should render a custom icon without tone colour when unstyled', () => {
		const { container } = render(
			<Alert tone="danger" icon="i-mdi-bell" unstyled>
				Body
			</Alert>
		);
		const icon = getIcon(container);
		expect(icon).toHaveClass('i-mdi-bell');
		expect(icon).not.toHaveClass('text-red-600');
	});

	test('should keep a 24px close button when unstyled', () => {
		render(
			<Alert unstyled onDismiss={() => {}}>
				Body
			</Alert>
		);
		expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
			'min-h-6',
			'min-w-6'
		);
	});

	test('should apply the lg radius when none is given', () => {
		const { container } = render(<Alert>Body</Alert>);
		expect(getRoot(container)).toHaveClass('rounded-lg');
	});

	test('should cap the radius at rounded-lg when radius is full', () => {
		const { container } = render(<Alert radius="full">Body</Alert>);
		expect(getRoot(container)).toHaveClass('rounded-lg');
		expect(getRoot(container)).not.toHaveClass('rounded-full');
	});

	test('should apply the radius class when radius is none', () => {
		const { container } = render(<Alert radius="none">Body</Alert>);
		expect(getRoot(container)).toHaveClass('rounded-none');
	});

	test('should forward the ref to the root', () => {
		const ref = createRef<HTMLDivElement>();
		const { container } = render(<Alert ref={ref}>Body</Alert>);
		expect(ref.current).toBe(getRoot(container));
	});

	test('should spread id, data attributes and className on the root', () => {
		const { container } = render(
			<Alert id="banner" data-testid="alert" className="custom">
				Body
			</Alert>
		);
		const root = getRoot(container);
		expect(root).toHaveAttribute('id', 'banner');
		expect(root).toHaveAttribute('data-testid', 'alert');
		expect(root).toHaveClass('custom', 'flex');
	});
});
