export interface DecimalInputGroupProps {
  className?: string;
}

export interface ApiRequestPairCalc {
  pairId: number;
  inAmount: number | null;
  outAmount: number | null;
}

export interface ApiResponsePairCalc {
  inAmount: number;
  outAmount: number;
  isStraight: boolean;
  price: [string, string];
}
