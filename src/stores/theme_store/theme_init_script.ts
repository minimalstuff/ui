import { THEME_STORAGE_KEY } from '#stores/theme_store/theme_storage_key';

/**
 * A self-contained script that applies the saved theme to `<html>` before the
 * first paint, so a dark-mode visitor never sees a light flash. It mirrors
 * `useThemeStore`: the `dark` class is set for a stored `dark`, or for a
 * stored `system` (or a missing, invalid or unreadable value) while the OS
 * prefers dark. Inline it in `<head>` before the stylesheet.
 */
export const THEME_INIT_SCRIPT = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d)})()`;
