import '@testing-library/jest-dom/vitest';

import { describe, expect, test } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { UIProvider } from './ui_provider';
import { Modal } from '#components/modal/modal';
import { Combobox } from '#components/combobox/combobox';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { ThemeToggle } from '#components/theme_toggle/theme_toggle';
import { ModalProvider } from '#components/modal_provider/modal_provider';
import { MultiCombobox } from '#components/multi_combobox/multi_combobox';
import { CheckboxOptions } from '#components/checkbox_options/checkbox_options';

const OPTIONS = [
	{ value: 'a', label: 'Option A' },
	{ value: 'b', label: 'Option B' },
];

describe('UIProvider', () => {
	describe('without a provider', () => {
		test('should render the English close label when no provider is mounted', async () => {
			render(<ModalProvider />);
			act(() => {
				void Modal.call({ title: 'Hello', children: 'Body' });
			});

			expect(
				await screen.findByRole('button', { name: 'Close' })
			).toBeInTheDocument();
		});

		test('should render the English no-results text when no provider is mounted', () => {
			render(<Combobox label="Country" options={OPTIONS} />);
			const input = screen.getByLabelText('Country');
			fireEvent.click(input);
			fireEvent.change(input, { target: { value: 'zzz' } });

			expect(screen.getByRole('status')).toHaveTextContent('No results found');
		});
	});

	describe('with labels', () => {
		test('should translate the modal close button when labels.close is provided', async () => {
			render(
				<UIProvider labels={{ close: 'Fermer' }}>
					<ModalProvider />
				</UIProvider>
			);
			act(() => {
				void Modal.call({ title: 'Hello', children: 'Body' });
			});

			expect(
				await screen.findByRole('button', { name: 'Fermer' })
			).toBeInTheDocument();
		});

		test('should translate the confirm button when labels.confirm is provided', async () => {
			render(
				<UIProvider labels={{ confirm: 'Confirmer' }}>
					<ModalProvider />
				</UIProvider>
			);
			act(() => {
				void ConfirmModal.call({ title: 'Sure?' });
			});

			expect(
				await screen.findByRole('button', { name: 'Confirmer' })
			).toBeInTheDocument();
		});

		test('should translate the cancel button when labels.cancel is provided', async () => {
			render(
				<UIProvider labels={{ cancel: 'Annuler' }}>
					<ModalProvider />
				</UIProvider>
			);
			act(() => {
				void ConfirmModal.call({ title: 'Sure?' });
			});

			expect(
				await screen.findByRole('button', { name: 'Annuler' })
			).toBeInTheDocument();
		});

		test('should translate the combobox no-results text when labels.noResults is provided', () => {
			render(
				<UIProvider labels={{ noResults: 'Aucun résultat' }}>
					<Combobox label="Country" options={OPTIONS} />
				</UIProvider>
			);
			const input = screen.getByLabelText('Country');
			fireEvent.click(input);
			fireEvent.change(input, { target: { value: 'zzz' } });

			expect(screen.getByRole('status')).toHaveTextContent('Aucun résultat');
		});

		test('should translate the multi combobox search field when labels.search is provided', () => {
			render(
				<UIProvider labels={{ search: 'Rechercher' }}>
					<MultiCombobox label="Fruits" options={OPTIONS} />
				</UIProvider>
			);
			fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

			expect(screen.getByPlaceholderText('Rechercher')).toBeInTheDocument();
		});

		test('should translate the multi combobox clear button when labels.clear is provided', () => {
			render(
				<UIProvider labels={{ clear: 'Effacer' }}>
					<MultiCombobox
						label="Fruits"
						options={OPTIONS}
						defaultValues={['a']}
						maxSelectedValues={2}
					/>
				</UIProvider>
			);
			fireEvent.click(screen.getByRole('combobox', { name: 'Fruits' }));

			expect(
				screen.getByRole('button', { name: 'Effacer' })
			).toBeInTheDocument();
		});

		test('should translate the clear selection button when labels.clearSelection is provided', () => {
			render(
				<UIProvider labels={{ clearSelection: 'Vider la sélection' }}>
					<MultiCombobox
						label="Fruits"
						options={OPTIONS}
						defaultValues={['a']}
					/>
				</UIProvider>
			);

			expect(
				screen.getByRole('button', { name: 'Vider la sélection' })
			).toBeInTheDocument();
		});

		test('should translate the required suffix when labels.required is provided', () => {
			render(
				<UIProvider labels={{ required: 'obligatoire' }}>
					<CheckboxOptions options={OPTIONS} label="Consent" required />
				</UIProvider>
			);

			expect(
				screen.getByRole('group', { name: 'Consent (obligatoire)' })
			).toBeInTheDocument();
		});

		test('should build the theme toggle aria-label from labels.currentTheme when provided', () => {
			render(
				<UIProvider labels={{ currentTheme: (theme) => `Thème : ${theme}` }}>
					<ThemeToggle />
				</UIProvider>
			);

			expect(screen.getByRole('button')).toHaveAttribute(
				'aria-label',
				'Thème : system'
			);
		});
	});

	describe('precedence', () => {
		test('should prefer the explicit prop over the provider when both are set', () => {
			render(
				<UIProvider labels={{ noResults: 'Aucun résultat' }}>
					<Combobox label="Country" options={OPTIONS} noResultsText="Nada" />
				</UIProvider>
			);
			const input = screen.getByLabelText('Country');
			fireEvent.click(input);
			fireEvent.change(input, { target: { value: 'zzz' } });

			expect(screen.getByRole('status')).toHaveTextContent('Nada');
		});

		test('should override a parent label when a nested provider sets the same key', () => {
			render(
				<UIProvider labels={{ noResults: 'Aucun résultat' }}>
					<UIProvider labels={{ noResults: 'Sin resultados' }}>
						<Combobox label="Country" options={OPTIONS} />
					</UIProvider>
				</UIProvider>
			);
			const input = screen.getByLabelText('Country');
			fireEvent.click(input);
			fireEvent.change(input, { target: { value: 'zzz' } });

			expect(screen.getByRole('status')).toHaveTextContent('Sin resultados');
		});

		test('should keep the parent label when a key is undefined', async () => {
			render(
				<UIProvider labels={{ close: 'Fermer' }}>
					<UIProvider labels={{ close: undefined }}>
						<ModalProvider />
					</UIProvider>
				</UIProvider>
			);
			act(() => {
				void Modal.call({ title: 'Hello', children: 'Body' });
			});

			expect(
				await screen.findByRole('button', { name: 'Fermer' })
			).toBeInTheDocument();
		});

		test('should keep parent labels when a nested provider sets other keys', () => {
			render(
				<UIProvider labels={{ noResults: 'Aucun résultat' }}>
					<UIProvider labels={{ search: 'Rechercher' }}>
						<Combobox label="Country" options={OPTIONS} />
					</UIProvider>
				</UIProvider>
			);
			const input = screen.getByLabelText('Country');
			fireEvent.click(input);
			fireEvent.change(input, { target: { value: 'zzz' } });

			expect(screen.getByRole('status')).toHaveTextContent('Aucun résultat');
		});
	});
});
