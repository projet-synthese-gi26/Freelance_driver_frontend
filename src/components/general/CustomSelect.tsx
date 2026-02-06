import React from 'react';
import Select, { Props as SelectProps } from 'react-select';

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    minHeight: '44px',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 12px',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
  }),
};

const CustomSelect: React.FC<SelectProps> = (props) => {
  return <Select {...props} styles={{ ...customStyles, ...(props.styles || {}) }} />;
};

export default CustomSelect;