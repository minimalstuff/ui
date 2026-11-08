import presetIcons from '@unocss/preset-icons';
import { defineConfig, presetWind4, type Variant } from 'unocss';

const isLibraryBuild = process.env.VITE_BUILD_LIB === '1';
const EAGERLY_SCANNED_SOURCES = [
	'src/**/*.{ts,tsx}',
	'.storybook/**/*.{ts,tsx}',
];

const INTERACTIVE_VARIANT_PREFIX = 'interactive:';

/**
 * `interactive:` applies a utility only while the element is neither natively
 * disabled nor `aria-disabled="true"` (e.g. a loading button that stays focusable).
 */
const interactiveVariant: Variant = (matcher) => {
	if (!matcher.startsWith(INTERACTIVE_VARIANT_PREFIX)) return matcher;
	return {
		matcher: matcher.slice(INTERACTIVE_VARIANT_PREFIX.length),
		selector: (selector) => `${selector}:enabled:not([aria-disabled="true"])`,
	};
};

const TOAST_OFFSET_TOP =
	'var(--ms-toast-offset-top,calc(1rem_+_env(safe-area-inset-top)))';
const TOAST_OFFSET_BOTTOM =
	'var(--ms-toast-offset-bottom,calc(1rem_+_env(safe-area-inset-bottom)))';
const TOASTER_ITEM_CLOSED = 'data-[state=closed]:opacity-0';
const TOASTER_ITEM_SLIDE_LEFT =
	'sm:motion-safe:data-[state=closed]:-translate-x-4';
const TOASTER_ITEM_SLIDE_RIGHT =
	'sm:motion-safe:data-[state=closed]:translate-x-4';
const TOASTER_ITEM_SLIDE_UP =
	'sm:motion-safe:data-[state=closed]:-translate-y-2';
const TOASTER_ITEM_SLIDE_DOWN =
	'sm:motion-safe:data-[state=closed]:translate-y-2';
const TOASTER_ITEM_PHONE_TOP =
	'max-sm:motion-safe:data-[state=closed]:-translate-y-2';
const TOASTER_ITEM_PHONE_BOTTOM =
	'max-sm:motion-safe:data-[state=closed]:translate-y-2';

/**
 * Library-namespaced `ms-*` shortcuts hold every base + media-variant
 * combination. A consumer stylesheet loaded after `style.css` never generates
 * `ms-*` classes, so it cannot override the media rule at equal specificity.
 */
