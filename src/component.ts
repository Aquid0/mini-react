import type { VNode, Fiber } from "./types";

// these variables will be mutated by hooks.ts during render pass
export let currentFiber: Fiber | null = null;
export let hookIndex = 0;

export function renderComponent(vnode: VNode): VNode | string | null {
  const fiber: Fiber = vnode.fiber || {
    type: vnode.type as Function,
    props: vnode.props,
    dom: null,
    alternate: null,
    hooks: [],
  };

  vnode.fiber = fiber;

  const prevFiber = currentFiber;
  const prevHookIndex = hookIndex;

  currentFiber = fiber;
  hookIndex = 0;

  const result = (vnode.type as Function)(vnode.props);

  currentFiber = prevFiber;
  hookIndex = prevHookIndex;

  return result;
}
