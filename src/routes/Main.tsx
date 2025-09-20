import { ListenerDecimalInput } from "@decimal/components/features";
import { useDebounce } from "@decimal/lib/hooks";
import { twJoin } from "tailwind-merge";

export const MainPage = () => {
  const { handleChange: handleChangeFoo, value: queryValueFoo } = useDebounce();
  const { handleChange: handleChangeBar, value: queryValueBar } = useDebounce();

  return (
    <div
      className={twJoin(
        "flex flex-col gap-10 p-4",
        "laptop:flex-row",
        "desktop:justify-center",
      )}
    >
      <ListenerDecimalInput
        className="desktop:max-w-100 grow"
        name="foo"
        onChange={handleChangeFoo}
        queryValue={queryValueBar}
      />
      <ListenerDecimalInput
        className="desktop:max-w-100 grow"
        name="bar"
        onChange={handleChangeBar}
        queryValue={queryValueFoo}
      />
    </div>
  );
};
