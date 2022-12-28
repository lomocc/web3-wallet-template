// @ts-ignore
import jazzicon from "@metamask/jazzicon";
import { HTMLAttributes, useEffect, useRef } from "react";

export interface NetworkAccountAvatarProps extends HTMLAttributes<HTMLElement> {
  address?: string;
  diameter?: number;
}

export default function EthereumAvatar({
  address,
  diameter = 24,
  ...props
}: NetworkAccountAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const seed = address?.startsWith("0x")
      ? parseInt(address.slice(0, 10), 16) ?? 0
      : 0;
    const element = jazzicon(diameter, seed) as HTMLDivElement;
    element.style.width = "100%";
    element.style.height = "100%";
    element.style.display = "block";
    const svgElement = element.querySelector("svg")!;
    svgElement.style.width = "100%";
    svgElement.style.height = "100%";
    svgElement.setAttribute("viewBox", `0 0 ${diameter} ${diameter}`);
    container.appendChild(element);
    return () => {
      container.removeChild(element);
    };
  }, [address, diameter]);

  return <div ref={containerRef} {...props} />;
}
