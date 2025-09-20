import { formatDecimalValue } from "@decimal/lib/domain";
import Decimal from "decimal.js";
import {
  type ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

import type { DecimalInputProps } from "./decimalInput.interface";

export const DecimalInput = memo((props: DecimalInputProps) => {
  const {
    disabled,
    className,
    value: inputValue,
    placeholder = "Decimal input",
    onChange,
    name,
    formatConfig,
    EndAdornment,
  } = props;
  const { decimalPlaces = 2, locale = "ru-RU" } = formatConfig || {};

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChangeInput = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;

      try {
        const decimal = new Decimal(value);

        const formattedValue = formatDecimalValue(
          decimal,
          locale,
          decimalPlaces,
        );

        if (onChange) {
          onChange(formattedValue, decimal);
        }
        setError("");
      } catch (error) {
        if (error instanceof Error && /DecimalError/.test(error.message)) {
          setError("Не верный формат данных: ввели");
        }
      }

      setValue(value);
    },
    [decimalPlaces, locale, onChange],
  );

  useEffect(() => {
    if (inputValue) {
      try {
        const decimal = new Decimal(inputValue || "");
        decimal;
        const formattedValue = formatDecimalValue(
          decimal,
          locale,
          decimalPlaces,
        );

        setValue(formattedValue);
        setError("");
      } catch (error) {
        if (error instanceof Error && /DecimalError/.test(error.message)) {
          setError("Не верный формат данных: поступил");
        }
      }
    }
  }, [inputValue, locale, decimalPlaces]);

  return (
    <div className={twMerge("flex-row gap-2", className)}>
      <div className="flex gap-x-2 bg-white p-1">
        <input
          className="grow text-black"
          disabled={disabled}
          name={name}
          onChange={handleChangeInput}
          placeholder={placeholder}
          value={value}
        />
        {EndAdornment ? (
          EndAdornment
        ) : (
          <p className="text-nowrap text-black">{locale}</p>
        )}
      </div>
      <p className="text-2xl text-red-400">{error}</p>
    </div>
  );
});
