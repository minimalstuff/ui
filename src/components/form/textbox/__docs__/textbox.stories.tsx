import type { Meta, StoryObj } from '@storybook/react';
import TextBox from '~/components/form/textbox/textbox';

const meta: Meta<typeof TextBox> = {
  title: 'TextBox',
  component: TextBox,
};

export default meta;
type Story = StoryObj<typeof TextBox>;

export const Default: Story = {
  args: {
    label: 'TextBox',
    name: 'test',
    value: 'My textbox',
  },
};
