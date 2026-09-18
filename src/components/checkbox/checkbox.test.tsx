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

	test('shrinks to content width by default', () => {
		const { container } = render(<Checkbox label="Accept terms" />);
		expect(container.firstChild).toHaveClass('w-fit');
	});

	test('spans the full width when fullWidth is set', () => {
		const { container } = render(<Checkbox label="Accept terms" fullWidth />);
		expect(container.firstChild).toHaveClass('w-full');
	});

	test('uses the caller id verbatim so external labels can target it', () => {
		render(<Checkbox label="Accept terms" id="terms" />);
		expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'terms');
	});

	test('marks a node label as required', () => {
		render(<Checkbox label={<span>Accept terms</span>} required />);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('applies the radius to the focus ring wrapper and the box alike', () => {
		render(<Checkbox label="Accept terms" radius="full" />);
		const box = screen.getByRole('checkbox').nextElementSibling;
		expect(box?.parentElement).toHaveClass('rounded-full');
	});

	test('renders no required mark when there is no label', () => {
		render(<Checkbox required />);
		expect(screen.queryByText('*')).not.toBeInTheDocument();
	});

	test('defaults to the inline variant when variant is omitted', () => {
		render(<Checkbox label="Accept terms" />);
		const label = screen.getByRole('checkbox').closest('label');
		expect(label).not.toHaveClass('border');
	});

	test('card variant applies card chrome to the label', () => {
		render(<Checkbox label="Accept terms" variant="card" />);
		const label = screen.getByRole('checkbox').closest('label');
		expect(label).toHaveClass('border');
	});

	test('card variant applies the selected styling when checked', () => {
		render(<Checkbox label="Accept terms" variant="card" defaultChecked />);
		const label = screen.getByRole('checkbox').closest('label');
		expect(label).toHaveClass('border-blue-500');
	});

	test('card variant applies the error styling when there is an error', () => {
		render(
			<Checkbox label="Accept terms" variant="card" error="Required field" />
		);
		const label = screen.getByRole('checkbox').closest('label');
		expect(label).toHaveClass('border-red-300');
	});

	test('description stays associated with the input in the card variant', () => {
		render(
			<Checkbox
				label="Accept terms"
				description="Read the fine print"
				variant="card"
			/>
		);
		const checkbox = screen.getByRole('checkbox');
		const description = screen.getByText('Read the fine print');

		expect(checkbox).toHaveAttribute('aria-describedby', description.id);
	});

	test('card variant with unstyled drops the card padding', () => {
		render(<Checkbox label="Accept terms" variant="card" unstyled />);
		const label = screen.getByRole('checkbox').closest('label');
		expect(label).not.toHaveClass('px-3');
	});

	test('renders the error message in the card variant', () => {
		render(
			<Checkbox label="Accept terms" variant="card" error="Required field" />
		);
		expect(screen.getByRole('alert')).toHaveTextContent('Required field');
	});
});
