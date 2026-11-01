import clsx from 'clsx';
import type { MouseEventHandler, ReactNode, Ref } from 'react';

import { Button } from '#components/button/button';
import { IconButton } from '#components/icon_button/icon_button';
import { Menu } from '#components/menu/menu';
import { type MenuAlign } from '#components/menu/menu_align';
import {
	type ButtonColor,
	type ButtonVariant,
} from '#components/shared/button_styles';
import { type Radius } from '#components/shared/radius';
import { type ControlSize } from '#components/shared/sizes';
import {
	getTriggerHalfClasses,
	MAIN_HALF_CLASSES,
	SPLIT_HALF_FOCUS_CLASSES,
} from '#components/split_button/split_button_styles';

const DEFAULT_MENU_ICON = 'i-mdi-chevron-down';

type SplitButtonStyle =
	| { unstyled: true }
	| {
			unstyled?: false;
			variant?: ButtonVariant;
			color?: ButtonColor;
			radius?: Radius;
	  };

export type SplitButtonProps = {
	/** Label of the main button. */
	children: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	/** `MenuItem`s, `MenuGroup`s and `MenuSeparator`s offered by the chevron trigger. */
	menu: ReactNode;
	/** Accessible name of the chevron trigger, also shown as its tooltip. */
	menuLabel: string;
	menuIcon?: string;
	menuAlign?: MenuAlign;
	startIcon?: string;
	size?: ControlSize;
	/** Shows the main button's loading state and keeps the menu closed. */
	loading?: boolean;
	/** Disables both halves. */
	disabled?: boolean;
	/** Accessible name of the group formed by both halves. */
	'aria-label'?: string;
	/** Id of the element that names the group. Takes precedence over `aria-label`. */
	'aria-labelledby'?: string;
	/** Class on the wrapper around both halves. */
	className?: string;
	/** Ref to the main button. */
	ref?: Ref<HTMLButtonElement>;
} & SplitButtonStyle;

// See Button's `FlatButtonStyle` for why this cast is here.
type FlatSplitButtonStyle = {
	unstyled?: boolean;
	variant?: ButtonVariant;
	color?: ButtonColor;
	radius?: Radius;
};

/**
 * A primary action joined to a chevron `Menu` trigger that offers secondary
 * variants of that action. Both halves share variant, color, size and radius:
 * the inner corners are square. The menu cannot open while `disabled` or
 * `loading`; while loading, the trigger stays focusable as `aria-disabled`.
 */
export function SplitButton(splitButtonProps: Readonly<SplitButtonProps>) {
	const {
		children,
		onClick,
		menu,
		menuLabel,
		menuIcon = DEFAULT_MENU_ICON,
		menuAlign = 'end',
		startIcon,
		size = 'md',
		loading = false,
		disabled = false,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		className,
		ref,
		unstyled = false,
		variant = 'solid',
		color = 'primary',
		radius = 'md',
	} = splitButtonProps as SplitButtonProps & FlatSplitButtonStyle;
	const styleProps: SplitButtonStyle = unstyled
		? { unstyled: true }
		: { variant, color, radius };

	const trigger = (
		<IconButton
			icon={menuIcon}
			aria-label={menuLabel}
			tooltip
			size={size}
			disabled={disabled}
			aria-disabled={(loading && !disabled) || undefined}
			className={clsx(
				!unstyled && [
					SPLIT_HALF_FOCUS_CLASSES,
					getTriggerHalfClasses(variant, color),
				]
			)}
			{...styleProps}
		/>
	);

	return (
		<div
			role="group"
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledby}
			className={clsx('inline-flex', className)}
		>
			<Button
				ref={ref}
				size={size}
				startIcon={startIcon}
				loading={loading}
				disabled={disabled}
				onClick={onClick}
				className={clsx(
					!unstyled && [SPLIT_HALF_FOCUS_CLASSES, MAIN_HALF_CLASSES]
				)}
				{...styleProps}
			>
				{children}
			</Button>
			<Menu
				trigger={trigger}
				align={menuAlign}
				radius={radius}
				disabled={disabled || loading}
			>
				{menu}
			</Menu>
		</div>
	);
}
