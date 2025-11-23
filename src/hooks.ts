// TASKS 6–10: implement hooks (useState, useReducer, useRef, useEffect, useMemo, useCallback)

import {
  currentFiber,
  hookIndex,
  incrementHookIndex,
  renderComponent,
} from "./component";

import { update } from "./reconciler";

/**
 * Returns a stateful value and a function to update it.
 * 
 * @param initial - The initial state value
 * @returns A tuple containing the current state and a setter function
 * 
 * @example
 * const [count, setCount] = useState(0);
 * setCount(1); // Set to new value
 * setCount(prev => prev + 1); // Update based on previous value
 */
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


/**
 * An alternative to useState for managing complex state logic.
 * 
 * @param reducer - Function that specifies how state gets updated: (state, action) => newState
 * @param initialArg - The initial state value, or argument passed to init function
 * @param init - Optional function to lazily calculate initial state: (initialArg) => initialState
 * @returns A tuple containing the current state and a dispatch function
 * 
 * @example
 * const reducer = (state, action) => {
 *   switch (action.type) {
 *     case 'increment': return state + 1;
 *     case 'decrement': return state - 1;
 *     default: return state;
 *   }
 * };
 * const [count, dispatch] = useReducer(reducer, 0);
 * dispatch({ type: 'increment' });
 */
export function useReducer(reducer: any, initialArg: any, init?: any) {
  const fiber = currentFiber;
  const index = hookIndex;
  incrementHookIndex();

  if (!fiber.hooks[index]) {
    fiber.hooks[index] = typeof init === 'function' ? { state : (init as Function)(initialArg)} : { state: initialArg };
  }

  const hook = fiber.hooks[index];
  
  const dispatch = (action: any) => {
    hook.state = reducer(hook.state, action);
    
    const container = fiber.container;
    if (container && fiber.vnode) {
      const oldRendered = fiber.renderedVNode;
      const newRendered = renderComponent(fiber.vnode, container);

      update(container, oldRendered, newRendered);
    }
  };

  return [hook.state, dispatch];
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
