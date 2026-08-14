import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { Avatar } from './avatar';

describe('Avatar', () => {
	test('renders the first letter of the name', () => {
		render(<Avatar name="Sonny" />);
		expect(screen.getByRole('img')).toHaveTextContent('S');
	});

	test('uppercases the initial', () => {
		render(<Avatar name="sonny" />);
		expect(screen.getByRole('img')).toHaveTextContent('S');
	});

	test('ignores leading whitespace when deriving the initial', () => {
		render(<Avatar name="   sonny" />);
		expect(screen.getByRole('img')).toHaveTextContent('S');
	});

	test('renders no initial for a blank name', () => {
		render(<Avatar name="   " />);
		expect(screen.getByRole('img')).toHaveTextContent('');
	});

	test('announces the full name instead of the initial', () => {
		render(<Avatar name="Sonny Dev" />);
		expect(screen.getByRole('img', { name: 'Sonny Dev' })).toBeInTheDocument();
	});

	test('applies the requested size', () => {
		render(<Avatar name="Sonny" size="lg" />);
		expect(screen.getByRole('img')).toHaveClass('h-12');
	});

	test('applies the requested color', () => {
		render(<Avatar name="Sonny" color="danger" />);
		expect(screen.getByRole('img')).toHaveClass('bg-red-600');
	});

	test('is round by default', () => {
		render(<Avatar name="Sonny" />);
		expect(screen.getByRole('img')).toHaveClass('rounded-full');
	});

	test('applies the requested radius', () => {
		render(<Avatar name="Sonny" radius="md" />);
		expect(screen.getByRole('img')).toHaveClass('rounded-md');
	});

	test('drops color and radius classes when unstyled', () => {
		render(<Avatar name="Sonny" unstyled />);
		const avatar = screen.getByRole('img');
		expect(avatar).not.toHaveClass('bg-blue-600');
		expect(avatar).not.toHaveClass('rounded-full');
	});

	test('keeps its size when unstyled', () => {
		render(<Avatar name="Sonny" unstyled size="lg" />);
		expect(screen.getByRole('img')).toHaveClass('h-12');
	});

	test('forwards a custom className', () => {
		render(<Avatar name="Sonny" className="custom" />);
		expect(screen.getByRole('img')).toHaveClass('custom');
	});

	describe('with a picture', () => {
		const SOURCE = 'https://github.com/Sonny93.png';

		test('renders the image instead of the initial', () => {
			const { container } = render(<Avatar name="Sonny" src={SOURCE} />);

			expect(container.querySelector('img')).toHaveAttribute('src', SOURCE);
			expect(screen.getByRole('img')).toHaveTextContent('');
		});

		test('drops the fill so it cannot ring the picture', () => {
			render(<Avatar name="Sonny" src={SOURCE} />);
			expect(screen.getByRole('img')).not.toHaveClass('bg-blue-600');
		});

		test('stays clipped to its radius', () => {
			render(<Avatar name="Sonny" src={SOURCE} />);
			expect(screen.getByRole('img')).toHaveClass('rounded-full');
		});

		test('restores the fill when it falls back to the initial', () => {
			const { container } = render(<Avatar name="Sonny" src={SOURCE} />);
			const image = container.querySelector('img');
			if (!image) throw new Error('expected an image to be rendered');

			fireEvent.error(image);

			expect(screen.getByRole('img')).toHaveClass('bg-blue-600');
		});

		test('keeps the name as the accessible label', () => {
			render(<Avatar name="Sonny Dev" src={SOURCE} />);
			expect(
				screen.getByRole('img', { name: 'Sonny Dev' })
			).toBeInTheDocument();
		});

		test('falls back to the initial when the image fails to load', () => {
			const { container } = render(<Avatar name="Sonny" src={SOURCE} />);
			const image = container.querySelector('img');
			if (!image) throw new Error('expected an image to be rendered');

			fireEvent.error(image);

			expect(container.querySelector('img')).not.toBeInTheDocument();
			expect(screen.getByRole('img')).toHaveTextContent('S');
		});

		test('retries when pointed at a different source', () => {
			const { container, rerender } = render(
				<Avatar name="Sonny" src={SOURCE} />
			);
			const image = container.querySelector('img');
			if (!image) throw new Error('expected an image to be rendered');
			fireEvent.error(image);

			rerender(<Avatar name="Sonny" src="https://example.com/other.png" />);

			expect(container.querySelector('img')).toHaveAttribute(
				'src',
				'https://example.com/other.png'
			);
		});
	});
});
