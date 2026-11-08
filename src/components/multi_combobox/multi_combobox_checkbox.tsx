import clsx from 'clsx';

import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	CONTROL_BG,
	CONTROL_BORDER,
	SELECTED_FILL,
} from '#components/shared/surface_tokens';

type MultiComboboxCheckboxProps = {
	isSelected: boolean;
	unstyled: boolean;
	radius: Radius;
};

export function MultiComboboxCheckbox({
	isSelected,
	unstyled,
	radius,
}: Readonly<MultiComboboxCheckboxProps>) {
	return (
		<span
			aria-hidden
			className={clsx(
				'flex h-4 w-4 shrink-0 items-center justify-center',
				!unstyled && [
					'border-2',
					RADIUS_CLASSES[radius],
					isSelected
						? clsx('border-blue-600 dark:border-blue-500', SELECTED_FILL)
						: clsx(CONTROL_BORDER, CONTROL_BG),
				]
			)}
		>
			{isSelected && (
				<svg
					className="h-3 w-3 text-white"
					viewBox="0 0 12 12"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="2 6 5 9 10 3" />
				</svg>
			)}
		</span>
	);
}
