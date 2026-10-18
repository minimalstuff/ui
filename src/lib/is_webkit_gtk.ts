const WEBKIT_MARKER = 'AppleWebKit';
const LINUX_MARKERS = ['Linux', 'X11'];
const NON_WEBKIT_GTK_MARKERS = [
	'Chrome',
	'Chromium',
	'Edg',
	'Android',
	'CriOS',
	'FxiOS',
];

export function isWebKitGtk(userAgent: string): boolean {
	if (!userAgent.includes(WEBKIT_MARKER)) return false;
	if (!LINUX_MARKERS.some((marker) => userAgent.includes(marker))) return false;
	return !NON_WEBKIT_GTK_MARKERS.some((marker) => userAgent.includes(marker));
}
