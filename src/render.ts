import { renderComponent } from "./component";
import type { VNode } from "./types";

/**
 * Renders a virtual DOM node to the actual DOM by creating elements and appending them.
 * This performs the initial mount - for updates, use the reconciler's update() function.
 *
 * Handles three types of vnodes:
 * - null: no-op
 * - string: creates a text node
 * - VNode with string type: creates a DOM element with props and children
 * - VNode with function type: calls the component function and renders the result
 *
 * @param vnode - The virtual node to render (VNode, string, or null)
 * @param container - The DOM element to render into
 *
 * @example
 * render(createElement("div", null, "Hello"), document.getElementById("root"))
 */
export function render(vnode: VNode | string | null, container: HTMLElement) {
  if (vnode === null) return;

  if (typeof vnode === "string") {
    container.appendChild(document.createTextNode(vnode));
    return;
  }

  if (typeof vnode.type === "function") {
    const result = renderComponent(vnode, container);
    render(result, container);
    return;
  }

  const element = document.createElement(vnode.type as string);
  vnode.dom = element; // Store DOM element for reconcilliation

  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else if (key === "className") {
        element.setAttribute("class", value);
      } else {
        element.setAttribute(key, value);
      }
    }
  }

  for (const child of vnode.children) {
    render(child, element);
  }

  container.appendChild(element);
}