const LIBRARY_SHORTCUTS: Record<string, string> = {
	'ms-drawer-width-sm': 'w-full sm:w-[22.5rem]',
	'ms-drawer-width-md': 'w-full sm:w-[26.25rem]',
	'ms-drawer-width-lg': 'w-full sm:w-[32.5rem]',
	'ms-drawer-offscreen-right': 'translate-x-full motion-reduce:translate-x-0',
	'ms-drawer-offscreen-left': '-translate-x-full motion-reduce:translate-x-0',
	'ms-drawer-transition':
		'transition-transform duration-200 ease-out motion-reduce:transition-none',
	'ms-modal-backdrop-padding': 'p-2 sm:py-[3rem] lg:py-[5rem]',
	'ms-button-press':
		'interactive:active:scale-[0.95] motion-reduce:interactive:active:scale-100',
	'ms-spinner-animated': 'motion-reduce:hidden',
	'ms-spinner-static': 'hidden motion-reduce:inline-block',
	'ms-modal-panel-closed':
		'opacity-0 scale-95 translate-y-1 motion-reduce:scale-100 motion-reduce:translate-y-0',
	'ms-menu-surface-closed': 'scale-95 opacity-0 motion-reduce:scale-100',
	'ms-tooltip-enter-top':
		'data-[state=closed]:translate-y-1 motion-reduce:data-[state=closed]:translate-y-0',
	'ms-tooltip-enter-bottom':
		'data-[state=closed]:-translate-y-1 motion-reduce:data-[state=closed]:translate-y-0',
	'ms-tooltip-enter-left':
		'data-[state=closed]:translate-x-1 motion-reduce:data-[state=closed]:translate-x-0',
	'ms-tooltip-enter-right':
		'data-[state=closed]:-translate-x-1 motion-reduce:data-[state=closed]:translate-x-0',
	'ms-switch-thumb-transition':
		'transition duration-200 ease-in-out motion-reduce:transition-none',
	'ms-toaster': 'fixed z-[60] pointer-events-none max-sm:inset-x-0 max-sm:px-4',
	'ms-toaster-bottom': `bottom-[${TOAST_OFFSET_BOTTOM}] max-sm:[body:has([data-phone-layout=sheet][data-state=open])_&]:bottom-auto max-sm:[body:has([data-phone-layout=sheet][data-state=open])_&]:top-[${TOAST_OFFSET_TOP}]`,
	'ms-toaster-top': `top-[${TOAST_OFFSET_TOP}]`,
	'ms-toaster-region-height': `max-h-[calc(100dvh_-_${TOAST_OFFSET_TOP}_-_${TOAST_OFFSET_BOTTOM})]`,
	'ms-toaster-left':
		'sm:left-[calc(1rem_+_env(safe-area-inset-left))] sm:w-[22rem]',
	'ms-toaster-right':
		'sm:right-[calc(1rem_+_env(safe-area-inset-right))] sm:w-[22rem]',
	'ms-toaster-center': 'sm:left-1/2 sm:-translate-x-1/2 sm:w-[22rem]',
	'ms-toaster-item-transition':
		'transition duration-150 ease-out motion-reduce:transition-opacity',
	'ms-toaster-item-top-left': `${TOASTER_ITEM_CLOSED} ${TOASTER_ITEM_SLIDE_LEFT} ${TOASTER_ITEM_PHONE_TOP}`,
	'ms-toaster-item-top-center': `${TOASTER_ITEM_CLOSED} ${TOASTER_ITEM_SLIDE_UP} ${TOASTER_ITEM_PHONE_TOP}`,
	'ms-toaster-item-top-right': `${TOASTER_ITEM_CLOSED} ${TOASTER_ITEM_SLIDE_RIGHT} ${TOASTER_ITEM_PHONE_TOP}`,
	'ms-toaster-item-bottom-left': `${TOASTER_ITEM_CLOSED} ${TOASTER_ITEM_SLIDE_LEFT} ${TOASTER_ITEM_PHONE_BOTTOM}`,
	'ms-toaster-item-bottom-center': `${TOASTER_ITEM_CLOSED} ${TOASTER_ITEM_SLIDE_DOWN} ${TOASTER_ITEM_PHONE_BOTTOM}`,
	'ms-toaster-item-bottom-right': `${TOASTER_ITEM_CLOSED} ${TOASTER_ITEM_SLIDE_RIGHT} ${TOASTER_ITEM_PHONE_BOTTOM}`,
	'ms-toast-timer-bar': 'animate-ms-toast-timer motion-reduce:hidden',
	'ms-overview-card-wide': 'sm:col-span-2',
	'ms-modal-height-fixed':
		'h-[calc(100vh-4rem)] sm:h-[min(40rem,calc(100vh-10rem))]',
	'ms-modal-sheet-backdrop':
		'items-end p-0 sm:items-start sm:px-2 sm:py-[3rem] lg:py-[5rem]',
	'ms-modal-sheet-size-sm': 'max-w-none sm:max-w-md',
	'ms-modal-sheet-size-md': 'max-w-none sm:max-w-lg',
	'ms-modal-sheet-size-lg': 'max-w-none sm:max-w-2xl',
	'ms-modal-sheet-size-xl': 'max-w-none sm:max-w-4xl',
	'ms-modal-sheet-radius-none': 'rounded-none',
	'ms-modal-sheet-radius-sm': 'rounded-t-sm rounded-b-none sm:rounded-sm',
	'ms-modal-sheet-radius-md': 'rounded-t-md rounded-b-none sm:rounded-md',
	'ms-modal-sheet-radius-lg': 'rounded-t-lg rounded-b-none sm:rounded-lg',
	'ms-modal-sheet-radius-xl': 'rounded-t-xl rounded-b-none sm:rounded-xl',
	'ms-modal-sheet-radius-full': 'rounded-t-full rounded-b-none sm:rounded-full',
	'ms-modal-sheet-panel':
		'max-sm:max-h-[85svh] max-sm:pb-[env(safe-area-inset-bottom)]',
	'ms-modal-sheet-height-fixed': 'max-sm:h-[85svh]',
	'ms-modal-sheet-closed':
		'opacity-0 scale-95 translate-y-1 max-sm:scale-100 max-sm:motion-safe:translate-y-full motion-reduce:scale-100 motion-reduce:translate-y-0',
	'ms-modal-max-height':
		'max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-10rem)]',
};

export default defineConfig({
	shortcuts: LIBRARY_SHORTCUTS,
	theme: {
		animation: {
			keyframes: {
				'ms-toast-timer': '{from{transform:scaleX(1)}to{transform:scaleX(0)}}',
			},
			durations: { 'ms-toast-timer': '1s' },
			timingFns: { 'ms-toast-timer': 'linear' },
		},
	},
	variants: [interactiveVariant],
	presets: [
		presetWind4({
			dark: 'class',
		}),
		presetIcons({
			cdn: 'https://esm.sh/',
		}),
	],
	content: {
		filesystem: isLibraryBuild ? [] : EAGERLY_SCANNED_SOURCES,
		pipeline: {
			include: [
				/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|marko|html)($|\?)/,
				'src/**/*.{ts,tsx}',
			],
		},
	},
});
