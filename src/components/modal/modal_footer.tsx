import { useContext, useEffect, type ReactNode } from 'react';

import { ModalFooterSetterContext } from '#components/modal/modal';

export interface ModalFooterProps {
	children: ReactNode;
}

/**
 * Declares `children` as the modal's pinned footer, wherever this is
 * rendered in the content tree — including inside a separate content
 * component, any number of levels below `Modal`'s own `children`. Renders
 * nothing itself; `Modal` places the actual footer in its own layout.
 */
export function ModalFooter({ children }: Readonly<ModalFooterProps>) {
	const setFooter = useContext(ModalFooterSetterContext);

	useEffect(() => {
		setFooter?.(children);
		return () => setFooter?.(null);
	}, [setFooter, children]);

	return null;
}
