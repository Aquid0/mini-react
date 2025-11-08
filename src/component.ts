// TASK 5: function components + basic fiber instance tracking

import type { VNode, Fiber } from "./types";

// these variables will be mutated by hooks.ts during render pass
export let currentFiber: Fiber | null = null;
export let hookIndex = 0;

export function renderComponent(vnode: VNode): VNode | string | null {
  // TODO: call component function, store hooks array, return child VNode
  return null;
}
