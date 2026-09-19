import clsx from 'clsx';
import type { KeyboardEvent, Ref } from 'react';

import type { TabItem } from '#components/tabs/tabs';
import type { Radius } from '#components/shared/radius';
import type { ControlSize } from '#components/shared/sizes';
import {
	TAB_ICON_SIZE_CLASSES,
	tabClasses,
	tabIndicatorClasses,
	type TabsVariant,
} from '#components/tabs/tabs_styles';

type TabButtonProps = {
	item: TabItem;
	isActive: boolean;
	isTabStop: boolean;
	isFullWidth: boolean;
	variant: TabsVariant;
	size: ControlSize;
	radius: Radius;
	unstyled: boolean;
	tabId: string;
	panelId: string;
	onSelect: () => void;
	onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
	ref?: Ref<HTMLButtonElement>;
	indicatorRef?: Ref<HTMLSpanElement>;
};

/** A single tab trigger in a `Tabs` tablist. */
export function TabButton({
	item,
	isActive,
	isTabStop,
	isFullWidth,
	variant,
	size,
	radius,
	unstyled,
	tabId,
	panelId,
	onSelect,
	onKeyDown,
	ref,
	indicatorRef,
}: Readonly<TabButtonProps>) {
	const isDisabled = Boolean(item.disabled);

	return (
		<button
			ref={ref}
			id={tabId}
			role="tab"
			type="button"
			aria-selected={isActive}
			aria-disabled={item.disabled}
			aria-controls={isActive ? panelId : undefined}
			tabIndex={isTabStop ? 0 : -1}
			disabled={item.disabled}
			onClick={onSelect}
			onKeyDown={onKeyDown}
			className={tabClasses({
				variant,
				size,
				radius,
				unstyled,
				isActive,
				isDisabled,
				isFullWidth,
			})}
		>
			{isActive && !unstyled && (
				<span
					ref={indicatorRef}
					aria-hidden="true"
					className={tabIndicatorClasses({ variant, radius })}
				/>
			)}
			{item.icon && (
				<span
					aria-hidden="true"
					className={clsx(
						'relative shrink-0',
						TAB_ICON_SIZE_CLASSES[size],
						item.icon
					)}
				/>
			)}
			<span className="relative">{item.title}</span>
		</button>
	);
}
