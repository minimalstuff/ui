import { THEME_STORAGE_KEY } from '#stores/theme_store/theme_storage_key';

/**
 * A self-contained script that applies the saved theme to `<html>` before the
 * first paint, so a dark-mode visitor never sees a light flash. It mirrors
 * `useThemeStore`: the `dark` class is set for a stored `dark`, or for a
 * stored `system` (or a missing, invalid or unreadable value) while the OS
 * prefers dark. Every `<meta name="theme-color" data-light="..." data-dark="...">`
 * also gets its `content` set from `data-dark` or `data-light`; it must come
 * before this script in `<head>`. Inline the script in `<head>` before the
 * stylesheet.
 */
export const THEME_INIT_SCRIPT = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);var m=document.querySelectorAll('meta[name="theme-color"][data-light][data-dark]');for(var i=0;i<m.length;i++){m[i].setAttribute("content",m[i].getAttribute(d?"data-dark":"data-light"))}})()`;
