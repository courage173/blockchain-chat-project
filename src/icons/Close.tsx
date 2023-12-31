import * as React from "react";
import type { SVGProps } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width ? props.width : "18"}
    height={props.height ? props.height : "18"}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M13.5 4.5L4.5 13.5"
      stroke={props.color ? props.color : "#76788C"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 4.5L13.5 13.5"
      stroke={props.color ? props.color : "#76788C"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgClose;
