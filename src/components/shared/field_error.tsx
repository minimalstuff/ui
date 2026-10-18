import clsx from 'clsx';

import { FIELD_ERROR_TEXT } from '#components/shared/field_styles';
import { useAnnounceFieldErrors } from '#components/ui_provider/use_announce_field_errors';

interface FieldErrorProps {
	id: string;
	error?: string;
	className?: string;
}

/**
 * Error message for a field. Renders nothing without an `error`, so callers can
 * mount it unconditionally. It is a live region (`role="alert"`) unless
 * `UIProvider` sets `announceFieldErrors` to `false`. Spacing is left to `className`: fields that indent
 * their message past a control need their own margins.
 */
export const FieldError = ({
	id,
	error,
	className,
}: Readonly<FieldErrorProps>) => {
	const announceFieldErrors = useAnnounceFieldErrors();

	if (!error) return null;

	return (
		<p
			id={id}
			className={clsx(FIELD_ERROR_TEXT, className)}
			role={announceFieldErrors ? 'alert' : undefined}
		>
			{error}
		</p>
	);
};
