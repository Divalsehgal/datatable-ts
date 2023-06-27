import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (selectedValue: string) => void;
}

const Dropdown: React.FC<SelectProps> = ({ options, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <select value={value} onChange={handleChange}>
          {
        <option value={""}>
          Select your Resource
        </option>
      }
      {options.map((option,index) => (
        <option key={`${option.value}+${index}`} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
