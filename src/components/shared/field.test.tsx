import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Combobox } from '#components/combobox/combobox';
import { Input } from '#components/input/input';
import { MultiCombobox } from '#components/multi_combobox/multi_combobox';
import { Select } from '#components/select/select';
import { Textarea } from '#components/textarea/textarea';
import { Field } from './field';

const OPTIONS = [{ value: 'fr', label: 'France' }];
const NODE_LABEL = <span>Email</span>;

describe('Field', () => {
	test('renders a string label bound to the field via htmlFor', () => {
		render(
			<Field fieldId="email" errorId="email-error" label="Email">
				<input id="email" />
			</Field>
		);
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
	});

	test('marks a string label as required', () => {
		render(
			<Field fieldId="email" errorId="email-error" label="Email" required>
				<input id="email" />
			</Field>
		);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('marks a node label as required', () => {
		render(
			<Field
				fieldId="email"
				errorId="email-error"
				label={<span>Email</span>}
				required
			>
				<input id="email" />
			</Field>
		);
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	test('renders no required mark when there is no label to attach it to', () => {
		render(
			<Field fieldId="email" errorId="email-error" required>
				<input id="email" />
			</Field>
		);
		expect(screen.queryByText('*')).not.toBeInTheDocument();
	});

	test('excludes the required mark from the accessible name', () => {
		render(
			<Field fieldId="email" errorId="email-error" label="Email" required>
				<input id="email" />
			</Field>
		);
		expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
	});

	test('shows the error message wired to the given errorId', () => {
		render(
			<Field fieldId="email" errorId="email-error" error="Invalid email">
				<input id="email" />
			</Field>
		);
		const errorMessage = screen.getByText('Invalid email');
		expect(errorMessage).toHaveTextContent('Invalid email');
		expect(errorMessage).toHaveAttribute('id', 'email-error');
	});

	test('should render the description wired to the given descriptionId', () => {
		render(
			<Field
				fieldId="email"
				errorId="email-error"
				descriptionId="email-description"
				description="We never share it"
			>
				<input id="email" />
			</Field>
		);
		expect(screen.getByText('We never share it')).toHaveAttribute(
			'id',
			'email-description'
		);
	});

	test('should render no label span when the node label renders nothing', () => {
		const { container } = render(
			<Field fieldId="email" errorId="email-error" label={null}>
				<input id="email" />
			</Field>
		);
		expect(container.querySelector('#email-label')).toBeNull();
	});

	test('should wrap a node label in a span carrying the label id', () => {
		render(
			<Field fieldId="email" errorId="email-error" label={NODE_LABEL}>
				<input id="email" />
			</Field>
		);
		expect(screen.getByText('Email').parentElement).toHaveAttribute(
			'id',
			'email-label'
		);
	});
});

describe('node label binding', () => {
	test.each([
		['textbox', 'Input', <Input key="a" label={NODE_LABEL} />],
		['textbox', 'Textarea', <Textarea key="a" label={NODE_LABEL} />],
		[
			'combobox',
			'Select',
			<Select key="a" label={NODE_LABEL} options={OPTIONS} />,
		],
		[
			'combobox',
			'Combobox',
			<Combobox key="a" label={NODE_LABEL} options={OPTIONS} />,
		],
		[
			'combobox',
			'MultiCombobox',
			<MultiCombobox key="a" label={NODE_LABEL} options={OPTIONS} />,
		],
	])(
		'should name the %s control by the label when %s gets a node label',
		(role, _component, element) => {
			render(element);
			expect(screen.getByRole(role, { name: 'Email' })).toBeInTheDocument();
		}
	);

	test('should keep the consumer aria-label when a node label is also given', () => {
		render(<Input label={NODE_LABEL} aria-label="Courriel" />);
		expect(
			screen.getByRole('textbox', { name: 'Courriel' })
		).toBeInTheDocument();
	});
});
