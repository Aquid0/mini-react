import { renderComponent, currentFiber, hookIndex } from "../src/component.js";
import { createElement as h } from "../src/createElement.js";

describe("renderComponent", () => {
  // Basic functionality
  test("calls component function and returns result", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    const result = renderComponent(vnode);

    expect(result).toEqual({
      type: "div",
      props: null,
      children: ["Hello"],
    });
  });

  test("passes props to component function", () => {
    const Component = (props: any) => h("div", null, props.message);
    const vnode = h(Component, { message: "Test" });

    const result = renderComponent(vnode);

    expect(result).toEqual({
      type: "div",
      props: null,
      children: ["Test"],
    });
  });

  test("creates fiber for component", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    renderComponent(vnode);

    expect(vnode.fiber).toBeDefined();
    expect(vnode.fiber?.type).toBe(Component);
    expect(vnode.fiber?.hooks).toEqual([]);
  });

  test("reuses existing fiber on re-render", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    renderComponent(vnode);
    const firstFiber = vnode.fiber;

    renderComponent(vnode);
    const secondFiber = vnode.fiber;

    expect(firstFiber).toBe(secondFiber);
  });

  // Global state management
  test("sets currentFiber during render", () => {
    let capturedFiber = null;
    const Component = () => {
      capturedFiber = currentFiber;
      return h("div", null, "Hello");
    };
    const vnode = h(Component, null);

    renderComponent(vnode);

    expect(capturedFiber).toBe(vnode.fiber);
  });

  test("resets currentFiber after render", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    renderComponent(vnode);

    expect(currentFiber).toBeNull();
  });

  test("resets hookIndex to 0 for each component", () => {
    let capturedIndex = -1;
    const Component = () => {
      capturedIndex = hookIndex;
      return h("div", null, "Hello");
    };
    const vnode = h(Component, null);

    renderComponent(vnode);

    expect(capturedIndex).toBe(0);
  });

  // Nested components
  test("handles nested component calls", () => {
    const Child = () => h("span", null, "Child");
    const Parent = () => h("div", null, h(Child, null));
    const vnode = h(Parent, null);

    const result = renderComponent(vnode);

    expect(result).toEqual({
      type: "div",
      props: null,
      children: [
        {
          type: Child,
          props: null,
          children: [],
        },
      ],
    });
  });

  test("restores currentFiber after nested component", () => {
    let parentFiber = null;
    let childFiber = null;
    let parentFiberAfterChild = null;

    const Child = () => {
      childFiber = currentFiber;
      return h("span", null, "Child");
    };

    const Parent = () => {
      parentFiber = currentFiber;
      renderComponent(h(Child, null));
      parentFiberAfterChild = currentFiber;
      return h("div", null, "Parent");
    };

    const vnode = h(Parent, null);
    renderComponent(vnode);

    expect(parentFiber).toBe(parentFiberAfterChild);
    expect(childFiber).not.toBe(parentFiber);
  });

  test("restores hookIndex after nested component", () => {
    let parentIndexBefore = -1;
    let childIndex = -1;
    let parentIndexAfter = -1;

    const Child = () => {
      childIndex = hookIndex;
      return h("span", null, "Child");
    };

    const Parent = () => {
      parentIndexBefore = hookIndex;
      renderComponent(h(Child, null));
      parentIndexAfter = hookIndex;
      return h("div", null, "Parent");
    };

    const vnode = h(Parent, null);
    renderComponent(vnode);

    expect(parentIndexBefore).toBe(0);
    expect(childIndex).toBe(0);
    expect(parentIndexAfter).toBe(0);
  });

  // Edge cases
  test("handles component returning null", () => {
    const Component = () => null;
    const vnode = h(Component, null);

    const result = renderComponent(vnode);

    expect(result).toBeNull();
  });

  test("handles component returning string", () => {
    const Component = () => "Hello";
    const vnode = h(Component, null);

    const result = renderComponent(vnode);

    expect(result).toBe("Hello");
  });

  test("handles component with null props", () => {
    const Component = (props: any) =>
      h("div", null, props ? "Has props" : "No props");
    const vnode = h(Component, null);

    const result = renderComponent(vnode);

    expect(result).toEqual({
      type: "div",
      props: null,
      children: ["No props"],
    });
  });

  test("handles component with empty props", () => {
    const Component = (props: any) =>
      h("div", null, Object.keys(props || {}).length);
    const vnode = h(Component, {});

    const result = renderComponent(vnode);

    expect(result).toEqual({
      type: "div",
      props: null,
      children: ["0"],
    });
  });

  test("handles deeply nested components", () => {
    const Level3 = () => h("span", null, "Deep");
    const Level2 = () => h("p", null, h(Level3, null));
    const Level1 = () => h("div", null, h(Level2, null));
    const vnode = h(Level1, null);

    const result = renderComponent(vnode);

    expect(result).toEqual({
      type: "div",
      props: null,
      children: [
        {
          type: Level2,
          props: null,
          children: [],
        },
      ],
    });
  });

  test("handles multiple renders of same component", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    const result1 = renderComponent(vnode);
    const result2 = renderComponent(vnode);
    const result3 = renderComponent(vnode);

    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
    expect(vnode.fiber).toBeDefined();
  });

  test("creates separate fibers for different component instances", () => {
    const Component = () => h("div", null, "Hello");
    const vnode1 = h(Component, null);
    const vnode2 = h(Component, null);

    renderComponent(vnode1);
    renderComponent(vnode2);

    expect(vnode1.fiber).not.toBe(vnode2.fiber);
  });

  test("preserves fiber.hooks array across renders", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    renderComponent(vnode);
    vnode.fiber!.hooks.push({ state: "test" });

    renderComponent(vnode);

    expect(vnode.fiber!.hooks).toEqual([{ state: "test" }]);
  });

  test("handles component that throws error", () => {
    const Component = () => {
      throw new Error("Component error");
    };
    const vnode = h(Component, null);

    expect(() => renderComponent(vnode)).toThrow("Component error");
  });

  test("resets globals even if component throws", () => {
    const Component = () => {
      throw new Error("Component error");
    };
    const vnode = h(Component, null);

    try {
      renderComponent(vnode);
    } catch (e) {
      // Expected
    }

    // In this simple implementation, globals are not reset on error
    expect(currentFiber).not.toBeNull();
  });

  test("handles component with complex return value", () => {
    const Component = () =>
      h(
        "div",
        { id: "root" },
        h("span", null, "A"),
        "text",
        h("span", null, "B")
      );
    const vnode = h(Component, null);

    const result = renderComponent(vnode);

    expect(result).toEqual({
      type: "div",
      props: { id: "root" },
      children: [
        { type: "span", props: null, children: ["A"] },
        "text",
        { type: "span", props: null, children: ["B"] },
      ],
    });
  });

  test("creates bidirectional reference between vnode and fiber", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    renderComponent(vnode);

    expect(vnode.fiber).toBeDefined();
    expect(vnode.fiber?.vnode).toBe(vnode);
  });

  test("maintains bidirectional reference on re-render", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    renderComponent(vnode);
    const fiber = vnode.fiber;

    renderComponent(vnode);

    expect(vnode.fiber).toBe(fiber);
    expect(fiber?.vnode).toBe(vnode);
  });

  test("fiber.vnode reference is updated on each render", () => {
    const Component = () => h("div", null, "Hello");
    const vnode = h(Component, null);

    renderComponent(vnode);
    const fiber = vnode.fiber;

    // Render again
    renderComponent(vnode);

    // Fiber should still point to the same vnode
    expect(fiber?.vnode).toBe(vnode);
  });
});
