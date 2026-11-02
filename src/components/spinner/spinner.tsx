import clsx from 'clsx';
import { useEffect, useState, type ComponentPropsWithRef } from 'react';

import { type ControlSize } from '#components/shared/sizes';
import { useLabels } from '#components/ui_provider/use_labels';

const ANNOUNCEMENT_DELAY = 0;

const ROOT_CLASSES = 'inline-flex items-center gap-2';

const SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-sm',
	lg: 'text-base',
};

const ICON_SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'w-3.5 h-3.5',
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
};

export type SpinnerProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
	size?: ControlSize;
	/** Visible text next to the icon. Without it, `labels.loading` is announced instead. */
	label?: string;
	/** Strips the built-in layout, text size and icon size; size the icon with `iconClassName`. */
	unstyled?: boolean;
	iconClassName?: string;
	labelClassName?: string;
};

/**
 * A loading indicator exposed as a `role="status"` live region. It uses the
 * icon `Button` shows while loading; under `prefers-reduced-motion` it swaps
 * to a static icon.
 *
 * The region is empty on first render and filled right after mount, because
 * many screen readers ignore a live region inserted already filled. The most
 * robust setup is still a persistent `role="status"` wrapper in your own
 * markup that stays mounted while a `Spinner` appears and disappears inside it.
 */
export function Spinner(spinnerProps: Readonly<SpinnerProps>) {
	const {
		size = 'md',
		label,
		unstyled = false,
		className,
		iconClassName,
		labelClassName,
		...rest
	} = spinnerProps;
	const labels = useLabels();
	const [isAnnounced, setIsAnnounced] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(
			() => setIsAnnounced(true),
			ANNOUNCEMENT_DELAY
		);
		return () => clearTimeout(timeoutId);
	}, []);

	const text = label ?? labels.loading;
	const iconClasses = clsx(!unstyled && ICON_SIZE_CLASSES[size], iconClassName);

	return (
		<span
			role="status"
			{...rest}
			className={clsx(
				!unstyled && [ROOT_CLASSES, SIZE_CLASSES[size]],
				className
			)}
		>
			<span
				className={clsx(
					'i-svg-spinners-3-dots-fade ms-spinner-animated',
					iconClasses
				)}
				aria-hidden="true"
			/>
			<span
				className={clsx('i-mdi-loading ms-spinner-static', iconClasses)}
				aria-hidden="true"
			/>
			{isAnnounced && (
				<span className={label === undefined ? 'sr-only' : labelClassName}>
					{text}
				</span>
			)}
		</span>
	);
}
