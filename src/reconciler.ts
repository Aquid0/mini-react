import type { VNode } from "./types";
import { render } from "./render";

type UpdateOperation = "MOUNT" | "UNMOUNT" | "UPDATE" | "REPLACE";

function mount(vnode: VNode | string, container: HTMLElement) {
  render(vnode, container);
}

function updateElement(prevVNode: VNode, nextVNode: VNode) {
  if (prevVNode.dom instanceof Element) {
    updateProps(prevVNode.dom, prevVNode.props || {}, nextVNode.props || {});
    updateChildren(
      prevVNode.dom as HTMLElement,
      prevVNode.children,
      nextVNode.children
    );
  }
}

function replace(
  prevVNode: VNode | string,
  nextVNode: VNode | string,
  container: HTMLElement,
  index?: number
) {
  unmount(prevVNode, container, index);
  mount(nextVNode, container);
}

function unmount(
  vnode: VNode | string,
  container: HTMLElement,
  index?: number
) {
  if (typeof vnode === "object" && vnode.dom) {
    vnode.dom.parentNode?.removeChild(vnode.dom);
  } else if (index !== undefined) {
    const node = container.childNodes[index];
    if (node) container.removeChild(node);
  }
}

function updateProps(
  element: Element,
  prevProps: Record<string, any>,
  nextProps: Record<string, any>
) {
  // Remove old props
  for (const [key, value] of Object.entries(prevProps)) {
    if (!(key in nextProps)) {
      if (key.startsWith("on") && typeof value === "function") {
        element.removeEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === "className") {
        element.removeAttribute("class");
      } else {
        element.removeAttribute(key);
      }
    }
  }

  // Add/update new props
  for (const [key, value] of Object.entries(nextProps)) {
    if (prevProps[key] !== value) {
      if (key.startsWith("on") && typeof value === "function") {
        const eventName = key.slice(2).toLowerCase();
        // Replace event listener if it already existed
        if (prevProps[key]) {
          element.removeEventListener(eventName, prevProps[key]);
        }
        element.addEventListener(eventName, value);
      } else if (key === "className") {
        element.setAttribute("class", value);
      } else {
        element.setAttribute(key, value);
      }
    }
  }
}

function updateChildren(
  element: HTMLElement,
  prevChildren: Array<VNode | string>,
  nextChildren: Array<VNode | string>
) {
  const maxLength = Math.max(prevChildren.length, nextChildren.length);
  for (let i = 0; i < maxLength; i++) {
    update(element, prevChildren[i] || null, nextChildren[i] || null, i);
  }
}

function isSameType(
  prev: VNode | string | null,
  next: VNode | string | null
): boolean {
  if (typeof prev !== typeof next) return false;
  if (typeof prev === "object" && typeof next === "object") {
    return prev?.type === next?.type;
  }
  if (typeof prev === "string" && typeof next === "string") {
    return prev === next;
  }
  return true;
}

function getUpdateOperation(
  prev: VNode | string | null,
  next: VNode | string | null
): UpdateOperation {
  if (!prev && next) return "MOUNT";
  if (prev && !next) return "UNMOUNT";
  if (isSameType(prev, next)) return "UPDATE";
  return "REPLACE";
}

export function update(
  container: HTMLElement,
  prevVNode: VNode | string | null,
  nextVNode: VNode | string | null,
  index?: number
) {
  if (prevVNode === nextVNode) return;
  const operation = getUpdateOperation(prevVNode, nextVNode);

  switch (operation) {
    case "MOUNT":
      mount(nextVNode!, container);
      break;
    case "UNMOUNT":
      unmount(prevVNode!, container, index);
      break;
    case "UPDATE":
      if (typeof prevVNode === "object" && typeof nextVNode === "object") {
        updateElement(prevVNode, nextVNode);
      }
      break;
    case "REPLACE":
      replace(prevVNode!, nextVNode!, container, index);
      break;
  }
}
