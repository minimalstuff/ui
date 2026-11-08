import clsx from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import { AlertDismissButton } from '#components/alert/alert_dismiss_button';
import {
	ALERT_BUTTON_COLORS,
	ALERT_DEFAULT_ICONS,
	ALERT_ICON_COLOR_CLASSES,
	ALERT_TONE_CLASSES,
} from '#components/alert/alert_styles';
import { type AlertTone } from '#components/alert/alert_tone';
import { PANEL_RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { useLabels } from '#components/ui_provider/use_labels';

export type { AlertTone } from '#components/alert/alert_tone';

export interface AlertProps extends Omit<
	ComponentPropsWithRef<'div'>,
	'title' | 'role'
> {
	/** Colour and default icon of the alert. Defaults to `'info'`. */
	tone?: AlertTone;
	/**
	 * Bold first line, rendered in a `<div>` and not a heading. For a real
	 * section heading, pass an `<h2>` to `<h6>` element.
	 */
	title?: ReactNode;
	/**
	 * UnoCSS icon class replacing the tone's default icon, or `false` for none.
	 * The icon is decorative (`aria-hidden`): state the tone in the text, never
	 * by colour alone.
	 */
	icon?: string | false;
	children?: ReactNode;
	/**
	 * Buttons shown under the text. Recommended: a primary `Button`
	 * `variant="solid"` and a secondary `variant="outline"`, both with the
	 * tone's `color` (info: `primary`, success: `success`, warning: `warning`,
	 * danger: `danger`). Avoid `ghost` and `subtle`: a subtle fill equals the
	 * alert fill and is invisible at rest.
	 */
	actions?: ReactNode;
	/**
	 * Shows the close button and is called when it is clicked. The consumer
	 * moves focus once the alert is removed (for example to the next sensible
	 * element).
	 */
	onDismiss?: () => void;
	/** Accessible name of the close button. Defaults to `labels.close`. */
	dismissLabel?: string;
	/**
	 * No role by default: right for a box present from the first render.
	 * Use `role="alert"` for an error inserted after a user action, and
	 * `role="note"` for an aside. There is no `role="status"`: announce changes
	 * through a toast or a live region of your own.
	 */
	role?: 'alert' | 'note';
	/** Corner radius. `full` caps at `lg`. Defaults to `lg`. */
	radius?: Radius;
	/**
	 * Strips surface, border, padding, radius, font size, tone colours and the
	 * default icon. Keeps the layout, the bold title and the actions row.
	 */
	unstyled?: boolean;
}

function resolveIconClass({
	icon,
	tone,
	unstyled,
}: Readonly<{
	icon: string | false | undefined;
	tone: AlertTone;
	unstyled: boolean;
}>): string | undefined {
	if (icon === false) return undefined;
	if (icon !== undefined) return icon;
	return unstyled ? undefined : ALERT_DEFAULT_ICONS[tone];
}

export function Alert({
	tone = 'info',
	title,
	icon,
	children,
	actions,
	onDismiss,
	dismissLabel,
	radius = 'lg',
	unstyled = false,
	className,
	...props
}: Readonly<AlertProps>) {
	const labels = useLabels();
	const iconClass = resolveIconClass({ icon, tone, unstyled });

	return (
		<div
			className={clsx(
				'flex items-start gap-3',
				!unstyled && [
					'px-4 py-3 border text-sm',
					PANEL_RADIUS_CLASSES[radius],
					ALERT_TONE_CLASSES[tone],
				],
				className
			)}
			{...props}
		>
			{iconClass && (
				<span
					aria-hidden="true"
					className={clsx(
						'h-5 w-5 shrink-0',
						iconClass,
						!unstyled && ALERT_ICON_COLOR_CLASSES[tone]
					)}
				/>
			)}
			<div className="min-w-0 flex-1 break-words">
				{title && <div className="font-semibold">{title}</div>}
				{children}
				{actions && <div className="mt-2 flex flex-wrap gap-2">{actions}</div>}
			</div>
			{onDismiss && (
				<AlertDismissButton
					label={dismissLabel ?? labels.close}
					color={ALERT_BUTTON_COLORS[tone]}
					radius={radius}
					unstyled={unstyled}
					onClick={onDismiss}
				/>
			)}
		</div>
	);
}
