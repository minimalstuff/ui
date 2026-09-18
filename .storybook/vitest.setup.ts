const DISABLE_TRANSITIONS_AND_ANIMATIONS_CSS = `
*, *::before, *::after {
	transition: none !important;
	animation: none !important;
}
`;

const style = document.createElement('style');
style.textContent = DISABLE_TRANSITIONS_AND_ANIMATIONS_CSS;
document.head.appendChild(style);
