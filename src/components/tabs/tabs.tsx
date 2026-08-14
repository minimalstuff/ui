import './tabs.css';

import clsx from 'clsx';
import {
	type KeyboardEvent,
	type ReactNode,
	useId,
	useRef,
	useState,
} from 'react';

import { SURFACE_BORDER } from '#components/shared/surface_tokens';
import { RADIUS_CLASSES, type Radius } from '#components/shared/radius';

export interface TabItem {
	title: string;
	content: ReactNode;
	disabled?: boolean;
	icon?: string;
}

export interface TabsProps {
	items: TabItem[];
	defaultIndex?: number;
	radius?: Radius;
	unstyled?: boolean;
	className?: string;
	tabListClassName?: string;
	panelClassName?: string;
	onChange?: (index: number) => void;
}

export function Tabs({
	items,
	defaultIndex = 0,
	radius = 'md',
	unstyled = false,
	className,
	tabListClassName,
	panelClassName,
	onChange,
}: Readonly<TabsProps>) {
	const [activeIndex, setActiveIndex] = useState(defaultIndex);
	const id = useId();
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	const activateTab = (index: number) => {
		if (items[index]?.disabled) return;
		setActiveIndex(index);
		onChange?.(index);
	};

	const focusTab = (index: number) => {
		tabRefs.current[index]?.focus();
		activateTab(index);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
		const enabledIndexes = items
			.map((_, index) => index)
			.filter((index) => !items[index]?.disabled);
		if (enabledIndexes.length === 0) return;

		const currentPosition = enabledIndexes.indexOf(activeIndex);

		if (e.key === 'ArrowRight') {
			e.preventDefault();
			focusTab(enabledIndexes[(currentPosition + 1) % enabledIndexes.length]);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			focusTab(
				enabledIndexes[
					(currentPosition - 1 + enabledIndexes.length) % enabledIndexes.length
				]
			);
		} else if (e.key === 'Home') {
			e.preventDefault();
			focusTab(enabledIndexes[0]);
		} else if (e.key === 'End') {
			e.preventDefault();
			focusTab(enabledIndexes[enabledIndexes.length - 1]);
		}
	};

	const activeItem = items[activeIndex];

	return (
		<div className={clsx('w-full', className)}>
			<div
				role="tablist"
				className={clsx(
					'flex gap-1 p-1',
					!unstyled && [
						'bg-gray-100 dark:bg-gray-800/50 border',
						SURFACE_BORDER,
						RADIUS_CLASSES[radius],
					],
					tabListClassName
				)}
			>
				{items.map((item, index) => (
					<button
						key={index}
						ref={(el) => {
							tabRefs.current[index] = el;
						}}
						id={`${id}-tab-${index}`}
						role="tab"
						type="button"
						aria-selected={activeIndex === index}
						aria-disabled={item.disabled}
						aria-controls={`${id}-panel-${index}`}
						tabIndex={activeIndex === index ? 0 : -1}
						disabled={item.disabled}
						onClick={() => activateTab(index)}
						onKeyDown={handleKeyDown}
						className={clsx(
							'flex items-center gap-2 px-4 py-2.5 text-sm font-medium',
							item.disabled
								? 'opacity-50 cursor-not-allowed'
								: 'cursor-pointer',
							!unstyled && [
								RADIUS_CLASSES[radius],
								activeIndex === index
									? clsx(
											'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border',
											SURFACE_BORDER
										)
									: clsx(
											'text-gray-600 dark:text-gray-400 border border-transparent',
											!item.disabled &&
												'hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
										),
							]
						)}
					>
						{item.icon && (
							<span
								className={clsx(
									'w-4 h-4 block shrink-0',
									item.icon,
									!unstyled &&
										(activeIndex === index
											? 'text-blue-600 dark:text-blue-400'
											: 'text-gray-500 dark:text-gray-400')
								)}
							/>
						)}
						{item.title}
					</button>
				))}
			</div>
			<div
				role="tabpanel"
				id={`${id}-panel-${activeIndex}`}
				aria-labelledby={`${id}-tab-${activeIndex}`}
				tabIndex={0}
				className={clsx(
					'mt-3 overflow-hidden focus:outline-none',
					!unstyled && [
						'border bg-white dark:bg-gray-800/50 p-4',
						SURFACE_BORDER,
						RADIUS_CLASSES[radius],
					],
					panelClassName
				)}
			>
				<div key={activeIndex} className="tabs-panel-inner">
					{activeItem?.content}
				</div>
			</div>
		</div>
	);
}
