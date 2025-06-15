import React from 'react';
import Select, { Props as SelectProps } from 'react-select';

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    minHeight: '30px',
    height: '30px',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: '30px',
  }),
};

const CustomSelect: React.FC<SelectProps> = (props) => {
  return <Select {...props} styles={customStyles} />;
};

export default CustomSelect;