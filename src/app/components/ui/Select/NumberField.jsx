"use client";

import React, { useEffect } from "react";
import { NumberField } from "@base-ui-components/react/number-field";
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";

export default function ExampleNumberField({ value, onChange }) {
  const id = React.useId();
  const [internalValue, setInternalValue] = React.useState(value || 1);

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  // Handle value changes and propagate to parent
  const handleValueChange = (newValue) => {
    // If newValue is empty, null, undefined, or less than 1, set to 1
    const clampedValue = !newValue || newValue < 1 ? 1 : Math.min(9999, Math.max(1, newValue));
    setInternalValue(clampedValue);
    if (onChange) {
      onChange(clampedValue);
    }
  };

  return (
    <NumberField.Root
      id={id}
      value={internalValue}
      onValueChange={handleValueChange}
      min={1}
      max={9999}
    >
      <NumberField.ScrubArea className="cursor-ew-resize">
        <NumberField.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter dark:drop-shadow-[0_1px_1px_#fff8]">
          <CursorGrowIcon />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>

      <NumberField.Group className="flex">
        <NumberField.Decrement className="flex size-6 items-center justify-center rounded-tl-md rounded-bl-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-600">
          <FaMinus />
        </NumberField.Decrement>

        <NumberField.Input
          className="h-6 w-24 border-t border-b border-gray-200 text-center text-lg text-gray-900 tabular-nums focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          onBlur={(e) => {
            const value = e.target.value;
            if (!value || value === '') {
              handleValueChange(1);
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              setInternalValue(1);
              return;
            }
            const newValue = parseInt(value, 10);
            if (!isNaN(newValue)) {
              handleValueChange(newValue);
            }
          }}
          onKeyDown={(e) => {
            if (
              ["e", "E", "+", "-", ".", ","].includes(e.key) || // prevent non-numeric
              (e.key === "0" && e.currentTarget.value === "") // prevent starting with 0
            ) {
              e.preventDefault();
            }
          }}
        />

        <NumberField.Increment className="flex size-6 items-center justify-center rounded-tr-md rounded-br-md border border-gray-200 bg-gray-50 text-gray-900 select-none hover:bg-gray-100 active:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-600">
          <FaPlus />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}

function CursorGrowIcon(props) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 24 14"
      fill="black"
      stroke="white"
      className="dark:fill-white dark:stroke-black"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  );
}
