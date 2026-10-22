export const CONTROL_BORDER = 'border-gray-300 dark:border-gray-600';
export const CONTROL_BG = 'bg-white dark:bg-gray-800';
export const SURFACE_BORDER = 'border-gray-200 dark:border-gray-700';
export const OVERLAY_BORDER = 'border-gray-100 dark:border-gray-800';
export const OVERLAY_BG = 'bg-white dark:bg-gray-900';
export const SELECTED_FILL = 'bg-blue-600 dark:bg-blue-500';
const THIN_SCROLLBAR_COLORS =
	'[scrollbar-color:theme(colors.gray.300)_transparent] hover:[scrollbar-color:theme(colors.gray.400)_transparent] dark:[scrollbar-color:theme(colors.gray.600)_transparent] dark:hover:[scrollbar-color:theme(colors.gray.500)_transparent]';
export const THIN_SCROLLBAR = `[scrollbar-width:thin] ${THIN_SCROLLBAR_COLORS}`;
/**
 * Styles every scroll container inside the element, including ones the
 * consumer provides, because `scrollbar-color` is inherited while
 * `scrollbar-width` is not.
 */
export const THIN_SCROLLBAR_SCOPE = `[&,&_*]:[scrollbar-width:thin] ${THIN_SCROLLBAR_COLORS}`;
