import clsx from 'clsx';
import { type CSSProperties } from 'react';

interface ToastTimerBarProps {
	duration: number;
	isRunning: boolean;
	isStyled: boolean;
}

/** @internal decorative countdown of a self-closing toast, not part of the public API. */
export function ToastTimerBar({
	duration,
	isRunning,
	isStyled,
}: Readonly<ToastTimerBarProps>) {
	const style: CSSProperties = {
		animationDuration: `${duration}ms`,
		animationFillMode: 'forwards',
		animationPlayState: isRunning ? 'running' : 'paused',
	};

	return (
		<span
			aria-hidden="true"
			data-ms-toast-timer-bar=""
			data-running={isRunning}
			style={style}
			className={clsx(
				'ms-toast-timer-bar',
				isStyled &&
					'absolute inset-x-0 bottom-0 h-0.5 origin-left bg-current opacity-40'
			)}
		/>
	);
}
