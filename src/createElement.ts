import type { VNode } from "./types";

/**
 * Creates a virtual DOM node (VNode) representing an element or component.
 * This is typically used as the JSX pragma function (e.g., React.createElement).
 *
 * @param type - Element tag name (e.g., "div") or function component
 * @param props - Element properties/attributes including optional key
 * @param children - Child nodes (VNodes, strings, or nested arrays)
 * @returns A VNode object representing the element tree
 *
 * @example
 * createElement("div", { id: "app" }, "Hello", createElement("span", null, "World"))
 * // Returns: { type: "div", props: { id: "app" }, children: ["Hello", { type: "span", ... }] }
 */
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
    .map((child) => {
      return typeof child === "object" && child.type ? child : String(child);
    });

  return {
    type,
    props: props ? restProps : null,
    children: flatChildren,
    ...(key !== undefined ? { key } : {}),
  };
}
