import '@testing-library/jest-dom/vitest';

import { describe, expect, test, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Textarea } from './textarea';

describe('Textarea', () => {
	test('renders label', () => {
		render(<Textarea label="Bio" />);
		expect(screen.getByLabelText('Bio')).toBeInTheDocument();
	});

	test('renders as uncontrolled with defaultValue', () => {
		render(<Textarea label="Bio" defaultValue="hello" />);
		expect(screen.getByLabelText('Bio')).toHaveValue('hello');
	});

	test('calls onChange while typing', () => {
		const handleChange = vi.fn();
		render(<Textarea label="Bio" onChange={handleChange} />);

		fireEvent.change(screen.getByLabelText('Bio'), {
			target: { value: 'a' },
		});

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	test('stays controlled by the value prop', () => {
		render(<Textarea label="Bio" value="fixed" onChange={vi.fn()} />);
		const textarea = screen.getByLabelText('Bio');

		fireEvent.change(textarea, { target: { value: 'changed' } });

		expect(textarea).toHaveValue('fixed');
	});

	test('shows an error message', () => {
		render(<Textarea label="Bio" error="Too long" />);
		expect(screen.getByText('Too long')).toBeInTheDocument();
	});

	test('shows character count when showCharCount and maxLength are set', () => {
		const { container } = render(
			<Textarea label="Bio" showCharCount maxLength={10} defaultValue="hello" />
		);
		expect(container.querySelector('.text-right')).toHaveTextContent(
			'5/10 max'
		);
	});

	test('forwards disabled to the textarea', () => {
		render(<Textarea label="Bio" disabled />);
		expect(screen.getByLabelText('Bio')).toBeDisabled();
	});

	test('unstyled variant drops the default input styling', () => {
		render(<Textarea label="Bio" unstyled />);
		expect(screen.getByLabelText('Bio')).not.toHaveClass('border-gray-300');
	});
});
