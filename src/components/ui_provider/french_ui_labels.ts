import { type UILabels } from '#components/ui_provider/ui_labels';
import { type Theme } from '#types/theme';

const THEME_NAMES: Record<Theme, string> = {
	light: 'clair',
	dark: 'sombre',
	system: 'système',
};

/** French translation of every `UILabels` entry, ready for `<UIProvider labels={FRENCH_UI_LABELS}>`. */
export const FRENCH_UI_LABELS: UILabels = {
	close: 'Fermer',
	confirm: 'Confirmer',
	cancel: 'Annuler',
	noResults: 'Aucun résultat',
	clearSelection: 'Effacer la sélection',
	search: 'Rechercher',
	clear: 'Effacer',
	required: 'obligatoire',
	copied: 'Copié',
	loading: 'Chargement',
	copy: 'Copier',
	notifications: 'Notifications',
	closeNotification: 'Fermer la notification',
	charactersRemaining: (remainingCount) =>
		`${remainingCount} ${remainingCount > 1 ? 'caractères restants' : 'caractère restant'}`,
	currentTheme: (theme) => `Thème actuel : ${THEME_NAMES[theme]}`,
	overflowCount: (hiddenCount) =>
		`+${hiddenCount} ${hiddenCount > 1 ? 'autres' : 'autre'}`,
	selectedCount: (selectedCount) =>
		`${selectedCount} ${selectedCount > 1 ? 'sélectionnés' : 'sélectionné'}`,
	maxSelectedHint: (maxSelectedValues) =>
		`Vous pouvez sélectionner jusqu'à ${maxSelectedValues} ${maxSelectedValues > 1 ? 'éléments' : 'élément'}`,
};
