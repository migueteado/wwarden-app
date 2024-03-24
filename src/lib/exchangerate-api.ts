import { ENV } from "./env";

type ExchangeRateApiResponse = {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
};

export const getCurrentExchangeRate = async () => {
  const response = await fetch(
    `${ENV.EXCHANGE_RATE_API_URL}/${ENV.EXCHANGE_RATE_API_KEY}/latest/USD`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }

  const data: ExchangeRateApiResponse = await response.json();

  if (data.result !== "success") {
    throw new Error("Failed to fetch exchange rate");
  }

  return data.conversion_rates;
};
