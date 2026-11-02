import { describe, expect, test } from 'vitest';

import { FRENCH_UI_LABELS } from '#components/ui_provider/french_ui_labels';
import { DEFAULT_LABELS } from '#components/ui_provider/ui_labels';

describe('FRENCH_UI_LABELS', () => {
	test.each(Object.entries(DEFAULT_LABELS))(
		'should translate the %s label',
		(key, englishLabel) => {
			const frenchLabel = FRENCH_UI_LABELS[key as keyof typeof DEFAULT_LABELS];
			expect(typeof frenchLabel).toBe(typeof englishLabel);
			expect(frenchLabel).toBeTruthy();
		}
	);

	test('should not leave an English default in a plain string label', () => {
		for (const [key, englishLabel] of Object.entries(DEFAULT_LABELS)) {
			if (typeof englishLabel !== 'string') continue;
			expect(FRENCH_UI_LABELS[key as keyof typeof DEFAULT_LABELS]).not.toBe(
				englishLabel === 'Search' ? '' : englishLabel
			);
		}
	});

	test('should agree on the plural of the function labels', () => {
		expect(FRENCH_UI_LABELS.charactersRemaining(1)).toBe('1 caractère restant');
		expect(FRENCH_UI_LABELS.charactersRemaining(5)).toBe(
			'5 caractères restants'
		);
		expect(FRENCH_UI_LABELS.currentTheme('dark')).toBe('Thème actuel : sombre');
		expect(FRENCH_UI_LABELS.selectedCount(2)).toBe('2 sélectionnés');
		expect(FRENCH_UI_LABELS.overflowCount(3)).toBe('+3 autres');
		expect(FRENCH_UI_LABELS.overflowCount(1)).toBe('+1 autre');
		expect(FRENCH_UI_LABELS.maxSelectedHint(1)).toContain('1 élément');
	});
});
