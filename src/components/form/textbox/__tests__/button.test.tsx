import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TextBox from '~/components/form/textbox/textbox';
import { ThemeContextProvider } from '~/contexts/theme_context';

describe('Textbox component', () => {
  it('Textbox should render correctly', () => {
    render(<TextBox name="textbox" />, {
      wrapper: ({ children }) => (
        <ThemeContextProvider>{children}</ThemeContextProvider>
      ),
    });
    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });
  // TODO: test value props change
});
