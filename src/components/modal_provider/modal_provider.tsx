import { ConfirmModal } from '#components/modal/confirm_modal';
import { Modal } from '#components/modal/modal';

export function ModalProvider() {
	return (
		<>
			<Modal />
			<ConfirmModal />
		</>
	);
}
