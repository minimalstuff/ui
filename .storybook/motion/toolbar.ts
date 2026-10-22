import type React from 'react';

import { applyMotionMode } from './apply';
import { DEFAULT_MOTION_MODE, isMotionMode, type MotionMode } from './index';

const MOTION_TOOLBAR_ITEMS: { value: MotionMode; title: string }[] = [
	{ value: 'system', title: 'Motion: system' },
	{ value: 'full', title: 'Motion: forced on' },
	{ value: 'reduced', title: 'Motion: reduced' },
];

export const motionGlobalTypes = {
	motion: {
		name: 'Motion',
		description: 'Reduced motion preference seen by the components',
		toolbar: {
			title: 'Motion',
			icon: 'play' as const,
			items: MOTION_TOOLBAR_ITEMS,
			dynamicTitle: true,
		},
	},
};

export function motionDecorator(
	Story: () => React.ReactElement,
	context: { globals: { motion?: unknown } }
): React.ReactElement {
	const requestedMode = context.globals.motion;
	applyMotionMode(
		isMotionMode(requestedMode) ? requestedMode : DEFAULT_MOTION_MODE
	);
	return Story();
}
