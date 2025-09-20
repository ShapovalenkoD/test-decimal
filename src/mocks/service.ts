// Типы для мокового fetch
interface MockResponse {
  json: () => Promise<string>;
  text: () => Promise<string>;
  status: number;
  ok: boolean;
  headers: Headers;
}

interface MockFetchOptions extends RequestInit {
  // Можно добавить дополнительные опции специфичные для мока
}

type RequestTimestamps = Record<string, number>;

// Функция для генерации моковых данных на основе URL и параметров
const generateMockData = (
  url: string,
  params: URLSearchParams,
  options: MockFetchOptions,
): string => {
  // Генерируем уникальное число на основе URL и параметров
  const hash = url.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  let baseNumber = Math.abs(hash % 1000);

  // Добавляем влияние параметров запроса
  params.forEach((value) => {
    baseNumber += value.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  });

  // Обрабатываем тело запроса (если есть)
  if (options.body) {
    try {
      const bodyData = JSON.parse(options.body as string);
      baseNumber += Object.values(bodyData).reduce((sum: number, val) => {
        return (
          sum +
          (typeof val === "string"
            ? val.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
            : Number(val))
        );
      }, 0);
    } catch (_e) {
      // Если тело не JSON, просто используем как строку
      baseNumber += (options.body as string)
        .split("")
        .reduce((a, b) => a + b.charCodeAt(0), 0);
    }
  }

  // Возвращаем число в виде строки
  return String(Math.abs(baseNumber % 10000));
};

// Моковая функция fetch с ограничением запросов
export const createRateLimitedMockFetch = (): ((
  url: string,
  options?: MockFetchOptions,
) => Promise<MockResponse>) => {
  const requestTimestamps: RequestTimestamps = {};

  return async (
    url: string,
    options: MockFetchOptions = {},
  ): Promise<MockResponse> => {
    const now = Date.now();
    const lastRequestTime = requestTimestamps[url] || 0;

    // Проверяем ограничение для конкретного URL
    if (now - lastRequestTime < 1000) {
      throw new Error(
        `Слишком много запросов к ${url}. Максимум 1 запрос в секунду.`,
      );
    }

    // Обновляем время последнего запроса для этого URL
    requestTimestamps[url] = now;

    // Эмуляция задержки сети
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Генерируем данные на основе URL и параметров
    const queryParams = new URLSearchParams(url.split("?")[1] || "");
    const responseData = generateMockData(url, queryParams, options);

    // Возвращаем объект, имитирующий Response
    return {
      headers: new Headers({
        "Content-Type": "application/json",
      }) as Headers,
      json: async (): Promise<string> => responseData,
      ok: true,
      status: 200,
      text: async (): Promise<string> => JSON.stringify(responseData),
    };
  };
};
