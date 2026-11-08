import { type ToasterPosition } from '#components/toast/toaster_position';

export const TOASTER_POSITION_CLASSES: Record<ToasterPosition, string> = {
	'top-left': 'ms-toaster-top ms-toaster-left',
	'top-center': 'ms-toaster-top ms-toaster-center',
	'top-right': 'ms-toaster-top ms-toaster-right',
	'bottom-left': 'ms-toaster-bottom ms-toaster-left',
	'bottom-center': 'ms-toaster-bottom ms-toaster-center',
	'bottom-right': 'ms-toaster-bottom ms-toaster-right',
};

export const TOASTER_ITEM_POSITION_CLASSES: Record<ToasterPosition, string> = {
	'top-left': 'ms-toaster-item-top-left',
	'top-center': 'ms-toaster-item-top-center',
	'top-right': 'ms-toaster-item-top-right',
	'bottom-left': 'ms-toaster-item-bottom-left',
	'bottom-center': 'ms-toaster-item-bottom-center',
	'bottom-right': 'ms-toaster-item-bottom-right',
};
