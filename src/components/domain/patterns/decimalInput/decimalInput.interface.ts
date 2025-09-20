import type { DecimalLocale } from "@decimal/lib/ts";
import type Decimal from "decimal.js";
import type { ReactNode } from "react";

export interface DecimalInputProps {
  disabled?: boolean;
  EndAdornment?: ReactNode;
  className?: string;
  name?: string;
  placeholder?: string;
  value?: number | string | Decimal;
  onChange?: (value: string, instance: Decimal) => void;
  formatConfig?: {
    locale?: DecimalLocale;
    decimalPlaces?: number;
  };
}
