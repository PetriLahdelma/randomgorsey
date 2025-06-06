import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Modal from '../components/Modal';
import Button from '../components/Button';

export default {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'close' },
    children: { control: 'text' },
  },
} as Meta<typeof Modal>;

const Template: StoryFn<typeof Modal> = (args) => {
  const [open, setOpen] = useState(args.isOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={open} onClose={() => { setOpen(false); args.onClose && args.onClose(); }}>
        {args.children}
      </Modal>
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  isOpen: false,
  children: 'Modal content goes here',
};
