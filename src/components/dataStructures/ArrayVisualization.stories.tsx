import type { Meta, StoryObj } from '@storybook/react';
import { ArrayVisualization } from './ArrayVisualization';

const meta: Meta<typeof ArrayVisualization> = {
  title: 'Data Structures/ArrayVisualization',
  component: ArrayVisualization,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive array visualization with insert, delete, and search operations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialArray: {
      control: { type: 'object' },
      description: 'Initial array values',
    },
    width: {
      control: { type: 'number', min: 400, max: 1200, step: 50 },
      description: 'Width of the visualization area',
    },
    height: {
      control: { type: 'number', min: 200, max: 600, step: 50 },
      description: 'Height of the visualization area',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialArray: [10, 25, 30, 45, 60],
    width: 800,
    height: 300,
  },
};

export const SmallArray: Story = {
  args: {
    initialArray: [5, 15, 25],
    width: 600,
    height: 250,
  },
};

export const LargeArray: Story = {
  args: {
    initialArray: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    width: 1000,
    height: 350,
  },
};

export const EmptyArray: Story = {
  args: {
    initialArray: [],
    width: 800,
    height: 300,
  },
};

export const SingleElement: Story = {
  args: {
    initialArray: [42],
    width: 400,
    height: 250,
  },
};
