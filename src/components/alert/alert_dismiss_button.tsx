import { IconButton } from '#components/icon_button/icon_button';
import { type ButtonColor } from '#components/shared/button_styles';
import { type Radius } from '#components/shared/radius';

interface AlertDismissButtonProps {
	label: string;
	color: ButtonColor;
	radius: Radius;
	unstyled: boolean;
	onClick: () => void;
}

/** @internal close button of an `Alert`, not part of the public API. */
export function AlertDismissButton({
	label,
	color,
	radius,
	unstyled,
	onClick,
}: Readonly<AlertDismissButtonProps>) {
	if (unstyled) {
		return (
			<IconButton
				icon="i-mdi-close"
				aria-label={label}
				className="min-h-6 min-w-6"
				unstyled
				onClick={onClick}
			/>
		);
	}

	return (
		<IconButton
			icon="i-mdi-close"
			aria-label={label}
			className="-my-0.5 -mr-1.5"
			variant="subtle"
			size="xs"
			color={color}
			radius={radius}
			onClick={onClick}
		/>
	);
}
