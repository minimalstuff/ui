export type PopoverOpenChangeReason =
	| 'trigger'
	| 'escape'
	| 'outside-pointer'
	| 'focus-out'
	| 'disabled';

export type PopoverOpenChangeDetails = { reason: PopoverOpenChangeReason };
