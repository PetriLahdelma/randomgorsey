/**
 * Select Component Usage Examples
 * 
 * This file demonstrates common usage patterns for the Select component.
 */

import React, { useState } from 'react';
import Select, { SelectOption } from './Select';

// Example 1: Basic usage
const BasicExample = () => {
  const [value, setValue] = useState('');
  
  const options: SelectOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];

  return (
    <Select
      options={options}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Choose an option"
      label="Basic Select"
    />
  );
};

// Example 2: With validation and error handling
const ValidationExample = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const options: SelectOption[] = [
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Example validation
    if (newValue === 'red') {
      setError('Red is currently not available');
    } else {
      setError('');
    }
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      placeholder="Select a color"
      label="Color Selection"
      error={error}
      required
      helpText="Choose your preferred color"
    />
  );
};

// Example 3: Grouped options
const GroupedExample = () => {
  const [value, setValue] = useState('');
  
  const options: SelectOption[] = [
    { label: 'Apple', value: 'apple', group: 'Fruits' },
    { label: 'Banana', value: 'banana', group: 'Fruits' },
    { label: 'Carrot', value: 'carrot', group: 'Vegetables' },
    { label: 'Broccoli', value: 'broccoli', group: 'Vegetables' },
  ];

  return (
    <Select
      options={options}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Select food item"
      label="Food Categories"
      helpText="Options are organized by type"
    />
  );
};

// Example 4: Multiple Selection
const MultipleExample = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>(['apple', 'carrot']);
  
  const options: SelectOption[] = [
    { label: 'Apple', value: 'apple', group: 'Fruits' },
    { label: 'Banana', value: 'banana', group: 'Fruits' },
    { label: 'Carrot', value: 'carrot', group: 'Vegetables' },
    { label: 'Broccoli', value: 'broccoli', group: 'Vegetables' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedValues(selected);
  };

  return (
    <div>
      <Select
        options={options}
        value={selectedValues}
        onChange={handleChange}
        multiple={true}
        label="Multiple Food Selection"
        helpText="Hold Ctrl/Cmd to select multiple items"
      />
      
      <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
        Selected: {selectedValues.length > 0 ? selectedValues.join(', ') : 'None'}
      </div>
    </div>
  );
};

// Example 5: Different sizes and states
const StatesExample = () => {
  const [values, setValues] = useState({
    small: '',
    medium: '',
    large: '',
    disabled: '',
    loading: '',
  });
  
  const options: SelectOption[] = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Select
        options={options}
        value={values.small}
        onChange={(e) => setValues(prev => ({ ...prev, small: e.target.value }))}
        placeholder="Small select"
        label="Small Size"
        size="small"
      />
      
      <Select
        options={options}
        value={values.medium}
        onChange={(e) => setValues(prev => ({ ...prev, medium: e.target.value }))}
        placeholder="Medium select"
        label="Medium Size"
        size="medium"
      />
      
      <Select
        options={options}
        value={values.large}
        onChange={(e) => setValues(prev => ({ ...prev, large: e.target.value }))}
        placeholder="Large select"
        label="Large Size"
        size="large"
      />
      
      <Select
        options={options}
        value={values.disabled}
        onChange={(e) => setValues(prev => ({ ...prev, disabled: e.target.value }))}
        placeholder="Disabled select"
        label="Disabled State"
        disabled
      />
      
      <Select
        options={options}
        value={values.loading}
        onChange={(e) => setValues(prev => ({ ...prev, loading: e.target.value }))}
        placeholder="Loading..."
        label="Loading State"
        loading
      />
    </div>
  );
};

export {
  BasicExample,
  ValidationExample,
  GroupedExample,
  MultipleExample,
  StatesExample,
};