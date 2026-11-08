import { fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ListboxOptionData } from '#components/shared/listbox_option';
import {
	ListboxOptions,
	type ListboxOptionState,
} from '#components/shared/listbox_options';
import { INITIAL_WINDOW_SIZE } from '#components/shared/listbox_window';

const OPTION_COUNT = 3000;
const LISTBOX_ID = 'test-listbox';

const options: ListboxOptionData[] = Array.from(
	{ length: OPTION_COUNT },
	(_, index) => ({ value: `value-${index}`, label: `Label ${index}` })
);

function renderContent(option: ListboxOptionData) {
	return option.label;
}

function renderListbox(
	overrides: Partial<React.ComponentProps<typeof ListboxOptions>> = {}
) {
	const getOptionState = vi.fn<
		(option: ListboxOptionData) => ListboxOptionState
	>(() => ({ isSelected: false }));
	const onOptionClick = vi.fn<(option: ListboxOptionData) => void>();
	const view = render(
		<ListboxOptions
			id={LISTBOX_ID}
			options={options}
			activeIndex={-1}
			noResultsText="No results"
			getOptionState={getOptionState}
			renderOptionContent={renderContent}
			onOptionClick={onOptionClick}
			{...overrides}
		/>
	);
	return { ...view, getOptionState };
}

describe('ListboxOptions', () => {
	test('should mount every option when not windowed', () => {
		const { getAllByRole } = renderListbox({ isWindowed: false });

		expect(getAllByRole('option')).toHaveLength(OPTION_COUNT);
	});

	test('should not truncate options when not windowed', () => {
		const { getAllByRole } = renderListbox({ isWindowed: false });

		expect(getAllByRole('option')[0]).not.toHaveClass('truncate');
	});

	test('should mount a bounded number of options when windowed', () => {
		const { getAllByRole } = renderListbox({
			isWindowed: true,
			labelOverflow: 'wrap-active',
		});

		expect(getAllByRole('option')).toHaveLength(INITIAL_WINDOW_SIZE);
	});

	test('should truncate options when windowed', () => {
		const { getAllByRole } = renderListbox({
			isWindowed: true,
			labelOverflow: 'wrap-active',
		});

		expect(getAllByRole('option')[0]).toHaveClass('truncate');
	});

	test('should read the state of mounted options only when windowed', () => {
		const { getOptionState } = renderListbox({
			isWindowed: true,
			labelOverflow: 'wrap-active',
		});

		expect(getOptionState).toHaveBeenCalledTimes(INITIAL_WINDOW_SIZE);
	});

	test('should keep the last option mounted when it is active but far from the window', () => {
		const lastIndex = OPTION_COUNT - 1;
		const { container } = renderListbox({
			isWindowed: true,
			labelOverflow: 'wrap-active',
			activeIndex: lastIndex,
		});

		expect(
			container.querySelector(`#${LISTBOX_ID}-option-${lastIndex}`)
		).not.toBeNull();
	});

	test('should render the far active option last in DOM order', () => {
		const lastIndex = OPTION_COUNT - 1;
		const { getAllByRole } = renderListbox({
			isWindowed: true,
			labelOverflow: 'wrap-active',
			activeIndex: lastIndex,
		});

		expect(getAllByRole('option').at(-1)).toHaveAttribute(
			'aria-posinset',
			String(OPTION_COUNT)
		);
	});

	test('should keep set size on the far active option', () => {
		const { getAllByRole } = renderListbox({
			isWindowed: true,
			labelOverflow: 'wrap-active',
			activeIndex: OPTION_COUNT - 1,
		});

		expect(getAllByRole('option').at(-1)).toHaveAttribute(
			'aria-setsize',
			String(OPTION_COUNT)
		);
	});
});

