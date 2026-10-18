import { describe, expect, test } from 'vitest';

import { isWebKitGtk } from './is_webkit_gtk';

const EPIPHANY_USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const TAURI_USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/605.1.15 (KHTML, like Gecko)';
const CHROME_LINUX_USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const EDGE_WINDOWS_USER_AGENT =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0';
const ANDROID_CHROME_USER_AGENT =
	'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
const MACOS_SAFARI_USER_AGENT =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const FIREFOX_LINUX_USER_AGENT =
	'Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0';

describe('isWebKitGtk', () => {
	test('should return true when the user agent is Epiphany on WebKitGTK', () => {
		expect(isWebKitGtk(EPIPHANY_USER_AGENT)).toBe(true);
	});

	test('should return true when the user agent is the Tauri WebKitGTK default', () => {
		expect(isWebKitGtk(TAURI_USER_AGENT)).toBe(true);
	});

	test('should return false when the user agent is Chrome on Linux', () => {
		expect(isWebKitGtk(CHROME_LINUX_USER_AGENT)).toBe(false);
	});

	test('should return false when the user agent is Edge on Windows', () => {
		expect(isWebKitGtk(EDGE_WINDOWS_USER_AGENT)).toBe(false);
	});

	test('should return false when the user agent is Chrome on Android', () => {
		expect(isWebKitGtk(ANDROID_CHROME_USER_AGENT)).toBe(false);
	});

	test('should return false when the user agent is Safari on macOS', () => {
		expect(isWebKitGtk(MACOS_SAFARI_USER_AGENT)).toBe(false);
	});

	test('should return false when the user agent is Firefox on Linux', () => {
		expect(isWebKitGtk(FIREFOX_LINUX_USER_AGENT)).toBe(false);
	});
});
