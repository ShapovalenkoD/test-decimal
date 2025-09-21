import { formatDecimalValue } from "@decimal/lib/domain";
import Decimal from "decimal.js";
import { memo, useCallback, useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";

import type { DecimalInputProps } from "./decimalInput.interface";

export const DecimalInput = memo((props: DecimalInputProps) => {
  const { value, min, max, step, currency, onChange, disabled = false } = props;

  const [inputValue, setInputValue] = useState<string>(() =>
    formatDecimalValue(value),
  );
  const parseInput = useCallback((val: string): Decimal => {
    const cleanedValue = val.replace(/\s+/g, "").replace(",", ".");
    return new Decimal(cleanedValue || 0);
  }, []);

  const correctValue = useCallback(
    (val: Decimal): Decimal => {
      let corrected = val;

      if (corrected.isNaN() || !corrected.isFinite()) {
        return min;
      }

      if (corrected.lessThan(min)) {
        corrected = min;
      } else if (corrected.greaterThan(max)) {
        corrected = max;
      }

      // Корректировка по шагу
      const remainder = corrected.minus(min).mod(step);
      if (!remainder.equals(0)) {
        corrected = corrected.minus(remainder);

        // Округляем до ближайшего шага
        if (remainder.greaterThan(step.dividedBy(2))) {
          corrected = corrected.plus(step);
        }
      }

      return corrected;
    },
    [min, max, step],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    setInputValue((oldValue) => {
      let rawValue = "";
      try {
        const numValue = parseInput(inputValue);
        const corrected = correctValue(numValue);
        rawValue = formatDecimalValue(corrected);
      } catch (_e) {
        rawValue = oldValue;
      }

      onChange(correctValue(parseInput(rawValue)));
      return rawValue;
    });
  };

  const handlePercentageClick = (percentage: number) => {
    const newValue = min.plus(max.minus(min).times(percentage).dividedBy(100));
    const correctedValue = correctValue(newValue);
    setInputValue(formatDecimalValue(correctedValue));
    onChange(correctedValue);
  };

  useEffect(() => {
    setInputValue(formatDecimalValue(value));
  }, [value]);

  const totalProgress = parseInput(inputValue)
    .minus(min)
    .dividedBy(max.minus(min))
    .times(100)
    .toNumber();

  const arrayPercentage = [25, 50, 75, 100];
  const totalBlocks = arrayPercentage.length;

  return (
    <div className="flex grow flex-col gap-y-1">
      <div className="flex items-center gap-x-1">
        <span className="font-bold text-blue-500 text-lg">{currency}</span>
        <input
          className="grow p-1 font-bold text-lg"
          disabled={disabled}
          onChange={handleInputChange}
          type="text"
          value={inputValue}
        />
      </div>

      <div className="h-0.25 bg-gray-200" />

      <div className="flex justify-between gap-x-2">
        {arrayPercentage.map((percentage, index) => {
          const progressPerBlock = 100 / totalBlocks;

          const blockStart = index * progressPerBlock;

          const blockEnd = (index + 1) * progressPerBlock;

          let blockFill = 0;

          if (totalProgress >= blockEnd) {
            blockFill = 100;
          } else if (totalProgress > blockStart) {
            blockFill = ((totalProgress - blockStart) / progressPerBlock) * 100;
          }

          return (
            <button
              className={twJoin(
                "relative grow overflow-hidden rounded-xl p-1.5",
                "text-center font-semibold text-gray-500 text-sm leading-3.5",
                "border border-gray-400",
              )}
              disabled={disabled}
              key={percentage}
              onClick={() => handlePercentageClick(percentage)}
              type="button"
            >
              {percentage}%
              <span
                className="absolute inset-0 place-content-center bg-blue-400 text-white"
                style={{
                  clipPath: `polygon(0 0, ${blockFill}% 0, ${blockFill}% 100%, 0 100%)`,
                }}
              >
                {percentage}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
