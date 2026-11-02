import clsx from 'clsx';

import {
	BUTTON_COLOR_TOKENS,
	BUTTON_INTERACTIVE_CLASSES,
	BUTTON_LAYOUT_CLASSES,
	getButtonToneClasses,
	type ButtonColor,
	type ButtonVariant,
} from '#components/shared/button_styles';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { type ControlSize } from '#components/shared/sizes';

const SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'px-2 py-1 text-xs',
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-sm',
	lg: 'px-4 py-3 text-base',
};

export type ButtonClassNameOptions = {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ControlSize;
	radius?: Radius;
	fullWidth?: boolean;
	/**
	 * Applies the pressed look, for a real `<button>` toggle paired with
	 * `aria-pressed`. Never put `aria-pressed` on a link (not allowed on role
	 * link): on an `<a>`, pair the selected look with `aria-current`, for
	 * example `aria-current="page"`.
	 */
	pressed?: boolean;
	/** Keeps only the layout classes, like `Button`'s `unstyled` prop. */
	unstyled?: boolean;
	className?: string;
};

/**
 * The exact class string `Button` renders, for styling another element as a
 * button, typically a router `<Link>` or an `<a>`. Keyboard focus ring included.
 * For a selected link, add `pressed` and `aria-current`, not `aria-pressed`.
 */
export function buttonClassName(
	options: Readonly<ButtonClassNameOptions> = {}
): string {
	const {
		variant = 'solid',
		color = 'primary',
		size = 'md',
		radius = 'md',
		fullWidth = false,
		pressed = false,
		unstyled = false,
		className,
	} = options;

	return clsx(
		BUTTON_LAYOUT_CLASSES,
		!unstyled && [
			BUTTON_INTERACTIVE_CLASSES,
			'gap-2 font-medium border',
			RADIUS_CLASSES[radius],
			SIZE_CLASSES[size],
			getButtonToneClasses(color, variant, pressed),
			BUTTON_COLOR_TOKENS[color].focusOutline,
		],
		fullWidth && 'w-full',
		className
	);
}
