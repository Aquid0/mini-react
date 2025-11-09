import type { VNode, UpdateOperation } from "./types";
import { render } from "./render";

/**
 * Mounts a new vnode by rendering it into the container.
 */
function mount(vnode: VNode | string, container: HTMLElement) {
  render(vnode, container);
}

/**
 * Updates an existing element by diffing and patching props and children.
 */
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

/**
 * Replaces a vnode by unmounting the old one and mounting the new one.
 */
function replace(
  prevVNode: VNode | string,
  nextVNode: VNode | string,
  container: HTMLElement,
  index?: number
) {
  unmount(prevVNode, container, index);
  mount(nextVNode, container);
}

/**
 * Unmounts a vnode by removing its DOM node from the container.
 * Uses the vnode's stored dom reference or falls back to index-based removal.
 */
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

/**
 * Diffs and patches element props/attributes.
 * Removes old props that are no longer present and adds/updates new props.
 * Handles cases: event listeners (onClick) and className.
 */
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

/**
 * Recursively reconciles children by comparing prev and next child arrays.
 * Uses index-based diffing (not keyed diffing - TODO for optimization).
 */
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

/**
 * Checks if two vnodes are the same type and can be updated in place.
 * For objects, compares the type property (e.g., "div" vs "span").
 * For strings, compares the text content.
 */
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

/**
 * Determines what operation to perform based on prev and next vnodes.
 * Returns one of: MOUNT, UNMOUNT, UPDATE, or REPLACE.
 */
function getUpdateOperation(
  prev: VNode | string | null,
  next: VNode | string | null
): UpdateOperation {
  if (!prev && next) return "MOUNT";
  if (prev && !next) return "UNMOUNT";
  if (isSameType(prev, next)) return "UPDATE";
  return "REPLACE";
}

/**
 * Reconciles (diffs and patches) the DOM by comparing previous and next vnodes.
 * This is the main entry point for updates after the initial render.
 *
 * Operations:
 * - MOUNT: Render new vnode (prev is null)
 * - UNMOUNT: Remove vnode (next is null)
 * - UPDATE: Patch existing vnode in place (same type)
 * - REPLACE: Remove old and mount new (different types)
 *
 * @param container - The parent DOM element
 * @param prevVNode - The previous virtual node (or null for initial mount)
 * @param nextVNode - The next virtual node (or null for unmount)
 * @param index - Optional child index for text node removal
 *
 * @example
 * // Initial render
 * update(root, null, createElement("div", null, "Hello"))
 *
 * // Update after state change
 * update(root, oldVNode, newVNode)
 */
export function update(
  container: HTMLElement,
  prevVNode: VNode | string | null,
  nextVNode: VNode | string | null,
  index?: number
) {
  if (prevVNode === nextVNode) return;

  // Copy DOM reference from prev to next VNode to maintain continuity across updates
  if (
    prevVNode &&
    nextVNode &&
    typeof prevVNode === "object" &&
    typeof nextVNode === "object" &&
    prevVNode.dom
  ) {
    nextVNode.dom = prevVNode.dom;
  }

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
