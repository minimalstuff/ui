import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Switch } from './switch';

describe('Switch', () => {
	test('renders label', () => {
		render(<Switch label="Enable notifications" />);
		expect(screen.getByText('Enable notifications')).toBeInTheDocument();
	});

	test('is off by default', () => {
		render(<Switch label="Enable notifications" />);
		expect(screen.getByRole('switch')).not.toBeChecked();
	});

	test('toggles when uncontrolled', () => {
		render(<Switch label="Enable notifications" />);
		const toggle = screen.getByRole('switch');

		fireEvent.click(toggle);

		expect(toggle).toBeChecked();
	});

	test('calls onChange with the new checked value', () => {
		const handleChange = vi.fn();
		render(<Switch label="Enable notifications" onChange={handleChange} />);

		fireEvent.click(screen.getByRole('switch'));

		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange.mock.calls[0][0].target.checked).toBe(true);
	});

	test('stays controlled by the checked prop', () => {
		render(
			<Switch label="Enable notifications" checked={false} onChange={vi.fn()} />
		);
		const toggle = screen.getByRole('switch');

		fireEvent.click(toggle);

		expect(toggle).not.toBeChecked();
	});

	test('shows an error message wired to aria-describedby', () => {
		render(<Switch label="Enable notifications" error="Required field" />);
		const toggle = screen.getByRole('switch');
		const errorMessage = screen.getByRole('alert');

		expect(errorMessage).toHaveTextContent('Required field');
		expect(toggle).toHaveAttribute('aria-invalid', 'true');
		expect(toggle).toHaveAttribute('aria-describedby', errorMessage.id);
	});

	test('shows a description wired to aria-describedby', () => {
		render(
			<Switch label="Enable notifications" description="Read the fine print" />
		);
		const toggle = screen.getByRole('switch');
		const description = screen.getByText('Read the fine print');

		expect(toggle).toHaveAttribute('aria-describedby', description.id);
	});

	test('forwards disabled to the input', () => {
		render(<Switch label="Enable notifications" disabled />);
		expect(screen.getByRole('switch')).toBeDisabled();
	});

	test('unstyled drops the default track styling', () => {
		render(<Switch label="Enable notifications" unstyled />);
		const track = screen.getByRole('switch').parentElement;
		expect(track).not.toHaveClass('rounded-full');
	});
});
