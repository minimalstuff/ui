import { useContext } from 'react';

import {
	type UILabels,
	UILabelsContext,
} from '#components/ui_provider/ui_labels';

export function useLabels(): UILabels {
	return useContext(UILabelsContext);
}
