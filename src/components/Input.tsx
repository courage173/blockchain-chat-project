import React, { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  fluid?: boolean;
  disabled?: boolean;
  icon?: JSX.Element;
  hint?: string;
  error?: string;
  className?: string;
  iconClassName?: string;
  isNumber?: boolean;
  valueIsNumericString?: never;
  format?: never;
  ref?: React.Ref<HTMLInputElement>;
};

export const Input = ({ type = "text", error, className, ...rest }: Props) => {
  return (
    <div>
      <input
        className={`px-3 py-1 w-full rounded bg-transparent border border-slate-700 focus:outline-none h-[50px] md:h-[40px]  ${
          className ? className : ""
        } ${error ? "border-red-500 focus:outline-none focus:ring-none" : ""}`}
        type={type}
        {...rest}
      />
      {error && <div className="text-xs text-[#d64242] mt-[5px]">{error}</div>}
    </div>
  );
};
