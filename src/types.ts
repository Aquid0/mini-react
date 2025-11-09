/**
 * Virtual DOM Node - A lightweight JavaScript representation of a DOM element or component.
 * VNodes are created by createElement (h) and compared during reconciliation to efficiently update the real DOM.
 */
export type VNode = {
  /** Element tag name (e.g., "div", "button") or function component */
  type: string | Function;

  /** Element attributes and event handlers (e.g., { id: "app", onClick: fn }) */
  props: Record<string, any> | null;

  /** Child VNodes or text content */
  children: Array<VNode | string>;

  /** Optional unique identifier for efficient list reconciliation (keyed diffing) */
  key?: string | number | null;

  /** Reference to the actual DOM node this VNode represents. Set during render, used during updates. */
  dom?: Node | null;

  /** Reference to the component fiber if this VNode is a function component. Links VNode to its state/hooks. */
  fiber?: Fiber | null;
};

/**
 * Fiber - Component instance that persists across renders.
 * Stores component state (hooks), tracks what was rendered, and enables re-rendering when state changes.
 * This is the "memory" of a component between renders.
 */
export type Fiber = {
  /** The function component this fiber represents */
  type: Function;

  /** Array storing hook state (useState, useEffect, etc.) in order of hook calls */
  hooks: any[] | null;

  /** The component VNode this fiber belongs to (bidirectional link) */
  vnode?: VNode | null;

  /** Root container where this component was originally rendered. Needed for re-rendering on state changes. */
  container?: HTMLElement | null;

  /** What the component returned (the actual elements to render). Needed to diff old vs new output during updates. */
  renderedVNode?: VNode | string | null;
};

/**
 * Reconciliation operation types.
 * Determines how to update the DOM based on comparing previous and next VNodes.
 */
export type UpdateOperation =
  | "MOUNT" // Render new vnode (prev is null)
  | "UNMOUNT" // Remove vnode (next is null)
  | "UPDATE" // Patch existing vnode in place (same type)
  | "REPLACE"; // Remove old and mount new (different types)
