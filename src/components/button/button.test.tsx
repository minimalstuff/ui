import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/react';
import type { SyntheticEvent } from 'react';
import { describe, expect, test, vi } from 'vitest';

import { Button } from '#components/button/button';
import { buttonClassName } from '#components/button/button_class_name';

describe('Button', () => {
	test('renders children', () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole('button', { name: 'Click me' })
		).toBeInTheDocument();
	});

	test('applies default variant and size', () => {
		render(<Button>Submit</Button>);
		const btn = screen.getByRole('button');
		expect(btn).toHaveClass('bg-blue-600');
		expect(btn).toHaveClass('px-4', 'py-2');
	});

	test('applies color class', () => {
		render(<Button color="danger">Delete</Button>);
		expect(screen.getByRole('button')).toHaveClass('bg-red-600');
	});

	test('applies variant class', () => {
		render(
			<Button variant="outline" color="neutral">
				Cancel
			</Button>
		);
		expect(screen.getByRole('button')).toHaveClass('border-gray-300');
	});

	test('forwards disabled', () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	test('keeps a loading button natively enabled and marks it aria-disabled', () => {
		render(<Button loading>Submit</Button>);
		const button = screen.getByRole('button');
		expect(button).not.toBeDisabled();
		expect(button).toHaveAttribute('aria-disabled', 'true');
	});

	test('lets a loading button receive focus', () => {
		render(<Button loading>Submit</Button>);
		const button = screen.getByRole('button');
		button.focus();
		expect(button).toHaveFocus();
	});

	test('does not mark an idle button aria-disabled', () => {
		render(<Button>Submit</Button>);
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-disabled');
	});

	test('calls onClick when idle', () => {
		const onClick = vi.fn<() => void>();
		render(<Button onClick={onClick}>Submit</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	test('does not call onClick when a loading button is clicked', () => {
		const onClick = vi.fn<() => void>();
		render(
			<Button loading onClick={onClick}>
				Submit
			</Button>
		);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).not.toHaveBeenCalled();
	});

	test('does not submit the form when a loading submit button is clicked', () => {
		const onSubmit = vi.fn<
			(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void
		>((event) => {
			event.preventDefault();
		});
		render(
			<form onSubmit={onSubmit}>
				<Button type="submit" loading>
					Submit
				</Button>
			</form>
		);
		fireEvent.click(screen.getByRole('button'));
		expect(onSubmit).not.toHaveBeenCalled();
	});

	test('keeps an explicitly disabled button natively disabled while loading', () => {
		render(
			<Button disabled loading>
				Submit
			</Button>
		);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	test('marks the button busy while loading', () => {
		render(<Button loading>Submit</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
	});

	test('shows an animated spinner and a static one for reduced motion while loading', () => {
		const { container } = render(<Button loading>Submit</Button>);
		expect(container.querySelector('.i-svg-spinners-3-dots-fade')).toHaveClass(
			'ms-spinner-animated'
		);
		expect(container.querySelector('.i-mdi-loading')).toHaveClass(
			'ms-spinner-static'
		);
	});

	test('renders no spinner when not loading', () => {
		const { container } = render(<Button>Submit</Button>);
		expect(container.querySelector('.i-mdi-loading')).toBeNull();
	});

	test('is not marked busy when not loading', () => {
		render(<Button>Submit</Button>);
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
	});

	test('unstyled drops the padding and typography classes', () => {
		render(<Button unstyled>Submit</Button>);
		expect(screen.getByRole('button')).not.toHaveClass('px-4');
	});

	test('unstyled keeps the icon layout classes', () => {
		render(<Button unstyled>Submit</Button>);
		expect(screen.getByRole('button')).toHaveClass('inline-flex');
	});

	test('should include the loading label in the accessible name when loading', () => {
		render(<Button loading>Save</Button>);
		expect(
			screen.getByRole('button', { name: 'Save Loading' })
		).toBeInTheDocument();
	});

	test('should append the loading label to aria-label when loading', () => {
		render(
			<Button loading aria-label="Save">
				Save
			</Button>
		);
		expect(
			screen.getByRole('button', { name: 'Save Loading' })
		).toBeInTheDocument();
	});

	describe('pressed', () => {
		test('should not set aria-pressed when pressed is undefined', () => {
			render(<Button>Bold</Button>);
			expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
		});

		test.each([true, false])('should set aria-pressed to %s', (isPressed) => {
			render(<Button pressed={isPressed}>Bold</Button>);
			expect(screen.getByRole('button')).toHaveAttribute(
				'aria-pressed',
				String(isPressed)
			);
		});

		test('should darken a pressed solid button', () => {
			render(<Button pressed>Bold</Button>);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-blue-800');
			expect(button).not.toHaveClass('bg-blue-600');
		});

		test('should add an inset ring cue, not only a darker shade', () => {
			render(<Button pressed>Bold</Button>);
			expect(screen.getByRole('button')).toHaveClass('ring-2', 'ring-inset');
		});

		test('should fill a pressed outline button with the pressed fill', () => {
			render(
				<Button variant="outline" pressed>
					Bold
				</Button>
			);
			const button = screen.getByRole('button');
			expect(button).toHaveClass('bg-blue-800', 'text-white');
			expect(button).not.toHaveClass('bg-transparent');
		});

		test('should keep the unpressed look when pressed is false', () => {
			render(
				<Button variant="outline" pressed={false}>
					Bold
				</Button>
			);
			expect(screen.getByRole('button')).toHaveClass('bg-transparent');
		});
	});

	describe('buttonClassName', () => {
		const VARIANTS = ['solid', 'outline', 'ghost', 'subtle'] as const;
		const COLORS = [
			'primary',
			'neutral',
			'danger',
			'success',
			'warning',
		] as const;

		test.each(VARIANTS)(
			'should equal the classes of a %s Button for every colour',
			(variant) => {
				for (const color of COLORS) {
					const { unmount } = render(
						<Button
							variant={variant}
							color={color}
							size="lg"
							radius="full"
							fullWidth
						>
							Go
						</Button>
					);
					expect(screen.getByRole('button').className).toBe(
						buttonClassName({
							variant,
							color,
							size: 'lg',
							radius: 'full',
							fullWidth: true,
						})
					);
					unmount();
				}
			}
		);

		test('should equal the classes of a pressed and a custom-class Button', () => {
			render(
				<Button variant="subtle" pressed className="extra">
					Go
				</Button>
			);
			expect(screen.getByRole('button').className).toBe(
				buttonClassName({
					variant: 'subtle',
					pressed: true,
					className: 'extra',
				})
			);
		});

		test('should equal the classes of an unstyled Button', () => {
			render(<Button unstyled>Go</Button>);
			expect(screen.getByRole('button').className).toBe(
				buttonClassName({ unstyled: true })
			);
		});

		test('should include the focus ring so a link can be styled as a button', () => {
			render(
				<a href="/home" className={buttonClassName({ color: 'danger' })}>
					Home
				</a>
			);
			expect(screen.getByRole('link')).toHaveClass(
				'focus-visible:outline-red-500',
				'inline-flex'
			);
		});
	});
});

test('accepts explicit undefined for every optional prop', () => {
	render(
		<Button
			pressed={undefined}
			loading={undefined}
			size={undefined}
			fullWidth={undefined}
			className={undefined}
			startIcon={undefined}
			endIcon={undefined}
			variant={undefined}
			color={undefined}
			radius={undefined}
		>
			Submit
		</Button>
	);
	expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
});
