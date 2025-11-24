import { renderComponent } from "../src/component.js";
import { createElement as h } from "../src/createElement.js";
import {
  useState,
  useReducer,
  useRef,
  useCallback,
  useMemo,
} from "../src/hooks.js";
import { render } from "../src/render.js";

describe("useState", () => {
  test("initializes with value", () => {
    const Component = () => {
      const [count] = useState(5);
      return h("div", null, count);
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("5");
  });

  test("updates state with new value", () => {
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(0);
      setState = setCount;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(10);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("10");
  });

  test("updates state with function", () => {
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(0);
      setState = setCount;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState((prev: number) => prev + 5);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("5");
  });

  test("multiple useState hooks", () => {
    let setName: any, setAge: any;
    const Component = () => {
      const [name, _setName] = useState("Alice");
      const [age, _setAge] = useState(25);
      setName = _setName;
      setAge = _setAge;
      return h("div", null, `${name}-${age}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setName("Bob");
    let result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("Bob-25");
    setAge(30);
    result = renderComponent(vnode, container);
    expect(result.children[0]).toBe("Bob-30");
  });

  test("preserves state across renders", () => {
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(0);
      setState = setCount;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(42);
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("42");
  });

  test("initializes with null", () => {
    const Component = () => {
      const [value] = useState(null);
      return h("div", null, String(value));
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("null");
  });

  test("initializes with undefined", () => {
    const Component = () => {
      const [value] = useState(undefined);
      return h("div", null, String(value));
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("undefined");
  });

  test("initializes with object", () => {
    const Component = () => {
      const [obj] = useState({ x: 1, y: 2 });
      return h("div", null, `${obj.x},${obj.y}`);
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("1,2");
  });

  test("initializes with array", () => {
    const Component = () => {
      const [arr] = useState([1, 2, 3]);
      return h("div", null, arr.join(","));
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("1,2,3");
  });

  test("updates with false", () => {
    let setState: any;
    const Component = () => {
      const [value, setValue] = useState(true);
      setState = setValue;
      return h("div", null, String(value));
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(false);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("false");
  });

  test("updates with 0", () => {
    let setState: any;
    const Component = () => {
      const [value, setValue] = useState(100);
      setState = setValue;
      return h("div", null, value);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(0);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("0");
  });

  test("updates with empty string", () => {
    let setState: any;
    const Component = () => {
      const [value, setValue] = useState("hello");
      setState = setValue;
      return h("div", null, value || "empty");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState("");
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("empty");
  });

  test("function updater receives current state", () => {
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(10);
      setState = setCount;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState((prev: number) => prev * 2);
    renderComponent(vnode, container);
    setState((prev: number) => prev + 1);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("21");
  });
});

describe("useReducer", () => {
  test("initializes with value", () => {
    const reducer = (state: number, action: any) => state + action;
    const Component = () => {
      const [count] = useReducer(reducer, 10);
      return h("div", null, count);
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("10");
  });

  test("dispatches action", () => {
    const reducer = (state: number, action: any) => state + action;
    let dispatch: any;
    const Component = () => {
      const [count, _dispatch] = useReducer(reducer, 0);
      dispatch = _dispatch;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    dispatch(5);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("5");
  });

  test("multiple dispatches", () => {
    const reducer = (state: number, action: any) => state + action;
    let dispatch: any;
    const Component = () => {
      const [count, _dispatch] = useReducer(reducer, 0);
      dispatch = _dispatch;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    dispatch(3);
    renderComponent(vnode, container);
    dispatch(7);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("10");
  });

  test("reducer with object state", () => {
    const reducer = (state: any, action: any) => ({ ...state, ...action });
    let dispatch: any;
    const Component = () => {
      const [state, _dispatch] = useReducer(reducer, { x: 1, y: 2 });
      dispatch = _dispatch;
      return h("div", null, `${state.x},${state.y}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    dispatch({ x: 10 });
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("10,2");
  });

  test("reducer with action types", () => {
    const reducer = (state: number, action: any) => {
      switch (action.type) {
        case "increment":
          return state + 1;
        case "decrement":
          return state - 1;
        case "add":
          return state + action.value;
        default:
          return state;
      }
    };
    let dispatch: any;
    const Component = () => {
      const [count, _dispatch] = useReducer(reducer, 0);
      dispatch = _dispatch;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    dispatch({ type: "increment" });
    renderComponent(vnode, container);
    dispatch({ type: "add", value: 5 });
    renderComponent(vnode, container);
    dispatch({ type: "decrement" });
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("5");
  });

  test("initializes with init function", () => {
    const reducer = (state: number, action: any) => state + action;
    const init = (initial: number) => initial * 2;
    const Component = () => {
      const [count] = useReducer(reducer, 5, init);
      return h("div", null, count);
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("10");
  });

  test("init function only called once", () => {
    let initCalls = 0;
    const reducer = (state: number, action: any) => state + action;
    const init = (initial: number) => {
      initCalls++;
      return initial * 2;
    };
    const Component = () => {
      const [count] = useReducer(reducer, 5, init);
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    expect(initCalls).toBe(1);
  });

  test("multiple useReducer hooks", () => {
    const reducer1 = (state: number, action: any) => state + action;
    const reducer2 = (state: string, action: any) => state + action;
    let dispatch1: any, dispatch2: any;
    const Component = () => {
      const [count, _dispatch1] = useReducer(reducer1, 0);
      const [text, _dispatch2] = useReducer(reducer2, "a");
      dispatch1 = _dispatch1;
      dispatch2 = _dispatch2;
      return h("div", null, `${count}-${text}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    dispatch1(5);
    renderComponent(vnode, container);
    dispatch2("b");
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("5-ab");
  });

  test("reducer with null state", () => {
    const reducer = (state: any, action: any) => action;
    let dispatch: any;
    const Component = () => {
      const [value, _dispatch] = useReducer(reducer, null);
      dispatch = _dispatch;
      return h("div", null, String(value));
    };
    const vnode = h(Component, null);
    const result: any = renderComponent(vnode, document.createElement("div"));
    expect(result.children[0]).toBe("null");
  });

  test("reducer with array state", () => {
    const reducer = (state: any[], action: any) => [...state, action];
    let dispatch: any;
    const Component = () => {
      const [items, _dispatch] = useReducer(reducer, [1, 2]);
      dispatch = _dispatch;
      return h("div", null, items.join(","));
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    dispatch(3);
    renderComponent(vnode, container);
    dispatch(4);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("1,2,3,4");
  });

  test("reducer returns same state", () => {
    const reducer = (state: number) => state;
    let dispatch: any;
    const Component = () => {
      const [count, _dispatch] = useReducer(reducer, 42);
      dispatch = _dispatch;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    dispatch("anything");
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("42");
  });

  test("init function with complex calculation", () => {
    const reducer = (state: any, action: any) => ({ ...state, ...action });
    const init = (arg: any) => ({ computed: arg.x + arg.y, original: arg });
    const Component = () => {
      const [state] = useReducer(reducer, { x: 3, y: 7 }, init);
      return h("div", null, state.computed);
    };
    const result: any = renderComponent(
      h(Component, null),
      document.createElement("div")
    );
    expect(result.children[0]).toBe("10");
  });
});

describe("useRef", () => {
  test("initializes with value", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(42);
      return h("div", null, ref.current);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBe(42);
  });

  test("initializes with null", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(null);
      return h("div", null, String(ref.current));
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBeNull();
  });

  test("initializes with undefined", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(undefined);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBeUndefined();
  });

  test("initializes with object", () => {
    let ref: any;
    const Component = () => {
      ref = useRef({ x: 1, y: 2 });
      return h("div", null, `${ref.current.x},${ref.current.y}`);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toEqual({ x: 1, y: 2 });
  });

  test("initializes with array", () => {
    let ref: any;
    const Component = () => {
      ref = useRef([1, 2, 3]);
      return h("div", null, ref.current.join(","));
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toEqual([1, 2, 3]);
  });

  test("initializes with function", () => {
    let ref: any;
    const fn = () => "test";
    const Component = () => {
      ref = useRef(fn);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBe(fn);
    expect(ref.current()).toBe("test");
  });

  test("mutating current does not trigger re-render", () => {
    let renderCount = 0;
    let ref: any;
    const Component = () => {
      renderCount++;
      ref = useRef(0);
      return h("div", null, ref.current);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    const initialRenderCount = renderCount;
    ref.current = 100;
    expect(renderCount).toBe(initialRenderCount);
  });

  test("ref persists across renders", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(5);
      return h("div", null, ref.current);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    ref.current = 99;
    renderComponent(vnode, container);
    expect(ref.current).toBe(99);
  });

  test("multiple renders preserve mutated ref value", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(10);
      return h("div", null, ref.current);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    ref.current = 20;
    renderComponent(vnode, container);
    ref.current = 30;
    renderComponent(vnode, container);
    ref.current = 40;
    renderComponent(vnode, container);
    expect(ref.current).toBe(40);
  });

  test("ref identity is preserved across renders", () => {
    let ref1: any;
    let ref2: any;
    const Component = () => {
      const r = useRef("test");
      if (!ref1) ref1 = r;
      else ref2 = r;
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    expect(ref1).toBe(ref2);
  });

  test("multiple useRef hooks", () => {
    let ref1: any, ref2: any;
    const Component = () => {
      ref1 = useRef(100);
      ref2 = useRef("hello");
      return h("div", null, `${ref1.current}-${ref2.current}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    ref1.current = 200;
    ref2.current = "world";
    renderComponent(vnode, container);
    expect(ref1.current).toBe(200);
    expect(ref2.current).toBe("world");
  });

  test("useRef with useState - ref persists through state updates", () => {
    let ref: any;
    let setState: any;
    const Component = () => {
      ref = useRef(0);
      const [count, setCount] = useState(0);
      setState = setCount;
      ref.current++;
      return h("div", null, `${count}-${ref.current}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(1);
    renderComponent(vnode, container);
    setState(2);
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("2-5");
  });

  test("ref stores DOM element reference", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(null);
      const element = h("div", null, "content");
      ref.current = element;
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBeTruthy();
    expect(ref.current.type).toBe("div");
  });

  test("ref with nested object mutation", () => {
    let ref: any;
    const Component = () => {
      ref = useRef({ count: 0, nested: { value: 10 } });
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    ref.current.count = 5;
    ref.current.nested.value = 20;
    renderComponent(vnode, container);
    expect(ref.current.count).toBe(5);
    expect(ref.current.nested.value).toBe(20);
  });

  test("ref initialized with 0", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(0);
      return h("div", null, ref.current);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBe(0);
  });

  test("ref initialized with false", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(false);
      return h("div", null, String(ref.current));
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBe(false);
  });

  test("ref initialized with empty string", () => {
    let ref: any;
    const Component = () => {
      ref = useRef("");
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBe("");
  });

  test("ref mutated to different types", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(42);
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    ref.current = "string";
    renderComponent(vnode, container);
    ref.current = { obj: true };
    renderComponent(vnode, container);
    ref.current = [1, 2, 3];
    renderComponent(vnode, container);
    expect(ref.current).toEqual([1, 2, 3]);
  });

  test("ref does not reinitialize with new initial value", () => {
    let ref: any;
    let initialValue = 1;
    const Component = () => {
      ref = useRef(initialValue);
      return h("div", null, ref.current);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(ref.current).toBe(1);
    initialValue = 999;
    renderComponent(vnode, container);
    expect(ref.current).toBe(1);
  });

  test("ref can be set to null after initialization", () => {
    let ref: any;
    const Component = () => {
      ref = useRef({ value: 42 });
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    ref.current = null;
    renderComponent(vnode, container);
    expect(ref.current).toBeNull();
  });

  test("ref with closure capturing ref.current", () => {
    let ref: any;
    let capturedValue: any;
    const Component = () => {
      ref = useRef(5);
      capturedValue = ref.current;
      ref.current = 10;
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    expect(ref.current).toBe(10);
    expect(capturedValue).toBe(10);
  });

  test("multiple refs with different initial values", () => {
    let ref1: any, ref2: any, ref3: any;
    const Component = () => {
      ref1 = useRef(1);
      ref2 = useRef(2);
      ref3 = useRef(3);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref1.current).toBe(1);
    expect(ref2.current).toBe(2);
    expect(ref3.current).toBe(3);
  });

  test("ref with initial value that is a complex object", () => {
    let ref: any;
    const complexObject = {
      a: [1, 2, 3],
      b: { nested: { deep: "value" } },
      c: () => "function",
      d: null,
      e: undefined,
    };
    const Component = () => {
      ref = useRef(complexObject);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(ref.current).toBe(complexObject);
    expect(ref.current.a).toEqual([1, 2, 3]);
    expect(ref.current.b.nested.deep).toBe("value");
    expect(ref.current.c()).toBe("function");
  });

  test("ref.current can store incrementing counter", () => {
    let ref: any;
    const Component = () => {
      ref = useRef(0);
      ref.current += 1;
      return h("div", null, ref.current);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    expect(ref.current).toBe(3);
  });
});

describe("useCallback", () => {
  test("returns a function", () => {
    let callback: any;
    const Component = () => {
      callback = useCallback(() => "test", []);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(typeof callback).toBe("function");
    expect(callback()).toBe("test");
  });

  test("preserves function identity with same deps", () => {
    let callback1: any, callback2: any;
    const Component = () => {
      const cb = useCallback(() => "test", []);
      if (!callback1) callback1 = cb;
      else callback2 = cb;
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    expect(callback1).toBe(callback2);
  });

  test("returns new function when deps change", () => {
    let callback1: any, callback2: any;
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(0);
      setState = setCount;
      const cb = useCallback(() => count, [count]);
      if (count === 0) callback1 = cb;
      if (count === 1) callback2 = cb;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(1);
    renderComponent(vnode, container);
    expect(callback1).not.toBe(callback2);
  });

  test("callback can access captured values", () => {
    let callback: any;
    const Component = () => {
      const [count] = useState(42);
      callback = useCallback(() => count * 2, [count]);
      return h("div", null, count);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(callback()).toBe(84);
  });

  test("multiple callbacks with different deps", () => {
    let cb1: any, cb2: any;
    let setState1: any, setState2: any;
    const Component = () => {
      const [a, setA] = useState(1);
      const [b, setB] = useState(2);
      setState1 = setA;
      setState2 = setB;
      cb1 = useCallback(() => a, [a]);
      cb2 = useCallback(() => b, [b]);
      return h("div", null, `${a}-${b}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    const initialCb1 = cb1;
    const initialCb2 = cb2;
    setState1(10);
    renderComponent(vnode, container);
    expect(cb1).not.toBe(initialCb1);
    expect(cb2).toBe(initialCb2);
  });

  test("empty deps array always returns same function", () => {
    let callbacks: any[] = [];
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(0);
      setState = setCount;
      const cb = useCallback(() => "constant", []);
      callbacks.push(cb);
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(1);
    renderComponent(vnode, container);
    setState(2);
    renderComponent(vnode, container);
    expect(callbacks[0]).toBe(callbacks[1]);
    expect(callbacks[1]).toBe(callbacks[2]);
  });

  test("deps with primitive values", () => {
    let callback1: any, callback2: any, callback3: any;
    let setState: any;
    const Component = () => {
      const [val, setVal] = useState(5);
      setState = setVal;
      const cb = useCallback(() => val, [val]);
      if (val === 5) callback1 = cb;
      if (val === 5 && callback1 && callback1 !== cb) callback2 = cb;
      if (val === 10) callback3 = cb;
      return h("div", null, val);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    expect(callback1).toBe(callback1);
    setState(10);
    renderComponent(vnode, container);
    expect(callback3).not.toBe(callback1);
  });

  test("callback with multiple dependencies", () => {
    let callback1: any, callback2: any;
    let setState1: any, setState2: any;
    const Component = () => {
      const [a, setA] = useState(1);
      const [b, setB] = useState(2);
      setState1 = setA;
      setState2 = setB;
      const cb = useCallback(() => a + b, [a, b]);
      if (!callback1) callback1 = cb;
      else callback2 = cb;
      return h("div", null, `${a}-${b}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState1(10);
    renderComponent(vnode, container);
    expect(callback1).not.toBe(callback2);
    expect(callback2()).toBe(12);
  });

  test("callback with function parameter", () => {
    let callback: any;
    const Component = () => {
      callback = useCallback((x: number) => x * 2, []);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(callback(5)).toBe(10);
    expect(callback(21)).toBe(42);
  });

  test("callback with multiple parameters", () => {
    let callback: any;
    const Component = () => {
      const [multiplier] = useState(3);
      callback = useCallback(
        (a: number, b: number) => (a + b) * multiplier,
        [multiplier]
      );
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(callback(2, 3)).toBe(15);
  });

  test("deps with falsy values", () => {
    let callback1: any, callback2: any, callback3: any;
    let setState: any;
    const Component = () => {
      const [val, setVal] = useState(0);
      setState = setVal;
      const cb = useCallback(() => val, [val]);
      if (val === 0 && !callback1) callback1 = cb;
      if (val === false) callback2 = cb;
      if (val === "") callback3 = cb;
      return h("div", null, String(val));
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(false);
    renderComponent(vnode, container);
    expect(callback2).not.toBe(callback1);
    setState("");
    renderComponent(vnode, container);
    expect(callback3).not.toBe(callback2);
  });

  test("deps with null", () => {
    let callback: any;
    const Component = () => {
      const [val] = useState(null);
      callback = useCallback(() => val, [val]);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(callback()).toBeNull();
  });

  test("deps with undefined", () => {
    let callback: any;
    const Component = () => {
      const [val] = useState(undefined);
      callback = useCallback(() => val, [val]);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(callback()).toBeUndefined();
  });

  test("callback identity preserved across many renders with same deps", () => {
    let callbacks: any[] = [];
    let forceRender: any;
    const Component = () => {
      const [, setDummy] = useState(0);
      forceRender = () => setDummy((x: number) => x + 1);
      const cb = useCallback(() => "test", []);
      callbacks.push(cb);
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    expect(callbacks[0]).toBe(callbacks[1]);
    expect(callbacks[1]).toBe(callbacks[2]);
    expect(callbacks[2]).toBe(callbacks[3]);
  });

  test("callback with object dependency", () => {
    let callback1: any, callback2: any;
    let setState: any;
    const Component = () => {
      const [obj, setObj] = useState({ x: 1 });
      setState = setObj;
      const cb = useCallback(() => obj.x, [obj]);
      if (obj.x === 1) callback1 = cb;
      if (obj.x === 2) callback2 = cb;
      return h("div", null, obj.x);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState({ x: 2 });
    renderComponent(vnode, container);
    expect(callback1).not.toBe(callback2);
    expect(callback2()).toBe(2);
  });

  test("callback with array dependency", () => {
    let callback1: any, callback2: any;
    let setState: any;
    const Component = () => {
      const [arr, setArr] = useState([1, 2, 3]);
      setState = setArr;
      const cb = useCallback(() => arr.length, [arr]);
      if (arr.length === 3) callback1 = cb;
      if (arr.length === 4) callback2 = cb;
      return h("div", null, arr.length);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState([1, 2, 3, 4]);
    renderComponent(vnode, container);
    expect(callback1).not.toBe(callback2);
  });

  test("callback that returns different values based on deps", () => {
    let callback: any;
    let setState: any;
    const Component = () => {
      const [mode, setMode] = useState("add");
      setState = setMode;
      callback = useCallback(
        (a: number, b: number) => {
          if (mode === "add") return a + b;
          if (mode === "multiply") return a * b;
          return 0;
        },
        [mode]
      );
      return h("div", null, mode);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(callback(2, 3)).toBe(5);
    setState("multiply");
    renderComponent(vnode, container);
    expect(callback(2, 3)).toBe(6);
  });

  test("nested callbacks", () => {
    let outerCb: any, innerCb: any;
    const Component = () => {
      outerCb = useCallback(() => {
        return () => "nested";
      }, []);
      innerCb = outerCb();
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(innerCb()).toBe("nested");
  });

  test("callback with no parameters that accesses deps", () => {
    let callback: any;
    let setState: any;
    const Component = () => {
      const [prefix, setPrefix] = useState("Hello");
      const [name] = useState("World");
      setState = setPrefix;
      callback = useCallback(() => `${prefix} ${name}`, [prefix, name]);
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(callback()).toBe("Hello World");
    setState("Hi");
    renderComponent(vnode, container);
    expect(callback()).toBe("Hi World");
  });

  test("callback identity changes only when specified dep changes", () => {
    let callbacks: { a: any[]; b: any[] } = { a: [], b: [] };
    let setA: any, setB: any;
    const Component = () => {
      const [a, _setA] = useState(1);
      const [b, _setB] = useState(2);
      setA = _setA;
      setB = _setB;
      const cbA = useCallback(() => a, [a]);
      const cbB = useCallback(() => b, [b]);
      callbacks.a.push(cbA);
      callbacks.b.push(cbB);
      return h("div", null, `${a}-${b}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setB(20);
    renderComponent(vnode, container);
    expect(callbacks.a[0]).toBe(callbacks.a[1]);
    expect(callbacks.b[0]).not.toBe(callbacks.b[1]);
  });

  test("callback with complex closure", () => {
    let callback: any;
    const Component = () => {
      const [counter] = useState(0);
      const multiplier = 5;
      const offset = 10;
      callback = useCallback(
        (x: number) => x * multiplier + offset + counter,
        [counter]
      );
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(callback(3)).toBe(25);
  });

  test("callback can be called multiple times with same result", () => {
    let callback: any;
    const Component = () => {
      const [value] = useState(7);
      callback = useCallback(() => value * 3, [value]);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(callback()).toBe(21);
    expect(callback()).toBe(21);
    expect(callback()).toBe(21);
  });

  test("callback with arrow function vs regular function", () => {
    let arrowCb: any, regularCb: any;
    const Component = () => {
      arrowCb = useCallback(() => "arrow", []);
      regularCb = useCallback(function () {
        return "regular";
      }, []);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(arrowCb()).toBe("arrow");
    expect(regularCb()).toBe("regular");
  });
});

describe("useMemo", () => {
  test("computes and returns value", () => {
    let memoizedValue: any;
    const Component = () => {
      memoizedValue = useMemo(() => 42, []);
      return h("div", null, memoizedValue);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(memoizedValue).toBe(42);
  });

  test("only computes once with empty deps", () => {
    let computeCount = 0;
    let value: any;
    const Component = () => {
      value = useMemo(() => {
        computeCount++;
        return computeCount;
      }, []);
      return h("div", null, value);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    renderComponent(vnode, container);
    expect(value).toBe(1);
    expect(computeCount).toBe(1);
  });

  test("recomputes when deps change", () => {
    let computeCount = 0;
    let value: any;
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(0);
      setState = setCount;
      value = useMemo(() => {
        computeCount++;
        return count * 2;
      }, [count]);
      return h("div", null, value);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(value).toBe(0);
    expect(computeCount).toBe(1);
    setState(5);
    renderComponent(vnode, container);
    expect(value).toBe(10);
    expect(computeCount).toBe(2);
  });

  test("does not recompute when deps stay same", () => {
    let computeCount = 0;
    let forceRender: any;
    const Component = () => {
      const [, setDummy] = useState(0);
      forceRender = () => setDummy((x: number) => x + 1);
      const value = useMemo(() => {
        computeCount++;
        return "constant";
      }, []);
      return h("div", null, value);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
  });

  test("computes expensive calculation", () => {
    let value: any;
    const Component = () => {
      const [multiplier] = useState(7);
      value = useMemo(() => {
        let result = 0;
        for (let i = 0; i < 100; i++) {
          result += i * multiplier;
        }
        return result;
      }, [multiplier]);
      return h("div", null, value);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(value).toBe(34650);
  });

  test("multiple useMemo hooks", () => {
    let value1: any, value2: any;
    let setA: any, setB: any;
    const Component = () => {
      const [a, _setA] = useState(2);
      const [b, _setB] = useState(3);
      setA = _setA;
      setB = _setB;
      value1 = useMemo(() => a * 2, [a]);
      value2 = useMemo(() => b * 3, [b]);
      return h("div", null, `${value1}-${value2}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(value1).toBe(4);
    expect(value2).toBe(9);
    setA(5);
    renderComponent(vnode, container);
    expect(value1).toBe(10);
    expect(value2).toBe(9);
  });

  test("useMemo with multiple dependencies", () => {
    let value: any;
    let setState: any;
    const Component = () => {
      const [x, setX] = useState(2);
      const [y] = useState(3);
      setState = setX;
      value = useMemo(() => x + y, [x, y]);
      return h("div", null, value);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(value).toBe(5);
    setState(10);
    renderComponent(vnode, container);
    expect(value).toBe(13);
  });

  test("returns object", () => {
    let value: any;
    const Component = () => {
      value = useMemo(() => ({ x: 1, y: 2 }), []);
      return h("div", null, `${value.x},${value.y}`);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(value).toEqual({ x: 1, y: 2 });
  });

  test("returns array", () => {
    let value: any;
    const Component = () => {
      value = useMemo(() => [1, 2, 3], []);
      return h("div", null, value.join(","));
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(value).toEqual([1, 2, 3]);
  });

  test("object reference stays same when deps don't change", () => {
    let values: any[] = [];
    let forceRender: any;
    const Component = () => {
      const [, setDummy] = useState(0);
      forceRender = () => setDummy((x: number) => x + 1);
      const obj = useMemo(() => ({ name: "test" }), []);
      values.push(obj);
      return h("div", null, "rendered");
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    expect(values[0]).toBe(values[1]);
    expect(values[1]).toBe(values[2]);
  });

  test("object reference changes when deps change", () => {
    let obj1: any, obj2: any;
    let setState: any;
    const Component = () => {
      const [count, setCount] = useState(0);
      setState = setCount;
      const obj = useMemo(() => ({ count }), [count]);
      if (count === 0) obj1 = obj;
      if (count === 1) obj2 = obj;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(1);
    renderComponent(vnode, container);
    expect(obj1).not.toBe(obj2);
    expect(obj1.count).toBe(0);
    expect(obj2.count).toBe(1);
  });

  test("deps with primitive values", () => {
    let computeCount = 0;
    let setState: any;
    const Component = () => {
      const [num, setNum] = useState(5);
      setState = setNum;
      useMemo(() => {
        computeCount++;
        return num;
      }, [num]);
      return h("div", null, num);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    setState(5);
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
    setState(10);
    renderComponent(vnode, container);
    expect(computeCount).toBe(2);
  });

  test("deps with falsy values", () => {
    let computeCount = 0;
    let setState: any;
    const Component = () => {
      const [val, setVal] = useState(0);
      setState = setVal;
      useMemo(() => {
        computeCount++;
        return val;
      }, [val]);
      return h("div", null, String(val));
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
    setState(false);
    renderComponent(vnode, container);
    expect(computeCount).toBe(2);
    setState("");
    renderComponent(vnode, container);
    expect(computeCount).toBe(3);
  });

  test("deps with null", () => {
    let value: any;
    const Component = () => {
      const [dep] = useState(null);
      value = useMemo(() => dep, [dep]);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(value).toBeNull();
  });

  test("deps with undefined", () => {
    let value: any;
    const Component = () => {
      const [dep] = useState(undefined);
      value = useMemo(() => dep, [dep]);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(value).toBeUndefined();
  });

  test("factory function receives no arguments", () => {
    let receivedArgs: any[] = [];
    const Component = () => {
      useMemo((...args: any[]) => {
        receivedArgs = args;
        return "test";
      }, []);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(receivedArgs.length).toBe(0);
  });

  test("recomputes only when specific dep changes in multi-dep array", () => {
    let computeCount = 0;
    let setA: any, setB: any;
    const Component = () => {
      const [a, _setA] = useState(1);
      const [b, _setB] = useState(2);
      setA = _setA;
      setB = _setB;
      useMemo(() => {
        computeCount++;
        return a + b;
      }, [a, b]);
      return h("div", null, `${a}-${b}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
    setA(1);
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
    setB(5);
    renderComponent(vnode, container);
    expect(computeCount).toBe(2);
  });

  test("can memoize string concatenation", () => {
    let value: any;
    let setState: any;
    const Component = () => {
      const [first, setFirst] = useState("Hello");
      const [last] = useState("World");
      setState = setFirst;
      value = useMemo(() => `${first} ${last}`, [first, last]);
      return h("div", null, value);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(value).toBe("Hello World");
    setState("Hi");
    renderComponent(vnode, container);
    expect(value).toBe("Hi World");
  });

  test("can memoize array operations", () => {
    let value: any;
    let setState: any;
    const Component = () => {
      const [items, setItems] = useState([1, 2, 3]);
      setState = setItems;
      value = useMemo(() => items.map((x) => x * 2), [items]);
      return h("div", null, value.join(","));
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(value).toEqual([2, 4, 6]);
    setState([5, 6, 7]);
    renderComponent(vnode, container);
    expect(value).toEqual([10, 12, 14]);
  });

  test("can memoize filtered list", () => {
    let value: any;
    let setState: any;
    const Component = () => {
      const [threshold, setThreshold] = useState(5);
      setState = setThreshold;
      const numbers = [1, 3, 5, 7, 9];
      value = useMemo(() => numbers.filter((n) => n > threshold), [threshold]);
      return h("div", null, value.join(","));
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(value).toEqual([7, 9]);
    setState(6);
    renderComponent(vnode, container);
    expect(value).toEqual([7, 9]);
    setState(7);
    renderComponent(vnode, container);
    expect(value).toEqual([9]);
  });

  test("returns function from factory", () => {
    let value: any;
    const Component = () => {
      value = useMemo(() => (x: number) => x * 2, []);
      return h("div", null, "rendered");
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(typeof value).toBe("function");
    expect(value(5)).toBe(10);
  });

  test("complex nested computation", () => {
    let value: any;
    const Component = () => {
      const [data] = useState({ a: [1, 2, 3], b: { x: 10, y: 20 } });
      value = useMemo(() => {
        const sum = data.a.reduce((acc, val) => acc + val, 0);
        const product = data.b.x * data.b.y;
        return { sum, product, total: sum + product };
      }, [data]);
      return h("div", null, value.total);
    };
    renderComponent(h(Component, null), document.createElement("div"));
    expect(value).toEqual({ sum: 6, product: 200, total: 206 });
  });

  test("memoized value used in multiple places", () => {
    let computeCount = 0;
    let forceRender: any;
    const Component = () => {
      const [, setDummy] = useState(0);
      forceRender = () => setDummy((x: number) => x + 1);
      const expensive = useMemo(() => {
        computeCount++;
        return { value: 42 };
      }, []);
      return h("div", null, `${expensive.value}-${expensive.value}`);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    forceRender();
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
  });

  test("deps with object that changes", () => {
    let computeCount = 0;
    let setState: any;
    const Component = () => {
      const [obj, setObj] = useState({ id: 1 });
      setState = setObj;
      useMemo(() => {
        computeCount++;
        return obj.id;
      }, [obj]);
      return h("div", null, obj.id);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
    setState({ id: 1 });
    renderComponent(vnode, container);
    expect(computeCount).toBe(2);
  });

  test("deps with array that changes", () => {
    let computeCount = 0;
    let setState: any;
    const Component = () => {
      const [arr, setArr] = useState([1, 2, 3]);
      setState = setArr;
      useMemo(() => {
        computeCount++;
        return arr.length;
      }, [arr]);
      return h("div", null, arr.length);
    };
    const vnode = h(Component, null);
    const container = document.createElement("div");
    renderComponent(vnode, container);
    expect(computeCount).toBe(1);
    setState([1, 2, 3]);
    renderComponent(vnode, container);
    expect(computeCount).toBe(2);
  });
});
