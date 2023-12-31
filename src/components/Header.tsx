import { PropsWithChildren, ReactElement } from "react";

export default function Header({
  children,
}: PropsWithChildren<unknown>): ReactElement {
  return (
    <div className="text-xs bold absolute top-0 left-0 right-0  shadow-md bg-[#252329] z-[999]">
      {children}
    </div>
  );
}
