'use client';

import { Listbox } from '@headlessui/react';

type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label: string;
  className?: string;
};

export function Select({ value, onChange, options, label, className = '' }: Props) {
  const selected = options.find((o) => o.value === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${className}`}>
        <Listbox.Button
          aria-label={label}
          className="w-full border border-[#8A8371] bg-transparent px-2 py-2 text-left text-[#1F3327] flex items-center justify-between gap-2 hover:border-[#D99A2B]"
        >
          <span>{selected?.label ?? value}</span>
          <span aria-hidden="true" className="text-[#8A8371]">▾</span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border border-[#8A8371] bg-[#FAF6EE] shadow-lg">
          {options.map((option) => (
            <Listbox.Option
              key={option.value}
              value={option.value}
              className={({ active, selected }) =>
                `px-3 py-2 cursor-pointer text-sm ${
                  active ? 'bg-[#1F3327] text-[#FAF6EE]' : 'text-[#1F3327]'
                } ${selected ? 'font-medium' : ''}`
              }
            >
              {option.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}