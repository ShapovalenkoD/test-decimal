import { DecimalInput } from "@decimal/components/domain";
import { createRateLimitedMockFetch } from "@decimal/mocks";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "sonner";

import type { ListenerDecimalInputProps } from "./listenerDecimalInput.interface";

export const ListenerDecimalInput = (props: ListenerDecimalInputProps) => {
  const { queryValue, ...restProps } = props;

  const mockInstance = useRef(createRateLimitedMockFetch());

  const { isPending, error, data, isFetching } = useQuery({
    queryFn: async (): Promise<string> => {
      const url = `https://api.decimal.com/${queryValue}`;
      const response = await mockInstance.current(url, {
        headers: {
          Authorization: "Bearer token",
        },
        method: "GET",
      });
      return await response.json();
    },
    queryKey: ["decimal-data", restProps.name, queryValue],
  });

  if (error) {
    // Сообщать что пользователь ввёл больше 1 запроса в секунду
    toast.error(`Не успели обновить данные`);
  }

  const EndAdornment =
    isFetching || isPending ? (
      <span className="relative flex size-3 self-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
        <span className="relative inline-flex size-3 rounded-full bg-sky-500" />
      </span>
    ) : null;

  return (
    <DecimalInput EndAdornment={EndAdornment} value={data} {...restProps} />
  );
};