describe('ListboxOptions scrolling when not windowed', () => {
	const scrollIntoView = vi.fn<(options: ScrollIntoViewOptions) => void>();

	beforeEach(() => {
		scrollIntoView.mockClear();
		Element.prototype.scrollIntoView = scrollIntoView;
	});

	test('should scroll the active option into view when activeIndex changes', () => {
		const view = renderListbox({ activeIndex: -1 });
		view.rerender(
			<ListboxOptions
				id={LISTBOX_ID}
				options={options}
				activeIndex={3}
				noResultsText="No results"
				getOptionState={() => ({ isSelected: false })}
				renderOptionContent={renderContent}
				onOptionClick={vi.fn<(option: ListboxOptionData) => void>()}
			/>
		);

		expect(scrollIntoView.mock.contexts.at(-1)).toBe(
			view.container.querySelector(`#${LISTBOX_ID}-option-3`)
		);
	});

	test('should request nearest block alignment when scrolling', () => {
		renderListbox({ activeIndex: 3 });

		expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
	});

	test('should scroll the initially visible option into view when none is active', () => {
		const { container } = renderListbox({
			activeIndex: -1,
			initialVisibleIndex: 7,
		});

		expect(scrollIntoView.mock.contexts).toEqual([
			container.querySelector(`#${LISTBOX_ID}-option-7`),
		]);
	});

	test('should scroll the active option instead of the initially visible one', () => {
		const { container } = renderListbox({
			activeIndex: 2,
			initialVisibleIndex: 7,
		});

		expect(scrollIntoView.mock.contexts).toEqual([
			container.querySelector(`#${LISTBOX_ID}-option-2`),
		]);
	});
});

describe('ListboxOptions label overflow', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	const SMALL_OPTIONS: ListboxOptionData[] = [
		{ value: 'a', label: 'Short' },
		{ value: 'b', label: 'A very long label that does not fit on one line' },
		{ value: 'c', label: 'Other' },
	];
	const ACTIVE_INDEX = 1;

	function mockOverflow(isOverflowing: boolean) {
		vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
			isOverflowing ? 200 : 100
		);
		vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
	}

	function renderSmall(
		labelOverflow: 'wrap' | 'wrap-active' | 'truncate' | undefined
	) {
		const view = renderListbox({
			options: SMALL_OPTIONS,
			activeIndex: ACTIVE_INDEX,
			labelOverflow,
		});
		return view.getAllByRole('option');
	}

	test('should neither truncate nor add titles by default', () => {
		const rows = renderSmall(undefined);

		expect(rows.some((row) => row.classList.contains('truncate'))).toBe(false);
		expect(rows.some((row) => row.hasAttribute('title'))).toBe(false);
	});

	test('should truncate inactive rows and let the active row wrap when wrap-active', () => {
		const rows = renderSmall('wrap-active');

		expect(rows.map((row) => row.classList.contains('truncate'))).toEqual([
			true,
			false,
			true,
		]);
	});

	test('should set a title on hover when a truncated label is cut off', () => {
		mockOverflow(true);
		const rows = renderSmall('wrap-active');

		fireEvent.mouseEnter(rows[0]);

		expect(rows[0]).toHaveAttribute('title', SMALL_OPTIONS[0].label);
	});

	test('should not set a title on hover when a truncated label fits', () => {
		mockOverflow(false);
		const rows = renderSmall('wrap-active');

		fireEvent.mouseEnter(rows[0]);

		expect(rows[0]).not.toHaveAttribute('title');
	});

	test('should never set a title on the active row when wrap-active', () => {
		mockOverflow(true);
		const rows = renderSmall('wrap-active');

		fireEvent.mouseEnter(rows[ACTIVE_INDEX]);

		expect(rows[ACTIVE_INDEX]).not.toHaveAttribute('title');
	});

	test('should never set a title on hover when wrap', () => {
		mockOverflow(true);
		const rows = renderSmall('wrap');

		fireEvent.mouseEnter(rows[0]);

		expect(rows[0]).not.toHaveAttribute('title');
	});

	test('should truncate every row including the active one when truncate', () => {
		const rows = renderSmall('truncate');

		expect(rows.every((row) => row.classList.contains('truncate'))).toBe(true);
	});

	test('should set a title on the active row on hover when truncate', () => {
		mockOverflow(true);
		const rows = renderSmall('truncate');

		fireEvent.mouseEnter(rows[ACTIVE_INDEX]);

		expect(rows[ACTIVE_INDEX]).toHaveAttribute(
			'title',
			SMALL_OPTIONS[ACTIVE_INDEX].label
		);
	});
});

describe('ListboxOptions no results status', () => {
	test('should mount the status region empty then fill it with the text when the list is empty', async () => {
		const { getByRole } = renderListbox({ options: [] });

		expect(getByRole('status')).toBeEmptyDOMElement();
		await waitFor(() =>
			expect(getByRole('status')).toHaveTextContent('No results')
		);
	});

	test('should keep the status region empty when there are options', async () => {
		const { getByRole } = renderListbox();

		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(getByRole('status')).toBeEmptyDOMElement();
	});
});
