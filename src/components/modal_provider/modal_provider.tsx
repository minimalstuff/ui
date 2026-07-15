import { Modal } from '#components/modal/modal';
import { ConfirmModal } from '#components/modal/confirm_modal';

export function ModalProvider() {
	return (
		<>
			<Modal />
			<ConfirmModal />
		</>
	);
}
