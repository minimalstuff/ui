// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, test } from 'vitest';

import { Combobox } from './combobox/combobox';
import { ContextMenu } from './context_menu/context_menu';
import { Drawer } from './drawer/drawer';
import { IconButton } from './icon_button/icon_button';
import { Menu } from './menu/menu';
import { MenuItem } from './menu_item/menu_item';
import { ModalProvider } from './modal_provider/modal_provider';
import { Tabs } from './tabs/tabs';
import { ThemeToggle } from './theme_toggle/theme_toggle';
import { Toolbar } from './toolbar/toolbar';
import { Tooltip } from './tooltip/tooltip';
import { UIProvider } from './ui_provider/ui_provider';

describe('server-side rendering', () => {
	test('has no document, so a render-time document access would throw', () => {
		expect(typeof document).toBe('undefined');
	});

	test('renders a closed Tooltip with its trigger', () => {
		const html = renderToString(
			<Tooltip content="Helpful text">
				<button>Hover me</button>
			</Tooltip>
		);

		expect(html).toContain('Hover me');
		expect(html).not.toContain('role="tooltip"');
	});

	test('renders an IconButton with a tooltip', () => {
		const html = renderToString(
			<IconButton icon="i-lucide-settings" aria-label="Settings" tooltip />
		);

		expect(html).toContain('aria-label="Settings"');
	});

	test('renders a ThemeToggle with a tooltip', () => {
		const html = renderToString(<ThemeToggle tooltip />);

		expect(html).toContain('<button');
	});

	test('renders closed overlays without touching the document', () => {
		const html = renderToString(
			<UIProvider>
				<ModalProvider />
				<Drawer isOpen={false} onClose={() => {}} title="Drawer">
					Drawer body
				</Drawer>
				<Menu trigger={<button>Open menu</button>}>
					<MenuItem onClick={() => {}}>Item</MenuItem>
				</Menu>
				<ContextMenu items={<MenuItem onClick={() => {}}>Item</MenuItem>}>
					<div>Right-click area</div>
				</ContextMenu>
			</UIProvider>
		);

		expect(html).toContain('Open menu');
		expect(html).toContain('Right-click area');
		expect(html).not.toContain('Drawer body');
	});

	test('renders Tabs, Toolbar and Combobox', () => {
		const html = renderToString(
			<>
				<Tabs items={[{ title: 'First', content: 'First panel' }]} />
				<Toolbar aria-label="Actions">
					<button>Bold</button>
				</Toolbar>
				<Combobox
					aria-label="Fruit"
					options={[{ value: 'apple', label: 'Apple' }]}
				/>
			</>
		);

		expect(html).toContain('First panel');
		expect(html).toContain('Bold');
		expect(html).toContain('aria-label="Fruit"');
	});
});
