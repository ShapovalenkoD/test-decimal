import { DecimalInput } from "@decimal/components/domain";
import { useMutation } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { twJoin } from "tailwind-merge";

import {
  leftMax,
  leftMin,
  leftStep,
  rightStep,
} from "./DecimalInputGroup.constants";
import type {
  ApiRequestPairCalc,
  ApiResponsePairCalc,
} from "./decimalInputGroup.interface";

export const DecimalInputGroup = () => {
  const [leftValue, setLeftValue] = useState<Decimal>(new Decimal(10000));
  const [rightValue, setRightValue] = useState<Decimal>(new Decimal(0));
  const [rate, setRate] = useState<Decimal>(new Decimal(0));
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rightMin = useMemo(
    () => (rate.greaterThan(0) ? leftMin.times(rate) : new Decimal(0)),
    [rate],
  );
  const rightMax = useMemo(
    () => (rate.greaterThan(0) ? leftMax.times(rate) : new Decimal(0)),
    [rate],
  );

  const exchangeMutation = useMutation({
    mutationFn: async (requestData: ApiRequestPairCalc) => {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;

      // Защита от превышения лимита запросов
      if (timeSinceLastRequest < 1000) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 - timeSinceLastRequest),
        );
      }

      const response = await fetch("/b2api/change/user/pair/calc", {
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
          serial: "a7307e89-fbeb-4b28-a8ce-55b7fb3c32aa",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Ошибка при запросе к API");
      }

      setLastRequestTime(Date.now());
      return response.json();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Функция для выполнения запроса с защитой от частых вызовов
  const debouncedApiRequest = useCallback(
    (amount: Decimal, fromLeft: boolean) => {
      // Отменяем предыдущий запрос, если он был запланирован
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }

      // Запланировать новый запрос
      requestTimeoutRef.current = setTimeout(() => {
        const requestData: ApiRequestPairCalc = {
          inAmount: fromLeft ? amount.toNumber() : null,
          outAmount: fromLeft ? null : amount.toNumber(),
          pairId: 133,
        };

        exchangeMutation.mutate(requestData, {
          onSuccess: (data: ApiResponsePairCalc) => {
            if (fromLeft) {
              setRightValue(new Decimal(data.outAmount));
            } else {
              setLeftValue(new Decimal(data.inAmount));
            }
            setRate(new Decimal(data.price[0]));
          },
        });
      }, 300); // Задержка 300 мс для дебаунса
    },
    [exchangeMutation],
  );

  const handleLeftChange = useCallback(
    (value: Decimal) => {
      setLeftValue(value);
      debouncedApiRequest(value, true);
    },
    [debouncedApiRequest],
  );

  const handleRightChange = useCallback(
    (value: Decimal) => {
      setRightValue(value);
      debouncedApiRequest(value, false);
    },
    [debouncedApiRequest],
  );

  // Первоначальная загрузка данных
  useEffect(() => {
    const initialRequest: ApiRequestPairCalc = {
      inAmount: leftValue.toNumber(),
      outAmount: null,
      pairId: 133,
    };

    exchangeMutation.mutate(initialRequest, {
      onSuccess: (data: ApiResponsePairCalc) => {
        setRightValue(new Decimal(data.outAmount));
        setRate(new Decimal(data.price[0]));
      },
    });
  }, [exchangeMutation.mutate, leftValue.toNumber]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={twJoin(
        "flex flex-col gap-10 p-4",
        "laptop:flex-row",
        "desktop:mx-auto desktop:max-w-250 desktop:justify-center",
      )}
    >
      <DecimalInput
        currency="RUB"
        max={leftMax}
        min={leftMin}
        onChange={handleLeftChange}
        step={leftStep}
        value={leftValue}
      />

      <DecimalInput
        currency="USDT"
        max={rightMax}
        min={rightMin}
        onChange={handleRightChange}
        step={rightStep}
        value={rightValue}
      />
    </div>
  );
};
