import clsx from 'clsx';
import type { ReactNode } from 'react';

import { FIELD_DESCRIPTION_TEXT } from '#components/shared/field_styles';

interface FieldDescriptionProps {
	id: string;
	description?: ReactNode;
	className?: string;
}

/**
 * Helper text for a field. A string becomes a `<p>`; any other node becomes a
 * `<span>` so callers can nest block markup without landing inside a paragraph.
 */
export const FieldDescription = ({
	id,
	description,
	className,
}: Readonly<FieldDescriptionProps>) => {
	if (!description) return null;

	if (typeof description === 'string') {
		return (
			<p id={id} className={clsx(FIELD_DESCRIPTION_TEXT, className)}>
				{description}
			</p>
		);
	}

	return (
		<span id={id} className={clsx(FIELD_DESCRIPTION_TEXT, 'block', className)}>
			{description}
		</span>
	);
};
