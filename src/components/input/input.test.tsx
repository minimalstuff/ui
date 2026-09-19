import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Input } from './input';

describe('Input', () => {
	test('renders label', () => {
		render(<Input label="Email" />);
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
	});

	test('renders as uncontrolled with defaultValue', () => {
		render(<Input label="Email" defaultValue="hi@example.com" />);
		expect(screen.getByLabelText('Email')).toHaveValue('hi@example.com');
	});

	test('calls onChange while typing', () => {
		const handleChange = vi.fn();
		render(<Input label="Email" onChange={handleChange} />);

		fireEvent.change(screen.getByLabelText('Email'), {
			target: { value: 'a' },
		});

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	test('stays controlled by the value prop', () => {
		render(<Input label="Email" value="fixed" onChange={vi.fn()} />);
		const input = screen.getByLabelText('Email');

		fireEvent.change(input, { target: { value: 'changed' } });

		expect(input).toHaveValue('fixed');
	});

	test('shows an error message wired to aria-describedby', () => {
		render(<Input label="Email" error="Invalid email" />);
		const input = screen.getByLabelText('Email');
		const errorMessage = screen.getByRole('alert');

		expect(errorMessage).toHaveTextContent('Invalid email');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
	});

	test('shows character count when showCharCount and maxLength are set', () => {
		const { container } = render(
			<Input label="Bio" showCharCount maxLength={10} defaultValue="hello" />
		);
		expect(container.querySelector('.text-right')).toHaveTextContent(
			'5/10 max'
		);
	});

	test('merges a caller-supplied aria-describedby with the error id', () => {
		render(<Input label="Email" aria-describedby="hint" error="Invalid" />);
		const input = screen.getByLabelText('Email');
		const errorMessage = screen.getByRole('alert');
		const describedBy = input.getAttribute('aria-describedby');

		expect(describedBy).toContain('hint');
		expect(describedBy).toContain(errorMessage.id);
	});

	test('keeps only the caller-supplied aria-describedby when nothing else applies', () => {
		render(<Input label="Email" aria-describedby="hint" />);
		expect(screen.getByLabelText('Email')).toHaveAttribute(
			'aria-describedby',
			'hint'
		);
	});

	test('includes the character count id in the accessible description', () => {
		render(
			<Input label="Bio" showCharCount maxLength={10} defaultValue="hello" />
		);
		const input = screen.getByLabelText('Bio');
		expect(input).toHaveAccessibleDescription('5/10 max');
	});

	test('does not add a character count id when showCharCount is off', () => {
		render(<Input label="Bio" maxLength={10} defaultValue="hello" />);
		expect(screen.getByLabelText('Bio')).not.toHaveAttribute(
			'aria-describedby'
		);
	});

	test('forwards disabled to the input', () => {
		render(<Input label="Email" disabled />);
		expect(screen.getByLabelText('Email')).toBeDisabled();
	});

	test('unstyled variant drops the default input styling', () => {
		render(<Input label="Email" unstyled />);
		expect(screen.getByLabelText('Email')).not.toHaveClass('border-gray-300');
	});

	test('uses the caller id verbatim so external labels can target it', () => {
		render(<Input label="Email" id="email" />);
		expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
	});

	test('generates a unique id when none is given', () => {
		render(
			<>
				<Input label="First" />
				<Input label="Second" />
			</>
		);
		expect(screen.getByLabelText('First').id).not.toBe(
			screen.getByLabelText('Second').id
		);
	});

	test('marks a node label as required', () => {
		render(<Input label={<span>Email</span>} required />);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('renders no required mark when there is no label', () => {
		render(<Input required />);
		expect(screen.queryByText('*')).not.toBeInTheDocument();
	});
});
