import type { VNode } from "./types";

export function render(vnode: VNode | string | null, container: HTMLElement) {
  if (vnode === null) return;

  if (typeof vnode === "string") {
    container.appendChild(document.createTextNode(vnode));
    return;
  }

  if (typeof vnode.type === "function") {
    const result = vnode.type(vnode.props);
    render(result, container);
    return;
  }

  const element = document.createElement(vnode.type as string);

  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      element.setAttribute(key === "className" ? "class" : key, value);
    }
  }

  for (const child of vnode.children) {
    render(child, element);
  }

  container.appendChild(element);
}
