import clsx from 'clsx';

import type { ControlSize } from '#components/shared/sizes';
import { BUTTON_COLOR_TOKENS } from '#components/shared/button_styles';
import { BUTTON_FOCUS_OUTLINE } from '#components/shared/focus_styles';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import {
	CONTROL_BG,
	SURFACE_BORDER,
	THIN_SCROLLBAR,
} from '#components/shared/surface_tokens';

export type TabsVariant = 'line' | 'segmented';

export type TabsOrientation = 'horizontal' | 'vertical';

type OrientationTokens = {
	list: string;
	tab: string;
	indicator: string;
};

type VariantTokens = {
	activeTab: string;
	idleTab: string;
	idleHover: string;
	byOrientation: Record<TabsOrientation, OrientationTokens>;
};

const SEGMENTED_ORIENTATION_TOKENS: OrientationTokens = {
	list: 'gap-1 p-1 bg-gray-100 dark:bg-gray-800/50',
	tab: '',
	indicator: `absolute inset-0 ${CONTROL_BG} border border-gray-200 dark:border-gray-700`,
};

const VARIANT_TOKENS: Record<TabsVariant, VariantTokens> = {
	line: {
		activeTab: 'border-transparent text-gray-900 dark:text-gray-100',
		idleTab: 'border-transparent text-gray-500 dark:text-gray-400',
		idleHover:
			'hover:text-gray-900 hover:border-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-600',
		byOrientation: {
			horizontal: {
				list: `gap-1 border-b ${SURFACE_BORDER}`,
				tab: '-mb-px border-b-2',
				indicator:
					'absolute inset-x-0 -bottom-0.5 h-0.5 bg-blue-600 dark:bg-blue-400',
			},
			vertical: {
				list: `gap-1 border-r ${SURFACE_BORDER}`,
				tab: 'border-r-2',
				indicator:
					'absolute inset-y-0 -right-0.5 w-0.5 bg-blue-600 dark:bg-blue-400',
			},
		},
	},
	segmented: {
		activeTab: 'text-gray-900 dark:text-gray-100',
		idleTab: 'text-gray-600 dark:text-gray-400',
		idleHover: 'hover:text-gray-900 dark:hover:text-gray-100',
		byOrientation: {
			horizontal: SEGMENTED_ORIENTATION_TOKENS,
			vertical: SEGMENTED_ORIENTATION_TOKENS,
		},
	},
};

const TAB_SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'px-2 py-1 text-xs',
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2.5 text-sm',
	lg: 'px-5 py-3 text-base',
};

export const TAB_ICON_SIZE_CLASSES: Record<ControlSize, string> = {
	xs: 'w-3.5 h-3.5',
	sm: 'w-4 h-4',
	md: 'w-4 h-4',
	lg: 'w-5 h-5',
};

const INSET_FOCUS_OUTLINE_OFFSET = 'focus-visible:-outline-offset-2';

const FOCUS_OUTLINE_BY_ORIENTATION: Record<TabsOrientation, string> = {
	horizontal: clsx(
		BUTTON_FOCUS_OUTLINE,
		BUTTON_COLOR_TOKENS.primary.focusOutline
	),
	vertical: clsx(
		'outline-hidden focus-visible:outline-2',
		INSET_FOCUS_OUTLINE_OFFSET,
		BUTTON_COLOR_TOKENS.primary.focusOutline
	),
};

const HORIZONTAL_LIST_LAYOUT = 'items-center';
const VERTICAL_LIST_LAYOUT = clsx(
	'flex-col items-stretch min-h-0 overflow-y-auto overflow-x-hidden',
	THIN_SCROLLBAR
);
const VERTICAL_LIST_WIDTH = 'w-48 shrink-0';
const VERTICAL_TAB_LAYOUT = 'justify-start text-left whitespace-normal';
const HORIZONTAL_TAB_LAYOUT = 'whitespace-nowrap';
const VERTICAL_ROOT_LAYOUT = 'flex min-h-0';
const VERTICAL_PANEL_LAYOUT = clsx(
	'flex-1 min-w-0 min-h-0 overflow-y-auto',
	THIN_SCROLLBAR
);
const VERTICAL_PANEL_GAP = 'ml-6';
const HORIZONTAL_PANEL_GAP = 'mt-4';

