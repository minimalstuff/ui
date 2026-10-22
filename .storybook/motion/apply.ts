import { substituteReducedMotionQuery, type MotionMode } from './index';

const REDUCED_MOTION_MARKER = 'prefers-reduced-motion';

const originalConditions = new WeakMap<CSSMediaRule, string>();
const originalMatchMedia = window.matchMedia.bind(window);

let currentMode: MotionMode = 'system';
let isMatchMediaWrapped = false;
let isRewriteScheduled = false;
let styleObserver: MutationObserver | undefined;

function isSameOriginStyleSheet(styleSheet: CSSStyleSheet): boolean {
	if (!styleSheet.href) return true;
	return new URL(styleSheet.href, location.href).origin === location.origin;
}

function rewriteMediaRule(rule: CSSMediaRule): void {
	const originalCondition =
		originalConditions.get(rule) ?? rule.media.mediaText;
	if (!originalCondition.includes(REDUCED_MOTION_MARKER)) return;
	originalConditions.set(rule, originalCondition);
	const rewrittenCondition = substituteReducedMotionQuery(
		originalCondition,
		currentMode
	);
	if (rule.media.mediaText !== rewrittenCondition) {
		rule.media.mediaText = rewrittenCondition;
	}
}

function rewriteRules(rules: CSSRuleList): void {
	for (const rule of Array.from(rules)) {
		if (rule instanceof CSSMediaRule) rewriteMediaRule(rule);
		if (rule instanceof CSSGroupingRule) rewriteRules(rule.cssRules);
		if (rule instanceof CSSImportRule && rule.styleSheet) {
			rewriteStyleSheet(rule.styleSheet);
		}
	}
}

function rewriteStyleSheet(styleSheet: CSSStyleSheet): void {
	if (!isSameOriginStyleSheet(styleSheet)) return;
	rewriteRules(styleSheet.cssRules);
}

function rewriteAllStyleSheets(): void {
	for (const styleSheet of Array.from(document.styleSheets)) {
		rewriteStyleSheet(styleSheet);
	}
}

function scheduleRewrite(): void {
	if (isRewriteScheduled) return;
	isRewriteScheduled = true;
	requestAnimationFrame(() => {
		isRewriteScheduled = false;
		rewriteAllStyleSheets();
	});
}

function observeStyleChanges(): void {
	if (styleObserver) return;
	styleObserver = new MutationObserver(scheduleRewrite);
	styleObserver.observe(document.head, {
		childList: true,
		characterData: true,
		subtree: true,
	});
}

function wrapMatchMedia(): void {
	if (isMatchMediaWrapped) return;
	isMatchMediaWrapped = true;
	window.matchMedia = (query: string) =>
		originalMatchMedia(substituteReducedMotionQuery(query, currentMode));
}

/**
 * Makes both CSS media rules and `window.matchMedia` calls see the given
 * motion preference. Safe to call on every render.
 */
export function applyMotionMode(mode: MotionMode): void {
	wrapMatchMedia();
	observeStyleChanges();
	currentMode = mode;
	rewriteAllStyleSheets();
}
