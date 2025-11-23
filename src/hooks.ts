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


// reducer(state, action): specifies how the state gets updated, should take the 'state' and 'action' as arguments, and should return the next state
// initialArg: the value from which the initial state is calculated
// init: If it's specified, the initial state is set to the result of of calling init(initialArg)

// returns: 
// state - current state of this state variable
// dispatch(action) - function that lets you update the state to a different value and trigger a re-render. You need to pass the action
// as the only argument to the dispatch function. Should set the next state to the result of calling the reducer that has been provided with the 
// current state and the action that has been passed into it. 
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
