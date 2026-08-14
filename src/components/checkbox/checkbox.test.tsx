import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
	test('renders label', () => {
		render(<Checkbox label="Accept terms" />);
		expect(screen.getByText('Accept terms')).toBeInTheDocument();
	});

	test('is unchecked by default', () => {
		render(<Checkbox label="Accept terms" />);
		expect(screen.getByRole('checkbox')).not.toBeChecked();
	});

	test('toggles when uncontrolled', () => {
		render(<Checkbox label="Accept terms" />);
		const checkbox = screen.getByRole('checkbox');

		fireEvent.click(checkbox);

		expect(checkbox).toBeChecked();
	});

	test('calls onChange with the new checked value', () => {
		const handleChange = vi.fn();
		render(<Checkbox label="Accept terms" onChange={handleChange} />);

		fireEvent.click(screen.getByRole('checkbox'));

		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange.mock.calls[0][0].target.checked).toBe(true);
	});

	test('stays controlled by the checked prop', () => {
		render(
			<Checkbox label="Accept terms" checked={false} onChange={vi.fn()} />
		);
		const checkbox = screen.getByRole('checkbox');

		fireEvent.click(checkbox);

		expect(checkbox).not.toBeChecked();
	});

	test('shows an error message wired to aria-describedby', () => {
		render(<Checkbox label="Accept terms" error="Required field" />);
		const checkbox = screen.getByRole('checkbox');
		const errorMessage = screen.getByRole('alert');

		expect(errorMessage).toHaveTextContent('Required field');
		expect(checkbox).toHaveAttribute('aria-invalid', 'true');
		expect(checkbox).toHaveAttribute('aria-describedby', errorMessage.id);
	});

	test('shows a description wired to aria-describedby', () => {
		render(<Checkbox label="Accept terms" description="Read the fine print" />);
		const checkbox = screen.getByRole('checkbox');
		const description = screen.getByText('Read the fine print');

		expect(checkbox).toHaveAttribute('aria-describedby', description.id);
	});

	test('forwards disabled to the input', () => {
		render(<Checkbox label="Accept terms" disabled />);
		expect(screen.getByRole('checkbox')).toBeDisabled();
	});

	test('unstyled variant drops the default box styling', () => {
		render(<Checkbox label="Accept terms" unstyled />);
		const box = screen.getByRole('checkbox').nextElementSibling;
		expect(box).not.toHaveClass('border-gray-300');
	});

	test('uses the caller id verbatim so external labels can target it', () => {
		render(<Checkbox label="Accept terms" id="terms" />);
		expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'terms');
	});

	test('marks a node label as required', () => {
		render(<Checkbox label={<span>Accept terms</span>} required />);
		expect(screen.getByText('*')).toBeInTheDocument();
	});
});