export function tabsRootClasses(
	orientation: TabsOrientation,
	className?: string
): string {
	return clsx(
		'w-full',
		orientation === 'vertical' && VERTICAL_ROOT_LAYOUT,
		className
	);
}

type TabsPanelClassesParams = {
	orientation: TabsOrientation;
	unstyled: boolean;
	className?: string;
};

export function tabsPanelClasses(
	params: Readonly<TabsPanelClassesParams>
): string {
	const { orientation, unstyled, className } = params;
	const isVertical = orientation === 'vertical';

	return clsx(
		isVertical && VERTICAL_PANEL_LAYOUT,
		!unstyled && [
			isVertical ? VERTICAL_PANEL_GAP : HORIZONTAL_PANEL_GAP,
			FOCUS_OUTLINE_BY_ORIENTATION[orientation],
		],
		className
	);
}

type TabsListClassesParams = {
	variant: TabsVariant;
	orientation: TabsOrientation;
	radius: Radius;
	unstyled: boolean;
	isFullWidth: boolean;
	className?: string;
};

export function tabsListClasses(
	params: Readonly<TabsListClassesParams>
): string {
	const { variant, orientation, radius, unstyled, isFullWidth, className } =
		params;
	const isVertical = orientation === 'vertical';

	return clsx(
		'flex',
		isVertical ? VERTICAL_LIST_LAYOUT : HORIZONTAL_LIST_LAYOUT,
		!isVertical && isFullWidth && 'w-full',
		!unstyled && isVertical && VERTICAL_LIST_WIDTH,
		!unstyled && VARIANT_TOKENS[variant].byOrientation[orientation].list,
		!unstyled && variant === 'segmented' && RADIUS_CLASSES[radius],
		className
	);
}

type TabClassesParams = {
	variant: TabsVariant;
	orientation: TabsOrientation;
	size: ControlSize;
	radius: Radius;
	unstyled: boolean;
	isActive: boolean;
	isDisabled: boolean;
	isFullWidth: boolean;
	className?: string;
};

export function tabClasses(params: Readonly<TabClassesParams>): string {
	const {
		variant,
		orientation,
		size,
		radius,
		unstyled,
		isActive,
		isDisabled,
		isFullWidth,
		className,
	} = params;
	const isVertical = orientation === 'vertical';
	const tokens = VARIANT_TOKENS[variant];

	return clsx(
		'relative flex items-center gap-2',
		isVertical ? VERTICAL_TAB_LAYOUT : HORIZONTAL_TAB_LAYOUT,
		!isVertical && isFullWidth && 'flex-1 justify-center',
		isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
		!unstyled && [
			'font-medium transition-colors duration-200',
			TAB_SIZE_CLASSES[size],
			tokens.byOrientation[orientation].tab,
			isActive
				? tokens.activeTab
				: [tokens.idleTab, !isDisabled && tokens.idleHover],
			variant === 'segmented' && RADIUS_CLASSES[radius],
			FOCUS_OUTLINE_BY_ORIENTATION[orientation],
		],
		className
	);
}

type TabIndicatorClassesParams = {
	variant: TabsVariant;
	orientation: TabsOrientation;
	radius: Radius;
};

export function tabIndicatorClasses(
	params: Readonly<TabIndicatorClassesParams>
): string {
	const { variant, orientation, radius } = params;

	return clsx(
		'tabs-indicator pointer-events-none',
		VARIANT_TOKENS[variant].byOrientation[orientation].indicator,
		variant === 'segmented' && RADIUS_CLASSES[radius]
	);
}
