import styled from '@emotion/styled';
import { rgba } from '~/lib/colors';

const Input = styled.input(({ theme }) => ({
  width: '100%',
  color: theme.colors.font,
  backgroundColor: theme.colors.secondary,
  padding: '0.75em 1em',
  border: `1px solid ${rgba(theme.colors.grey.default, 0.25)}`,
  borderBottom: `2px solid ${rgba(theme.colors.grey.default, 0.25)}`,
  borderRadius: theme.borders.radius.m,
  transition: theme.transitions.delay.normal,

  '&:focus': {
    borderBottom: `2px solid ${theme.colors.blue.default}`,
  },

  '&:disabled': {
    opacity: 0.85,
  },

  '&::placeholder': {
    fontStyle: 'italic',
    color: theme.colors.grey.default,
  },
}));

export default Input;
