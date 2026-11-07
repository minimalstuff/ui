import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { THEME_INIT_SCRIPT } from '#stores/theme_store/theme_init_script';

const LIGHT_COLOR = '#ffffff';
const DARK_COLOR = '#0b0b0b';
const NEUTRAL_COLOR = '#123456';

function stubSystemPrefersDark(prefersDark: boolean) {
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockReturnValue({
			matches: prefersDark,
			addEventListener: vi.fn<() => void>(),
		})
	);
}

function createThemeColorMeta() {
	const meta = document.createElement('meta');
	meta.setAttribute('name', 'theme-color');
	meta.setAttribute('content', NEUTRAL_COLOR);
	meta.setAttribute('data-light', LIGHT_COLOR);
	meta.setAttribute('data-dark', DARK_COLOR);
	document.head.append(meta);
	return meta;
}

function readDocumentState(meta: HTMLMetaElement) {
	return {
		content: meta.getAttribute('content'),
		isDark: document.documentElement.classList.contains('dark'),
	};
}

function resetDocumentState(meta: HTMLMetaElement) {
	meta.setAttribute('content', NEUTRAL_COLOR);
	document.documentElement.classList.remove('dark');
}

describe('THEME_INIT_SCRIPT and useThemeStore parity', () => {
	beforeEach(() => {
		localStorage.clear();
		document.head.innerHTML = '';
		document.documentElement.classList.remove('dark');
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
		document.head.innerHTML = '';
		document.documentElement.classList.remove('dark');
	});

	test.each([
		{ stored: 'dark', prefersDark: false, expectedColor: DARK_COLOR },
		{ stored: 'dark', prefersDark: true, expectedColor: DARK_COLOR },
		{ stored: 'light', prefersDark: false, expectedColor: LIGHT_COLOR },
		{ stored: 'light', prefersDark: true, expectedColor: LIGHT_COLOR },
		{ stored: 'system', prefersDark: false, expectedColor: LIGHT_COLOR },
		{ stored: 'system', prefersDark: true, expectedColor: DARK_COLOR },
		{ stored: null, prefersDark: false, expectedColor: LIGHT_COLOR },
		{ stored: null, prefersDark: true, expectedColor: DARK_COLOR },
	])(
		'should produce the same document state in the script and the store when the stored theme is $stored and the OS prefers dark is $prefersDark',
		async ({ stored, prefersDark, expectedColor }) => {
			const meta = createThemeColorMeta();
			stubSystemPrefersDark(prefersDark);
			if (stored) localStorage.setItem('theme', stored);

			// oxlint-disable-next-line no-eval -- the script is a string meant for inline <head> use; evaluating it is the only way to test its behaviour
			globalThis.eval(THEME_INIT_SCRIPT);
			const scriptState = readDocumentState(meta);

			resetDocumentState(meta);
			vi.resetModules();
			await import('#stores/theme_store/theme_store');
			const storeState = readDocumentState(meta);

			expect(scriptState.content).toBe(expectedColor);
			expect(storeState).toEqual(scriptState);
		}
	);
});
