import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Card } from './card';

describe('Card', () => {
	test('renders its children', () => {
		render(<Card>Section body</Card>);
		expect(screen.getByText('Section body')).toBeInTheDocument();
	});

	test('renders the title as a heading', () => {
		render(<Card title="Active sessions">Section body</Card>);
		expect(
			screen.getByRole('heading', { name: 'Active sessions' })
		).toBeInTheDocument();
	});

	test('renders the title as a level 2 heading by default', () => {
		render(<Card title="Active sessions">Section body</Card>);
		expect(
			screen.getByRole('heading', { name: 'Active sessions', level: 2 })
		).toBeInTheDocument();
	});

	test('renders the requested heading level', () => {
		render(
			<Card title="Active sessions" headingLevel={3}>
				Section body
			</Card>
		);
		expect(
			screen.getByRole('heading', { name: 'Active sessions', level: 3 })
		).toBeInTheDocument();
	});

	test('exposes a titled card as a region named after its title', () => {
		render(<Card title="Active sessions">Section body</Card>);
		expect(
			screen.getByRole('region', { name: 'Active sessions' })
		).toBeInTheDocument();
	});

	test('stays a plain container when it has no title to name it', () => {
		render(<Card>Section body</Card>);
		expect(screen.queryByRole('region')).not.toBeInTheDocument();
	});

	test('omits the heading when no title is given', () => {
		render(<Card>Section body</Card>);
		expect(screen.queryByRole('heading')).not.toBeInTheDocument();
	});

	test('renders the description under the title', () => {
		render(
			<Card title="Email address" description="The address you sign in with.">
				Section body
			</Card>
		);
		expect(
			screen.getByText('The address you sign in with.')
		).toBeInTheDocument();
	});

	test('renders actions next to the title', () => {
		render(
			<Card title="API Tokens" actions={<button>Create token</button>}>
				Section body
			</Card>
		);
		expect(
			screen.getByRole('button', { name: 'Create token' })
		).toBeInTheDocument();
	});

	test('ignores the description when no title is given', () => {
		render(<Card description="Orphan description">Section body</Card>);
		expect(screen.queryByText('Orphan description')).not.toBeInTheDocument();
	});

	test('applies the default padding', () => {
		const { container } = render(<Card>Section body</Card>);
		expect(container.firstChild).toHaveClass('p-6');
	});

	test('applies the requested padding', () => {
		const { container } = render(<Card padding="sm">Section body</Card>);
		expect(container.firstChild).toHaveClass('p-4');
	});

	test('applies the requested radius', () => {
		const { container } = render(<Card radius="none">Section body</Card>);
		expect(container.firstChild).toHaveClass('rounded-none');
	});

	test('drops surface classes when unstyled', () => {
		const { container } = render(<Card unstyled>Section body</Card>);
		expect(container.firstChild).not.toHaveClass('border');
		expect(container.firstChild).not.toHaveClass('p-6');
	});

	test('keeps the header when unstyled', () => {
		render(
			<Card unstyled title="Active sessions">
				Section body
			</Card>
		);
		expect(
			screen.getByRole('heading', { name: 'Active sessions' })
		).toBeInTheDocument();
	});

	test('forwards a custom className', () => {
		const { container } = render(<Card className="custom">Section body</Card>);
		expect(container.firstChild).toHaveClass('custom');
	});
});
