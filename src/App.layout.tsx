import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = (props: AppLayoutProps) => {
  const { children } = props;

  return <div className="h-screen w-screen">{children}</div>;
};
