// TASK 3 + 4: diffing / reconciliation logic
// - compare prev and next VNodes
// - update DOM with minimal changes
// - keyed diffing for lists

import type { VNode } from "./types";

export function update(
  container: HTMLElement,
  prevVNode: VNode | string | null,
  nextVNode: VNode | string | null
) {
  // TODO: implement diffing, prop patching, keyed children, etc.
}
