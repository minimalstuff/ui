import { composeStory } from '@storybook/react-vite';

import * as AvatarStories from '#components/avatar/avatar.stories';
import * as BadgeStories from '#components/badge/badge.stories';
import * as ButtonStories from '#components/button/button.stories';
import * as CardStories from '#components/card/card.stories';
import * as CharacterCountStories from '#components/character_count/character_count.stories';
import * as CheckboxStories from '#components/checkbox/checkbox.stories';
import * as CheckboxOptionsStories from '#components/checkbox_options/checkbox_options.stories';
import * as ComboboxStories from '#components/combobox/combobox.stories';
import * as ContextMenuStories from '#components/context_menu/context_menu.stories';
import * as CopyButtonStories from '#components/copy_button/copy_button.stories';
import * as DrawerStories from '#components/drawer/drawer.stories';
import * as HighlightStories from '#components/highlight/highlight.stories';
import * as IconButtonStories from '#components/icon_button/icon_button.stories';
import * as InputStories from '#components/input/input.stories';
import * as KbdStories from '#components/kbd/kbd.stories';
import * as MenuStories from '#components/menu/menu.stories';
import * as ConfirmModalStories from '#components/modal/confirm_modal.stories';
import * as ModalStories from '#components/modal/modal.stories';
import * as MultiComboboxStories from '#components/multi_combobox/multi_combobox.stories';
import * as RadioOptionsStories from '#components/radio_options/radio_options.stories';
import * as SelectStories from '#components/select/select.stories';
import * as SwitchStories from '#components/switch/switch.stories';
import * as TabsStories from '#components/tabs/tabs.stories';
import * as TextareaStories from '#components/textarea/textarea.stories';
import * as ThemeToggleStories from '#components/theme_toggle/theme_toggle.stories';
import * as ToolbarStories from '#components/toolbar/toolbar.stories';
import * as TooltipStories from '#components/tooltip/tooltip.stories';
import type { OverviewGroup } from './overview_entry.js';

const Button = composeStory(ButtonStories.Default, ButtonStories.default);
const IconButton = composeStory(
	IconButtonStories.Default,
	IconButtonStories.default
);
const CopyButton = composeStory(
	CopyButtonStories.Default,
	CopyButtonStories.default
);
const ThemeToggle = composeStory(
	ThemeToggleStories.Default,
	ThemeToggleStories.default
);
const Input = composeStory(InputStories.Default, InputStories.default);
const Textarea = composeStory(TextareaStories.Default, TextareaStories.default);
const CharacterCount = composeStory(
	CharacterCountStories.Default,
	CharacterCountStories.default
);
const Select = composeStory(SelectStories.Default, SelectStories.default);
const Combobox = composeStory(ComboboxStories.Default, ComboboxStories.default);
const MultiCombobox = composeStory(
	MultiComboboxStories.Default,
	MultiComboboxStories.default
);
const Checkbox = composeStory(CheckboxStories.Default, CheckboxStories.default);
const CheckboxOptions = composeStory(
	CheckboxOptionsStories.StringOptions,
	CheckboxOptionsStories.default
);
const RadioOptions = composeStory(
	RadioOptionsStories.StringOptions,
	RadioOptionsStories.default
);
const Switch = composeStory(SwitchStories.Default, SwitchStories.default);
const Avatar = composeStory(AvatarStories.Default, AvatarStories.default);
const Badge = composeStory(BadgeStories.Default, BadgeStories.default);
const Card = composeStory(CardStories.Default, CardStories.default);
const Kbd = composeStory(KbdStories.Default, KbdStories.default);
const Highlight = composeStory(
	HighlightStories.Default,
	HighlightStories.default
);
const Tabs = composeStory(TabsStories.Default, TabsStories.default);
const Toolbar = composeStory(ToolbarStories.Default, ToolbarStories.default);
const Modal = composeStory(ModalStories.Default, ModalStories.default);
const ConfirmModal = composeStory(
	ConfirmModalStories.Default,
	ConfirmModalStories.default
);
const Drawer = composeStory(DrawerStories.Default, DrawerStories.default);
const Menu = composeStory(MenuStories.Default, MenuStories.default);
const ContextMenu = composeStory(
	ContextMenuStories.Default,
	ContextMenuStories.default
);
const Tooltip = composeStory(TooltipStories.Default, TooltipStories.default);

export const OVERVIEW_GROUPS: readonly OverviewGroup[] = [
	{
		label: 'Actions',
		entries: [
			{ name: 'Button', Story: Button },
			{ name: 'IconButton', Story: IconButton },
			{ name: 'CopyButton', Story: CopyButton },
			{ name: 'ThemeToggle', Story: ThemeToggle },
		],
	},
	{
		label: 'Forms',
		entries: [
			{ name: 'Input', Story: Input },
			{ name: 'Textarea', Story: Textarea },
			{ name: 'CharacterCount', Story: CharacterCount },
			{ name: 'Select', Story: Select },
			{ name: 'Combobox', Story: Combobox },
			{ name: 'MultiCombobox', Story: MultiCombobox },
			{ name: 'Checkbox', Story: Checkbox },
			{ name: 'CheckboxOptions', Story: CheckboxOptions },
			{ name: 'RadioOptions', Story: RadioOptions },
			{ name: 'Switch', Story: Switch },
		],
	},
	{
		label: 'Display',
		entries: [
			{ name: 'Avatar', Story: Avatar },
			{ name: 'Badge', Story: Badge },
			{ name: 'Card', Story: Card, isWide: true },
			{ name: 'Kbd', Story: Kbd },
			{ name: 'Highlight', Story: Highlight },
			{ name: 'Tabs', Story: Tabs },
			{ name: 'Toolbar', Story: Toolbar },
		],
	},
	{
		label: 'Overlays',
		entries: [
			{ name: 'Modal', Story: Modal },
			{ name: 'ConfirmModal', Story: ConfirmModal },
			{ name: 'Drawer', Story: Drawer },
			{ name: 'Menu', Story: Menu },
			{ name: 'ContextMenu', Story: ContextMenu },
			{ name: 'Tooltip', Story: Tooltip },
		],
	},
];
