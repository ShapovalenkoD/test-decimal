import type Decimal from "decimal.js";

export interface DecimalInputProps {
  value: Decimal;
  min: Decimal;
  max: Decimal;
  step: Decimal;
  currency: string;
  onChange: (value: Decimal) => void;
  disabled?: boolean;
}
