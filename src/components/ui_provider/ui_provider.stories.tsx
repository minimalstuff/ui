import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '#components/button/button';
import { Combobox } from '#components/combobox/combobox';
import { Input } from '#components/input/input';
import { ConfirmModal } from '#components/modal/confirm_modal';
import { ModalProvider } from '#components/modal_provider/modal_provider';
import { UIProvider, type UILabels } from './ui_provider';

const FRENCH_LABELS: Partial<UILabels> = {
	close: 'Fermer',
	confirm: 'Confirmer',
	cancel: 'Annuler',
	noResults: 'Aucun résultat',
	clearSelection: 'Effacer la sélection',
	search: 'Rechercher',
	clear: 'Effacer',
	required: 'obligatoire',
	currentTheme: (theme) => `Thème actuel : ${theme}`,
};

const FRUIT_OPTIONS = [
	{ value: 'apple', label: 'Pomme' },
	{ value: 'banana', label: 'Banane' },
	{ value: 'orange', label: 'Orange' },
];

function UIProviderDemo() {
	const handleOpenConfirm = () => {
		void ConfirmModal.call({
			title: 'Supprimer cet élément ?',
			children: 'Cette action est irréversible.',
		});
	};

	return (
		<div className="flex w-80 flex-col gap-4">
			<Combobox
				label="Fruit"
				placeholder="Choisir un fruit..."
				options={FRUIT_OPTIONS}
			/>
			<Button onClick={handleOpenConfirm}>Ouvrir la confirmation</Button>
		</div>
	);
}

const meta = {
	title: 'Example/UIProvider',
	component: UIProvider,
	parameters: {
		layout: 'centered',
		skipGlobalModalRoot: true,
	},
	tags: ['autodocs'],
	args: {
		labels: FRENCH_LABELS,
		children: null,
	},
	render: (args) => (
		<UIProvider {...args}>
			<ModalProvider />
			<UIProviderDemo />
		</UIProvider>
	),
} satisfies Meta<typeof UIProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const French: Story = {};

export const WithoutFieldErrorAnnouncements: Story = {
	args: {
		announceFieldErrors: false,
	},
	render: (args) => (
		<UIProvider {...args}>
			<div className="w-80">
				<Input label="Email" error="Ce champ est obligatoire" />
			</div>
		</UIProvider>
	),
};
