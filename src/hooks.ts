// TASKS 6–10: implement hooks (useState, useReducer, useRef, useEffect, useMemo, useCallback)

import {
  currentFiber,
  hookIndex,
  incrementHookIndex,
  renderComponent,
} from "./component";

import { update } from "./reconciler";

export function useState(initial: any) {
  const fiber = currentFiber;
  const index = hookIndex;
  incrementHookIndex();

  if (!fiber.hooks[index]) {
    fiber.hooks[index] = { state: initial };
  }

  const hook = fiber.hooks[index];

  const setState = (newState: any) => {
    hook.state =
      typeof newState === "function" ? newState(hook.state) : newState;

    const container = fiber.container;
    if (container && fiber.vnode) {
      const oldRendered = fiber.renderedVNode;
      const newRendered = renderComponent(fiber.vnode, container);

      update(container, oldRendered, newRendered);
    }
  };

  return [hook.state, setState];
}

export function useReducer(reducer: any, initialArg: any, init?: any) {
  // TODO
}

export function useRef(initial: any) {
  // TODO
}

export function useEffect(create: any, deps?: any[]) {
  // TODO
}

export function useMemo(factory: any, deps: any[]) {
  // TODO
}

export function useCallback(fn: any, deps: any[]) {
  // TODO
}
