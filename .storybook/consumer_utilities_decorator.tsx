import type { Decorator } from '@storybook/react-vite';

import { ConsumerUtilities } from './consumer_utilities';

/**
 * Simulates a consumer app whose own utility stylesheet is loaded after
 * `style.css`: it appends base utilities at the end of `<head>` while the story
 * is mounted. At equal specificity those rules beat any library media-query
 * rule written with the same utility, so a story using this decorator fails when
 * a component's responsive sizing depends on stylesheet load order.
 */
export const consumerUtilitiesDecorator: Decorator = (Story) => (
	<ConsumerUtilities>
		<Story />
	</ConsumerUtilities>
);
