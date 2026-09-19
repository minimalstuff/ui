import clsx from 'clsx';
import type { ReactNode } from 'react';

import { FieldError } from '#components/shared/field_error';
import {
	FIELD_LABEL_TEXT,
	FIELD_REQUIRED_MARK,
} from '#components/shared/field_styles';

interface FieldProps {
	fieldId: string;
	errorId: string;
	label?: ReactNode;
	error?: string;
	required?: boolean;
	wrapperClassName?: string;
	children: ReactNode;
}

/**
 * Wrapper, label and error message shared by the text-entry fields (Input,
 * Textarea, Select, Combobox). A string `label` becomes a real `<label>` bound
 * to `fieldId`; any other node is rendered untouched so callers can supply
 * their own markup, with the required mark appended either way.
 */
export const Field = ({
	fieldId,
	errorId,
	label,
	error,
	required = false,
	wrapperClassName,
	children,
}: Readonly<FieldProps>) => (
	<div className={clsx('w-full', wrapperClassName)}>
		{label !== undefined &&
			(typeof label === 'string' ? (
				<label
					id={`${fieldId}-label`}
					className={clsx(FIELD_LABEL_TEXT, 'block mb-1')}
					htmlFor={fieldId}
				>
					{label}
					{required && (
						<span className={FIELD_REQUIRED_MARK} aria-hidden="true">
							*
						</span>
					)}
				</label>
			) : (
				<>
					{label}
					{required && (
						<span className={FIELD_REQUIRED_MARK} aria-hidden="true">
							*
						</span>
					)}
				</>
			))}
		{children}
		<FieldError id={errorId} error={error} className="mt-1" />
	</div>
);
