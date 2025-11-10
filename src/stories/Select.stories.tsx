import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Select, { SelectOption } from '../components/Select';

// Sample options for different scenarios
const basicOptions: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const countryOptions: SelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' },
];

const groupedOptions: SelectOption[] = [
  { label: 'Apple', value: 'apple', group: 'Fruits' },
  { label: 'Banana', value: 'banana', group: 'Fruits' },
  { label: 'Orange', value: 'orange', group: 'Fruits' },
  { label: 'Carrot', value: 'carrot', group: 'Vegetables' },
  { label: 'Broccoli', value: 'broccoli', group: 'Vegetables' },
  { label: 'Spinach', value: 'spinach', group: 'Vegetables' },
];

const optionsWithDisabled: SelectOption[] = [
  { label: 'Available Option 1', value: '1' },
  { label: 'Available Option 2', value: '2' },
  { label: 'Disabled Option', value: '3', disabled: true },
  { label: 'Available Option 3', value: '4' },
];

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    value: { 
      control: 'text',
      description: 'Currently selected value'
    },
    placeholder: { 
      control: 'text',
      description: 'Placeholder text when no option is selected'
    },
    label: {
      control: 'text',
      description: 'Label text displayed above the select'
    },
    helpText: {
      control: 'text',
      description: 'Help text displayed below the select'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
      description: 'Size variant of the select'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled'
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show loading state'
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required'
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple selections are allowed'
    },
    onChange: { action: 'changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A flexible Select component with support for grouping, validation, and accessibility features.',
      },
    },
  },
} as Meta<typeof Select>;

// Template for stateful stories
const Template: StoryFn<typeof Select> = (args) => {
  const [value, setValue] = useState(args.value || (args.multiple ? [] : ''));
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (args.multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setValue(selectedOptions);
      args.onChange?.(e);
    } else {
      setValue(e.target.value);
      args.onChange?.(e);
    }
  };
  
  return (
    <Select
      {...args}
      value={value}
      onChange={handleChange}
    />
  );
};

// Template for controlled examples
const ControlledTemplate: StoryFn<typeof Select> = (args) => (
  <Select {...args} />
);

export const Default = Template.bind({});
Default.args = {
  options: basicOptions,
  placeholder: 'Choose an option',
  label: 'Basic Select',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  options: countryOptions,
  placeholder: 'Select a country',
  label: 'Country',
  helpText: 'Choose your country of residence',
};

export const Required = Template.bind({});
Required.args = {
  options: basicOptions,
  placeholder: 'Choose an option',
  label: 'Required Select',
  required: true,
  helpText: 'This field is required',
};

export const WithError = Template.bind({});
WithError.args = {
  options: basicOptions,
  placeholder: 'Choose an option',
  label: 'Select with Error',
  error: 'Please select a valid option',
  value: '',
};

export const Disabled = ControlledTemplate.bind({});
Disabled.args = {
  options: basicOptions,
  placeholder: 'Choose an option',
  label: 'Disabled Select',
  disabled: true,
  value: '',
};

export const Loading = ControlledTemplate.bind({});
Loading.args = {
  options: basicOptions,
  placeholder: 'Loading...',
  label: 'Loading Select',
  loading: true,
  value: '',
};

export const Small = Template.bind({});
Small.args = {
  options: basicOptions,
  placeholder: 'Choose an option',
  label: 'Small Select',
  size: 'small',
};

export const Large = Template.bind({});
Large.args = {
  options: basicOptions,
  placeholder: 'Choose an option',
  label: 'Large Select',
  size: 'large',
};

export const WithGroups = Template.bind({});
WithGroups.args = {
  options: groupedOptions,
  placeholder: 'Select food item',
  label: 'Grouped Options',
  helpText: 'Options are grouped by category',
};

export const WithDisabledOptions = Template.bind({});
WithDisabledOptions.args = {
  options: optionsWithDisabled,
  placeholder: 'Choose an option',
  label: 'Select with Disabled Options',
  helpText: 'Some options are disabled',
};

export const Multiple = Template.bind({});
Multiple.args = {
  options: countryOptions,
  label: 'Multiple Select',
  multiple: true,
  helpText: 'Hold Ctrl/Cmd to select multiple options',
  value: ['us', 'ca'], // Array of selected values
};

export const MultipleWithDisplay = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>(['us', 'ca']);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedValues(selected);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        options={countryOptions}
        value={selectedValues}
        onChange={handleChange}
        multiple={true}
        label="Multiple Country Selection"
        helpText="Hold Ctrl/Cmd to select multiple countries"
      />
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        <strong>Selected Values:</strong>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          {selectedValues.length > 0 ? (
            selectedValues.map(value => {
              const option = countryOptions.find(opt => opt.value === value);
              return (
                <li key={value}>
                  {option?.label} ({value})
                </li>
              );
            })
          ) : (
            <li>No items selected</li>
          )}
        </ul>
        <small>Array: [{selectedValues.map(v => `"${v}"`).join(', ')}]</small>
      </div>
    </div>
  );
};
MultipleWithDisplay.parameters = {
  docs: {
    description: {
      story: 'This story demonstrates multiple selection functionality with a live display of selected values.',
    },
  },
};

// Playground story for testing all combinations
export const Playground = Template.bind({});
Playground.args = {
  options: countryOptions,
  placeholder: 'Select a country',
  label: 'Interactive Select',
  helpText: 'Try different combinations of props',
  size: 'medium',
  disabled: false,
  loading: false,
  required: false,
  multiple: false,
};
Playground.parameters = {
  docs: {
    description: {
      story: 'Use the controls below to interact with all Select props and see how they work together.',
    },
  },
};
