import { type Radius } from '#components/shared/radius';

type ModalSheetSize = 'sm' | 'md' | 'lg' | 'xl';

export const MODAL_SHEET_SIZE_CLASSES: Record<ModalSheetSize, string> = {
	sm: 'ms-modal-sheet-size-sm',
	md: 'ms-modal-sheet-size-md',
	lg: 'ms-modal-sheet-size-lg',
	xl: 'ms-modal-sheet-size-xl',
};

export const MODAL_SHEET_RADIUS_CLASSES: Record<Radius, string> = {
	none: 'ms-modal-sheet-radius-none',
	sm: 'ms-modal-sheet-radius-sm',
	md: 'ms-modal-sheet-radius-md',
	lg: 'ms-modal-sheet-radius-lg',
	xl: 'ms-modal-sheet-radius-xl',
	full: 'ms-modal-sheet-radius-full',
};
