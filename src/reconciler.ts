// TASK 3 + 4: diffing / reconciliation logic
// - compare prev and next VNodes
// - update DOM with minimal changes
// - keyed diffing for lists

import type { VNode } from "./types";
import { render } from "./render";

type UpdateOperation = "MOUNT" | "UNMOUNT" | "UPDATE" | "REPLACE";

function isSameType(
  prev: VNode | string | null,
  next: VNode | string | null
): boolean {
  if (typeof prev !== typeof next) return false;
  if (typeof prev === "object" && typeof next === "object") {
    return prev?.type === next?.type;
  }
  return true; // both strings or both null
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
  nextVNode: VNode | string | null
) {
  // TODO: implement diffing, prop patching, keyed children, etc.
  const operation = getUpdateOperation(prevVNode, nextVNode);

  switch (operation) {
    case "MOUNT":
      render(nextVNode, container);
      break;
    case "UNMOUNT":
      // Remove DOM node
      break;
    case "UPDATE":
      // Update props and children in place
      break;
    case "REPLACE":
      // Remove old, render new
      break;
  }
}
