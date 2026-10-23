import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ModalFooter } from './modal_footer';

describe('ModalFooter', () => {
	test('should render nothing when there is no enclosing Modal', () => {
		const { container } = render(<ModalFooter>Actions</ModalFooter>);
		expect(container).toBeEmptyDOMElement();
	});
});
