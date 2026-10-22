import clsx from 'clsx';
import type { Key, ReactNode } from 'react';

type TabPanelProps = {
	panelId: string;
	tabId: string;
	isHidden: boolean;
	isAnimated: boolean;
	className: string;
	contentKey?: Key;
	children: ReactNode;
};

/** A single `role="tabpanel"` of a `Tabs`, animating its content in when shown. */
export function TabPanel({
	panelId,
	tabId,
	isHidden,
	isAnimated,
	className,
	contentKey,
	children,
}: Readonly<TabPanelProps>) {
	return (
		<div
			role="tabpanel"
			id={panelId}
			aria-labelledby={tabId}
			tabIndex={0}
			hidden={isHidden}
			className={className}
		>
			<div key={contentKey} className={clsx(isAnimated && 'tabs-panel-inner')}>
				{children}
			</div>
		</div>
	);
}
