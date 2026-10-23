import { useContext, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { ModalFooterSlotContext } from '#components/modal/modal_footer_slot_context';

export interface ModalFooterProps {
	children: ReactNode;
}

/**
 * Declares `children` as the modal's pinned footer, wherever this is
 * rendered in the content tree — including inside a separate content
 * component, any number of levels below `Modal`'s own `children`. Renders
 * nothing in place; the children are portaled into the modal's own footer
 * slot, so they stay React children of this component.
 */
export function ModalFooter({ children }: Readonly<ModalFooterProps>) {
	const footerSlot = useContext(ModalFooterSlotContext);

	if (!footerSlot) return null;

	return createPortal(children, footerSlot);
}
