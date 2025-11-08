import type { VNode } from "./types";

export function createElement(
  type: any,
  props: any,
  ...children: any[]
): VNode {
  const { key, ...restProps } = props || {};

  const flatChildren = children
    .flat(Infinity)
    .filter(
      (child) =>
        child !== null &&
        child !== undefined &&
        child !== true &&
        child !== false
    )
    .map(String);

  return {
    type,
    props: props ? restProps : null,
    children: flatChildren,
    ...(key !== undefined ? { key } : {}),
  };
}
