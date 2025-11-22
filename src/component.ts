import type { VNode, Fiber } from "./types";

/**
 * Global reference to the currently rendering component's fiber.
 * This is set during component render and used by hooks to access the current component's state.
 * Must be null when no component is rendering.
 */
export let currentFiber: Fiber | null = null;

/**
 * Global counter tracking which hook is currently being called within a component.
 * Resets to 0 at the start of each component render.
 * Increments with each hook call to map hooks to their position in fiber.hooks array.
 */
export let hookIndex = 0;
export function incrementHookIndex() {
  hookIndex++;
}

/**
 * Renders a function component by setting up its fiber and calling the component function.
 *
 * This function:
 * 1. Creates or reuses a fiber to store component state (hooks)
 * 2. Sets global context (currentFiber, hookIndex) so hooks know which component they belong to
 * 3. Calls the component function to get the returned VNode
 * 4. Restores previous global context (for nested component calls)
 *
 * The fiber persists across re-renders, allowing hooks to maintain state.
 * The globals are temporarily set during render and restored after, enabling nested components
 * to each have their own context without interference.
 *
 * @param vnode - The VNode representing the function component to render
 * @returns The VNode, string, or null returned by the component function
 *
 * @example
 * const Counter = () => h("div", null, "Count: 0");
 * const vnode = h(Counter, null);
 * const result = renderComponent(vnode);
 * // result: { type: "div", props: null, children: ["Count: 0"] }
 * // vnode.fiber now contains the component's fiber for future renders
 */
export function renderComponent(
  vnode: VNode,
  container: HTMLElement
): VNode | string | null {
  const fiber: Fiber = vnode.fiber || {
    hooks: [],
    vnode,
    container: container || null,
  };

  vnode.fiber = fiber;
  fiber.vnode = vnode;

  const prevFiber = currentFiber;
  const prevHookIndex = hookIndex;

  currentFiber = fiber;
  hookIndex = 0;

  // e.g., const result = Counter(vnode.props);
  // Counter contains hooks which are each called in order, using currentFiber and hookIndex to track state
  const result = (vnode.type as Function)(vnode.props);

  fiber.renderedVNode = result;

  currentFiber = prevFiber;
  hookIndex = prevHookIndex;

  return result;
}
