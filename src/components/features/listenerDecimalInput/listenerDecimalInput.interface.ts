import type { DecimalInputProps } from "@decimal/components/domain";

type PickDecimalInputProps = Pick<
  DecimalInputProps,
  "className" | "formatConfig" | "name" | "placeholder" | "onChange"
>;

export interface ListenerDecimalInputProps extends PickDecimalInputProps {
  queryValue?: string;
}
