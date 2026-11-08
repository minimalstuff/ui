import clsx from 'clsx';
import { type ReactNode } from 'react';

import { AlertDismissButton } from '#components/alert/alert_dismiss_button';
import {
	ALERT_BUTTON_COLORS,
	ALERT_ICON_COLOR_CLASSES,
	ALERT_DEFAULT_ICONS,
	ALERT_TONE_CLASSES,
} from '#components/alert/alert_styles';
import { type AlertTone } from '#components/alert/alert_tone';
import { Button } from '#components/button/button';
import { PANEL_RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { ToastTimerBar } from '#components/toast/toast_timer_bar';
import { type ToastAction } from '#components/toast/toast_types';

interface ToasterItemContentProps {
	tone: AlertTone;
	message: ReactNode;
	description?: string;
	action?: ToastAction;
	radius: Radius;
	unstyled: boolean;
	closeLabel: string;
	timerDuration: number | null;
	isTimerRunning: boolean;
	timerKey: number;
	onAction: () => void;
	onDismiss: () => void;
}

/** @internal visual content of one toast, not part of the public API. */
export function ToasterItemContent({
	tone,
	message,
	description,
	action,
	radius,
	unstyled,
	closeLabel,
	timerDuration,
	isTimerRunning,
	timerKey,
	onAction,
	onDismiss,
}: Readonly<ToasterItemContentProps>) {
	return (
		<div
			className={clsx(
				'flex items-start gap-3',
				!unstyled && [
					'relative overflow-hidden px-4 py-3 border text-sm',
					PANEL_RADIUS_CLASSES[radius],
					ALERT_TONE_CLASSES[tone],
				]
			)}
		>
			{!unstyled && (
				<span
					aria-hidden="true"
					className={clsx(
						'h-5 w-5 shrink-0',
						ALERT_DEFAULT_ICONS[tone],
						ALERT_ICON_COLOR_CLASSES[tone]
					)}
				/>
			)}
			<div className="min-w-0 flex-1 break-words">
				<div data-ms-toast-text="">
					<div className={clsx(description && 'font-semibold')}>{message}</div>
					{description && <div>{description}</div>}
				</div>
				{action && (
					<div className="mt-2">
						{unstyled ? (
							<Button unstyled onClick={onAction}>
								{action.label}
							</Button>
						) : (
							<Button
								size="sm"
								variant="solid"
								color={ALERT_BUTTON_COLORS[tone]}
								radius={radius}
								onClick={onAction}
							>
								{action.label}
							</Button>
						)}
					</div>
				)}
			</div>
			<AlertDismissButton
				label={closeLabel}
				color={ALERT_BUTTON_COLORS[tone]}
				radius={radius}
				unstyled={unstyled}
				onClick={onDismiss}
			/>
			{timerDuration !== null && (
				<ToastTimerBar
					key={timerKey}
					duration={timerDuration}
					isRunning={isTimerRunning}
					isStyled={!unstyled}
				/>
			)}
		</div>
	);
}
