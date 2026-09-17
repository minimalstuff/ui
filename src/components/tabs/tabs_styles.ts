import clsx from 'clsx';

import type { ControlSize } from '#components/shared/sizes';
import { BUTTON_COLOR_TOKENS } from '#components/shared/button_styles';
import { BUTTON_FOCUS_OUTLINE } from '#components/shared/focus_styles';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';
import { CONTROL_BG, SURFACE_BORDER } from '#components/shared/surface_tokens';

export type TabsVariant = 'line' | 'segmented';

type VariantTokens = {
	list: string;
	tab: string;
	activeTab: string;
	idleTab: string;
	idleHover: string;
	indicator: string;
};

const VARIANT_TOKENS: Record<TabsVariant, VariantTokens> = {
	line: {
		list: `gap-1 border-b ${SURFACE_BORDER}`,
		tab: '-mb-px border-b-2',
		activeTab: 'border-transparent text-gray-900 dark:text-gray-100',
		idleTab: 'border-transparent text-gray-500 dark:text-gray-400',
		idleHover:
			'hover:text-gray-900 hover:border-gray-300 dark:hover:text-gray-100 dark:hover:border-gray-600',
		indicator:
			'absolute inset-x-0 -bottom-0.5 h-0.5 bg-blue-600 dark:bg-blue-400',
	},
	segmented: {
		list: 'gap-1 p-1 bg-gray-100 dark:bg-gray-800/50',
		tab: '',
		activeTab: 'text-gray-900 dark:text-gray-100',
		idleTab: 'text-gray-500 dark:text-gray-400',
		idleHover: 'hover:text-gray-900 dark:hover:text-gray-100',
		indicator: `absolute inset-0 ${CONTROL_BG} border border-gray-200 dark:border-gray-700`,
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

const TAB_FOCUS_OUTLINE = clsx(
	BUTTON_FOCUS_OUTLINE,
	BUTTON_COLOR_TOKENS.primary.focusOutline
);

type TabsListClassesParams = {
	variant: TabsVariant;
	radius: Radius;
	unstyled: boolean;
	isFullWidth: boolean;
	className?: string;
};

export function tabsListClasses(
	params: Readonly<TabsListClassesParams>
): string {
	const { variant, radius, unstyled, isFullWidth, className } = params;

	return clsx(
		'flex items-center',
		isFullWidth && 'w-full',
		!unstyled && VARIANT_TOKENS[variant].list,
		!unstyled && variant === 'segmented' && RADIUS_CLASSES[radius],
		className
	);
}

type TabClassesParams = {
	variant: TabsVariant;
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
		size,
		radius,
		unstyled,
		isActive,
		isDisabled,
		isFullWidth,
		className,
	} = params;
	const tokens = VARIANT_TOKENS[variant];

	return clsx(
		'relative flex items-center gap-2 whitespace-nowrap',
		isFullWidth && 'flex-1 justify-center',
		isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
		!unstyled && [
			'font-medium transition-colors duration-200',
			TAB_SIZE_CLASSES[size],
			tokens.tab,
			isActive
				? tokens.activeTab
				: [tokens.idleTab, !isDisabled && tokens.idleHover],
			variant === 'segmented' && RADIUS_CLASSES[radius],
			TAB_FOCUS_OUTLINE,
		],
		className
	);
}

type TabIndicatorClassesParams = {
	variant: TabsVariant;
	radius: Radius;
};

export function tabIndicatorClasses(
	params: Readonly<TabIndicatorClassesParams>
): string {
	const { variant, radius } = params;

	return clsx(
		'tabs-indicator pointer-events-none',
		VARIANT_TOKENS[variant].indicator,
		variant === 'segmented' && RADIUS_CLASSES[radius]
	);
}
