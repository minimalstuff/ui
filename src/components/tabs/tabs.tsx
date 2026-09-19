import './tabs.css';

import clsx from 'clsx';
import { type ReactNode, useId, useRef } from 'react';

import type { Radius } from '#components/shared/radius';
import { TabButton } from '#components/tabs/tab_button';
import type { ControlSize } from '#components/shared/sizes';
import { BUTTON_FOCUS_OUTLINE } from '#components/shared/focus_styles';
import { BUTTON_COLOR_TOKENS } from '#components/shared/button_styles';
import { useControlledState } from '#components/shared/use_controlled_state';
import {
	tabsListClasses,
	type TabsVariant,
} from '#components/tabs/tabs_styles';
import { useTabIndicatorTransition } from '#components/tabs/use_tab_indicator_transition';
import { useTabsKeyboardNavigation } from '#components/tabs/use_tabs_keyboard_navigation';

export interface TabItem {
	title: string;
	content: ReactNode;
	disabled?: boolean;
	icon?: string;
}

export interface TabsProps {
	items: TabItem[];
	value?: number;
	defaultIndex?: number;
	variant?: TabsVariant;
	size?: ControlSize;
	/**
	 * Only visibly rounds the `segmented` variant's track and tabs. The `line`
	 * variant has no filled surface to round, so radius is a no-op there.
	 */
	radius?: Radius;
	fullWidth?: boolean;
	unstyled?: boolean;
	animated?: boolean;
	className?: string;
	tabListClassName?: string;
	panelClassName?: string;
	onChange?: (index: number) => void;
}

export function Tabs({
	items,
	value,
	defaultIndex = 0,
	variant = 'line',
	size = 'md',
	radius = 'md',
	fullWidth = false,
	unstyled = false,
	animated = true,
	className,
	tabListClassName,
	panelClassName,
	onChange,
}: Readonly<TabsProps>) {
	const [activeIndex, setActiveIndex] = useControlledState(value, defaultIndex);
	const id = useId();
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const indicatorRef = useRef<HTMLSpanElement>(null);

	const activateTab = (index: number) => {
		if (items[index]?.disabled) return;
		setActiveIndex(index);
		onChange?.(index);
	};

	const navigateToTab = (index: number) => {
		tabRefs.current[index]?.focus();
		activateTab(index);
	};

	const handleKeyDown = useTabsKeyboardNavigation({
		items,
		activeIndex,
		onNavigate: navigateToTab,
	});

	const activeItem = items[activeIndex];

	useTabIndicatorTransition({
		activeIndex,
		indicatorRef,
		isAnimated: animated,
	});

	return (
		<div className={clsx('w-full', className)}>
			<div
				role="tablist"
				className={tabsListClasses({
					variant,
					radius,
					unstyled,
					isFullWidth: fullWidth,
					className: tabListClassName,
				})}
			>
				{items.map((item, index) => (
					<TabButton
						key={item.title}
						ref={(el) => {
							tabRefs.current[index] = el;
						}}
						indicatorRef={indicatorRef}
						item={item}
						isActive={activeIndex === index}
						isFullWidth={fullWidth}
						variant={variant}
						size={size}
						radius={radius}
						unstyled={unstyled}
						tabId={`${id}-tab-${index}`}
						panelId={`${id}-panel-${index}`}
						onSelect={() => activateTab(index)}
						onKeyDown={handleKeyDown}
					/>
				))}
			</div>
			<div
				role="tabpanel"
				id={`${id}-panel-${activeIndex}`}
				aria-labelledby={`${id}-tab-${activeIndex}`}
				tabIndex={0}
				className={clsx(
					!unstyled && [
						'mt-4',
						BUTTON_FOCUS_OUTLINE,
						BUTTON_COLOR_TOKENS.primary.focusOutline,
					],
					panelClassName
				)}
			>
				<div
					key={activeIndex}
					className={clsx(animated && !unstyled && 'tabs-panel-inner')}
				>
					{activeItem?.content}
				</div>
			</div>
		</div>
	);
}
