export const formatNumber = (value: number, minimumFractionDigits: number = 2): string => {
  const formatted = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
  
  // Replace the decimal comma with a dot
  return formatted.replace(/,([^,]*)$/, '.$1');
};

export const formatCurrency = (value: number): string => {
  return `${formatNumber(value)} AZN`;
};
