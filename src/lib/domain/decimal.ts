import type Decimal from "decimal.js";

import type { DecimalLocale } from "../ts";

export const formatDecimalValue = (
  value: Decimal,
  locale: DecimalLocale = "ru-RU",
  decimalPlaces: number = 2,
): string => {
  // Проверяем пограничные случаи
  if (value.isNaN() || !value.isFinite()) {
    return "-";
  }

  // Преобразуем в строку с фиксированным числом знаков после запятой
  const fixedString = value.toFixed(decimalPlaces);

  // Разбиваем на целую и дробную части
  const [integerPart, fractionalPart] = fixedString.split(".");
  const cleanFractionalPart = fractionalPart.replace(/0+$/, "");

  // Форматируем целую часть (разбиваем на тройки)
  let formattedInteger = integerPart;
  if (integerPart.length > 3) {
    const isNegative = integerPart.startsWith("-");
    const absInteger = isNegative ? integerPart.slice(1) : integerPart;

    // Разбиваем на тройки справа налево
    const groups = [];
    for (let i = absInteger.length; i > 0; i -= 3) {
      const start = Math.max(0, i - 3);
      groups.unshift(absInteger.slice(start, i));
    }

    formattedInteger =
      (isNegative ? "-" : "") + groups.join(getThousandsSeparator(locale));
  }

  // Соединяем всё вместе
  if (cleanFractionalPart && decimalPlaces > 0) {
    return formattedInteger + getDecimalSeparator(locale) + cleanFractionalPart;
  }

  return formattedInteger;
};

const getThousandsSeparator = (locale: DecimalLocale): string => {
  switch (locale) {
    case "en-US":
      return ",";
    case "ru-RU":
      return " ";
    case "de-DE":
      return ".";
    default:
      return ",";
  }
};

const getDecimalSeparator = (locale: DecimalLocale): string => {
  switch (locale) {
    case "en-US":
      return ".";
    case "ru-RU":
      return ",";
    case "de-DE":
      return ",";
    default:
      return ".";
  }
};
