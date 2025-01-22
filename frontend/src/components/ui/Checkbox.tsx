import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
          checked
            ? 'bg-gradient-to-r from-[#6FDBB8] to-[#6EBFF9] border-transparent'
            : 'border-gray border-dashed'
        }`}
      >
        {checked && <span className="text-white text-sm">✔</span>}
      </div>
      <span className="text-black text-heading4">{label}</span>
    </label>
  );
};

export default Checkbox;
