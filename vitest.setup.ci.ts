import '@testing-library/jest-dom/vitest';

import { expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

expect.extend(axeMatchers);

/**
 * Accessibility assertions: in a component test, import `axe` from
 * 'vitest-axe' and assert `expect(await axe(container)).toHaveNoViolations()`.
 * The matcher is registered globally here and runs under happy-dom.
 */
