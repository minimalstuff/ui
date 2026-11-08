type ModifierKeys = {
	shiftKey: boolean;
	ctrlKey: boolean;
	altKey: boolean;
	metaKey: boolean;
};

export function hasModifierKey(event: Readonly<ModifierKeys>): boolean {
	return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
}
