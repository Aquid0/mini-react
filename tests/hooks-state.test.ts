import { renderComponent } from "../src/component.js";
import { createElement as h } from "../src/createElement.js";
import { useState, useReducer, useRef } from "../src/hooks.js";
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
