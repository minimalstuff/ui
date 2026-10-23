import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { axe } from 'vitest-axe';

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
		const handleChange = vi.fn<() => void>();
		render(<Textarea label="Bio" onChange={handleChange} />);

		fireEvent.change(screen.getByLabelText('Bio'), {
			target: { value: 'a' },
		});

		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	test('stays controlled by the value prop', () => {
		render(
			<Textarea label="Bio" value="fixed" onChange={vi.fn<() => void>()} />
		);
		const textarea = screen.getByLabelText('Bio');

		fireEvent.change(textarea, { target: { value: 'changed' } });

		expect(textarea).toHaveValue('fixed');
	});

	test('shows an error message wired to aria-describedby', () => {
		render(<Textarea label="Bio" error="Too long" />);
		const textarea = screen.getByLabelText('Bio');
		const errorMessage = screen.getByText('Too long');

		expect(errorMessage).toHaveTextContent('Too long');
		expect(textarea).toHaveAttribute('aria-invalid', 'true');
		expect(textarea).toHaveAttribute('aria-describedby', errorMessage.id);
	});

	test('shows character count when showCharCount and maxLength are set', () => {
		const { container } = render(
			<Textarea label="Bio" showCharCount maxLength={10} defaultValue="hello" />
		);
		expect(container.querySelector('.text-right')).toHaveTextContent(
			'5/10 max'
		);
	});

	test('merges a caller-supplied aria-describedby with the error id', () => {
		render(<Textarea label="Bio" aria-describedby="hint" error="Too long" />);
		const textarea = screen.getByLabelText('Bio');
		const errorMessage = screen.getByText('Too long');
		const describedBy = textarea.getAttribute('aria-describedby');

		expect(describedBy).toContain('hint');
		expect(describedBy).toContain(errorMessage.id);
	});

	test('keeps only the caller-supplied aria-describedby when nothing else applies', () => {
		render(<Textarea label="Bio" aria-describedby="hint" />);
		expect(screen.getByLabelText('Bio')).toHaveAttribute(
			'aria-describedby',
			'hint'
		);
	});

	test('includes the character count id in the accessible description', () => {
		render(
			<Textarea label="Bio" showCharCount maxLength={10} defaultValue="hello" />
		);
		expect(screen.getByLabelText('Bio')).toHaveAccessibleDescription(
			'5/10 max'
		);
	});

	test('does not add a character count id when showCharCount is off', () => {
		render(<Textarea label="Bio" maxLength={10} defaultValue="hello" />);
		expect(screen.getByLabelText('Bio')).not.toHaveAttribute(
			'aria-describedby'
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

	test('uses the caller id verbatim so external labels can target it', () => {
		render(<Textarea label="Bio" id="bio" />);
		expect(screen.getByLabelText('Bio')).toHaveAttribute('id', 'bio');
	});

	test('marks a node label as required', () => {
		render(<Textarea label={<span>Bio</span>} required />);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('renders no required mark when there is no label', () => {
		render(<Textarea required />);
		expect(screen.queryByText('*')).not.toBeInTheDocument();
	});

	test('should link the description through aria-describedby when description is set', () => {
		render(<Textarea label="Bio" description="Help text" />);
		expect(screen.getByLabelText('Bio')).toHaveAccessibleDescription(
			'Help text'
		);
	});

	test('should merge caller aria-describedby with description and error', () => {
		render(
			<>
				<p id="hint">Hint</p>
				<Textarea
					label="Bio"
					aria-describedby="hint"
					description="Help text"
					error="Too long"
				/>
			</>
		);
		expect(screen.getByLabelText('Bio')).toHaveAccessibleDescription(
			'Hint Help text Too long'
		);
	});

	test('should render a non-string description node', () => {
		render(<Textarea label="Bio" description={<em>Rich help</em>} />);
		expect(screen.getByText('Rich help')).toBeInTheDocument();
	});

	test('should be described by the error when error is set', () => {
		render(<Textarea label="Bio" error="Too long" />);
		expect(screen.getByLabelText('Bio')).toHaveAccessibleDescription(
			'Too long'
		);
	});

	test('should have no axe violations with label, description and error', async () => {
		const { container } = render(
			<Textarea label="Bio" description="Help text" error="Too long" />
		);
		expect(await axe(container)).toHaveNoViolations();
	});
});
