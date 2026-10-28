export function resolveChannelUrl(
	relativeHref: string,
	managerHref: string
): string {
	return new URL(relativeHref, managerHref).href;
}
