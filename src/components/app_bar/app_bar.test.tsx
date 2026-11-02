import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { axe } from 'vitest-axe';

import { AppBar } from '#components/app_bar/app_bar';

function renderAppBar(props: Parameters<typeof AppBar>[0] = {}) {
	return render(
		<AppBar
			start={<a href="/">Home</a>}
			title="Dashboard"
			end={<button type="button">Settings</button>}
			{...props}
		/>
	);
}

describe('AppBar', () => {
	test('should expose the banner landmark', () => {
		renderAppBar();
		expect(screen.getByRole('banner')).toBeInTheDocument();
	});

	test('should render the start, title and end slots', () => {
		renderAppBar();
		expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: 'Settings' })
		).toBeInTheDocument();
	});

	test('should apply the three-column grid and minimum height by default', () => {
		renderAppBar();
		expect(screen.getByRole('banner')).toHaveClass(
			'grid',
			'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
			'min-h-8'
		);
	});

	test('should let the slots shrink and truncate the title instead of overflowing', () => {
		renderAppBar();
		const titleSlot = screen.getByText('Dashboard');
		expect(titleSlot).toHaveClass('min-w-0', 'truncate');
		expect(
			screen.getByRole('link', { name: 'Home' }).parentElement
		).toHaveClass('min-w-0');
		expect(
			screen.getByRole('button', { name: 'Settings' }).parentElement
		).toHaveClass('min-w-0');
	});

	test('should drop the default classes when unstyled', () => {
		renderAppBar({ unstyled: true, className: 'custom' });
		const banner = screen.getByRole('banner');
		expect(banner).toHaveClass('custom');
		expect(banner).not.toHaveClass('grid');
		expect(banner).not.toHaveClass('border-b');
	});

	test('should apply the slot class hooks', () => {
		renderAppBar({ startClassName: 'start-hook', endClassName: 'end-hook' });
		expect(
			screen.getByRole('link', { name: 'Home' }).parentElement
		).toHaveClass('start-hook');
		expect(
			screen.getByRole('button', { name: 'Settings' }).parentElement
		).toHaveClass('end-hook');
	});

	test('should have no accessibility violations', async () => {
		const { container } = renderAppBar();
		expect(await axe(container)).toHaveNoViolations();
	});
});
