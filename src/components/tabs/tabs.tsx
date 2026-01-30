import clsx from 'clsx';
import { type ReactNode, useState } from 'react';
import './tabs.css';

export interface TabItem {
	title: string;
	content: ReactNode;
	disabled?: boolean;
	icon?: string;
}

interface TabsProps {
	items: TabItem[];
	defaultIndex?: number;
	className?: string;
	tabListClassName?: string;
	panelClassName?: string;
	onChange?: (index: number) => void;
}

export function Tabs({
	items,
	defaultIndex = 0,
	className,
	tabListClassName,
	panelClassName,
	onChange,
}: TabsProps) {
	const [activeIndex, setActiveIndex] = useState(defaultIndex);

	const handleTabClick = (index: number) => {
		if (items[index]?.disabled) return;
		setActiveIndex(index);
		onChange?.(index);
	};

	const activeItem = items[activeIndex];

	return (
		<div className={clsx('w-full', className)}>
			<div
				role="tablist"
				className={clsx(
					'flex gap-1 p-1 rounded-md bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700',
					tabListClassName
				)}
			>
				{items.map((item, index) => (
					<button
						key={index}
						role="tab"
						type="button"
						aria-selected={activeIndex === index}
						aria-disabled={item.disabled}
						disabled={item.disabled}
						onClick={() => handleTabClick(index)}
						className={clsx(
							'flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium',
							activeIndex === index
								? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-600'
								: clsx(
										'text-gray-600 dark:text-gray-400 border border-transparent',
										item.disabled
											? 'opacity-50 cursor-not-allowed'
											: 'cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
									)
						)}
					>
						{item.icon && (
							<span
								className={clsx(
									'w-4 h-4 block shrink-0',
									item.icon,
									activeIndex === index
										? 'text-blue-600 dark:text-blue-400'
										: 'text-gray-500 dark:text-gray-400'
								)}
							/>
						)}
						{item.title}
					</button>
				))}
			</div>
			<div
				role="tabpanel"
				className={clsx(
					'mt-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 overflow-hidden',
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
