import { SVGProps } from "react";

export default function LoadingSVG(props: SVGProps<SVGSVGElement>) {
  let color = props.color;
  if (!props.color) {
    color = "#fff";
  }
  return (
    <svg
      className={`animate-spin h-5 w-5 text-white ${props.className}}`}
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect fill="none" height="256" width="256" />
      <line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="128"
        x2="128"
        y1="32"
        y2="64"
      />
      <line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="224"
        x2="192"
        y1="128"
        y2="128"
      />
      <line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="195.9"
        x2="173.3"
        y1="195.9"
        y2="173.3"
      />
      <line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="128"
        x2="128"
        y1="224"
        y2="192"
      />
      <line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="60.1"
        x2="82.7"
        y1="195.9"
        y2="173.3"
      />
      <line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="32"
        x2="64"
        y1="128"
        y2="128"
      />
      <line
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        x1="60.1"
        x2="82.7"
        y1="60.1"
        y2="82.7"
      />
    </svg>
  );
}
