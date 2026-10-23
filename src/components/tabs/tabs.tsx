import './tabs.css';

import { type ReactNode, useId, useRef } from 'react';

import type { Radius } from '#components/shared/radius';
import type { ControlSize } from '#components/shared/sizes';
import { useControlledState } from '#components/shared/use_controlled_state';
import { TabButton } from '#components/tabs/tab_button';
import { TabPanel } from '#components/tabs/tab_panel';
import {
	tabsListClasses,
	tabsPanelClasses,
	tabsRootClasses,
	type TabsOrientation,
	type TabsVariant,
} from '#components/tabs/tabs_styles';
import { useTabIndicatorTransition } from '#components/tabs/use_tab_indicator_transition';
import {
	getTabStopIndex,
	useTabsKeyboardNavigation,
} from '#components/tabs/use_tabs_keyboard_navigation';

export interface TabItem {
	title: string;
	content: ReactNode;
	disabled?: boolean;
	icon?: string;
	/**
	 * Rendered after the title inside the tab button and part of the tab's
	 * accessible name. Meant for short text such as an error count ("1 error"),
	 * never a coloured dot alone. Separate from `title`, which is the React key
	 * and must stay stable.
	 */
	badge?: ReactNode;
}

export interface TabsProps {
	items: TabItem[];
	value?: number;
	defaultIndex?: number;
	variant?: TabsVariant;
	/**
	 * Direction the tabs are laid out in. `vertical` stacks the tablist beside
	 * the panel and navigates with ArrowDown/ArrowUp instead of
	 * ArrowRight/ArrowLeft. Give the root a height (e.g. `className="min-h-0
	 * flex-1"` in a fixed-height parent) and the tablist and panel scroll
	 * independently. Defaults to `horizontal`.
	 */
	orientation?: TabsOrientation;
	size?: ControlSize;
	/**
	 * Only visibly rounds the `segmented` variant's track and tabs. The `line`
	 * variant has no filled surface to round, so radius is a no-op there.
	 */
	radius?: Radius;
	/** Stretches the tabs across the tablist. A no-op when `orientation` is `vertical`. */
	fullWidth?: boolean;
	unstyled?: boolean;
	animated?: boolean;
	/**
	 * Keeps every panel in the DOM and only hides the inactive ones, so React
	 * state (typed input, scroll position) inside a panel survives tab
	 * switches. Every tab then carries `aria-controls` pointing at its own
	 * panel. When `false`, only the active panel is rendered, so only the
	 * active tab carries `aria-controls` (it must reference an existing
	 * element; a dangling id fails `aria-valid-attr-value`). Defaults to
	 * `false`.
	 */
	keepMounted?: boolean;
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
	orientation = 'horizontal',
	size = 'md',
	radius = 'md',
	fullWidth = false,
	unstyled = false,
	animated = true,
	keepMounted = false,
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

	const tabStopIndex = getTabStopIndex(items, activeIndex);

	const handleKeyDown = useTabsKeyboardNavigation({
		items,
		activeIndex: tabStopIndex,
		orientation,
		onNavigate: navigateToTab,
	});

	const panelClasses = tabsPanelClasses({
		orientation,
		unstyled,
		className: panelClassName,
	});
	const isContentAnimated = animated && !unstyled;

	const renderActivePanel = () => (
		<TabPanel
			panelId={`${id}-panel-${activeIndex}`}
			tabId={`${id}-tab-${activeIndex}`}
			isHidden={false}
			isAnimated={isContentAnimated}
			className={panelClasses}
			contentKey={activeIndex}
		>
			{items[activeIndex]?.content}
		</TabPanel>
	);

	const renderAllPanels = () =>
		items.map((item, index) => (
			<TabPanel
				key={item.title}
				panelId={`${id}-panel-${index}`}
				tabId={`${id}-tab-${index}`}
				isHidden={index !== activeIndex}
				isAnimated={isContentAnimated}
				className={panelClasses}
			>
				{item.content}
			</TabPanel>
		));

	useTabIndicatorTransition({
		activeIndex,
		indicatorRef,
		isAnimated: animated,
		orientation,
	});

	return (
		<div className={tabsRootClasses(orientation, className)}>
			<div
				role="tablist"
				aria-orientation={orientation}
				className={tabsListClasses({
					variant,
					orientation,
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
						hasMountedPanel={keepMounted || activeIndex === index}
						isTabStop={tabStopIndex === index}
						isFullWidth={fullWidth}
						variant={variant}
						orientation={orientation}
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
			{keepMounted ? renderAllPanels() : renderActivePanel()}
		</div>
	);
}
