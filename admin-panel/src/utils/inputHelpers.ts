import React from 'react';

/**
 * Ensures that the input value only contains numbers.
 * @param e - The input change event
 * @param allowDecimal - Whether to allow decimal points (default: false)
 */
export const allowOnlyNumbers = (
  e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>,
  allowDecimal: boolean = false
) => {
  let value = (e.currentTarget as HTMLInputElement).value;

  if (allowDecimal) {
    // Allow only digits and a single decimal point
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
  } else {
    // Allow only digits
    value = value.replace(/[^0-9]/g, '');
  }

  (e.currentTarget as HTMLInputElement).value = value;
};
