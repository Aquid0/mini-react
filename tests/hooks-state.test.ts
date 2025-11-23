import { renderComponent } from "../src/component.js";
import { createElement as h } from "../src/createElement.js";
import { useState, useReducer } from "../src/hooks.js";
import { render } from "../src/render.js";

describe("useState", () => {
  test("initializes with value", () => {
    const Component = () => {
      const [count] = useState(5);
      return h("div", null, count);
    };
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
    expect(result.children[0]).toBe("null");
  });

  test("initializes with undefined", () => {
    const Component = () => {
      const [value] = useState(undefined);
      return h("div", null, String(value));
    };
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
    expect(result.children[0]).toBe("undefined");
  });

  test("initializes with object", () => {
    const Component = () => {
      const [obj] = useState({ x: 1, y: 2 });
      return h("div", null, `${obj.x},${obj.y}`);
    };
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
    expect(result.children[0]).toBe("1,2");
  });

  test("initializes with array", () => {
    const Component = () => {
      const [arr] = useState([1, 2, 3]);
      return h("div", null, arr.join(","));
    };
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
    renderComponent(vnode, container);
    dispatch({ x: 10 });
    const result: any = renderComponent(vnode, container);
    expect(result.children[0]).toBe("10,2");
  });

  test("reducer with action types", () => {
    const reducer = (state: number, action: any) => {
      switch (action.type) {
        case "increment": return state + 1;
        case "decrement": return state - 1;
        case "add": return state + action.value;
        default: return state;
      }
    };
    let dispatch: any;
    const Component = () => {
      const [count, _dispatch] = useReducer(reducer, 0);
      dispatch = _dispatch;
      return h("div", null, count);
    };
    const vnode = h(Component, null);
    const container = document.createElement('div');
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
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const result: any = renderComponent(vnode, document.createElement('div'));
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
    const container = document.createElement('div');
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
    const container = document.createElement('div');
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
    const result: any = renderComponent(h(Component, null), document.createElement('div'));
    expect(result.children[0]).toBe("10");
  });
});
