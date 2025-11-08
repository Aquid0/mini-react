import { createElement as h } from "../src/createElement.js";
import type { VNode } from "../src/types";

const strip = (vnode: VNode) => JSON.parse(JSON.stringify(vnode));

describe("createElement()", () => {
  test("creates a basic VNode with string tag and text child", () => {
    const vnode = h("h1", { id: "title" }, "Hello");
    expect(strip(vnode)).toEqual({
      type: "h1",
      props: { id: "title" },
      children: ["Hello"],
    });
  });

  test("flattens nested children arrays", () => {
    const vnode = h("ul", null, ["a", ["b", ["c"]]]);
    expect(strip(vnode).children).toEqual(["a", "b", "c"]);
  });

  test("filters out null, undefined, false, true but keeps 0", () => {
    const vnode = h("div", null, null, "A", false, 0, true, undefined, "B");
    expect(strip(vnode).children).toEqual(["A", "0", "B"]);
  });

  test("converts numbers into strings for text nodes", () => {
    const vnode = h("p", null, 123, 4.5);
    expect(strip(vnode).children).toEqual(["123", "4.5"]);
  });

  test("extracts key from props and removes it from props", () => {
    const vnode = h("li", { key: "abc", className: "item" }, "X");
    expect(vnode.key).toBe("abc");
    expect(vnode.props).toEqual({ className: "item" }); // key removed
  });

  test("works with function components", () => {
    function Hello(props) {
      return null;
    }
    const vnode = h(Hello, { name: "Alina" }, "child");
    expect(vnode.type).toBe(Hello);
    expect(vnode.props).toEqual({ name: "Alina" });
    expect(vnode.children).toEqual(["child"]);
  });

  test("children always stored as an array", () => {
    const vnode = h("span", null, "A");
    expect(Array.isArray(vnode.children)).toBe(true);
  });

  test("props can be null", () => {
    const vnode = h("div", null, "x");
    expect(vnode.props).toBeNull();
  });

  test("handles no props and no children", () => {
    const vnode = h("div", null);
    expect(strip(vnode)).toEqual({ type: "div", props: null, children: [] });
  });

  test("handles empty props object", () => {
    const vnode = h("div", {});
    expect(vnode.props).toEqual({});
  });

  test("handles special numbers", () => {
    const vnode = h("div", null, "", 0, NaN, Infinity);
    expect(strip(vnode).children).toEqual(["", "0", "NaN", "Infinity"]);
  });

  test("handles empty array children", () => {
    const vnode = h("div", null, []);
    expect(strip(vnode).children).toEqual([]);
  });

  test("handles deeply nested falsy values", () => {
    const vnode = h("div", null, [null, [undefined, [false]]]);
    expect(strip(vnode).children).toEqual([]);
  });

  test("handles null key", () => {
    const vnode = h("div", { key: null });
    expect(vnode.key).toBe(null);
    expect(vnode.props).toEqual({});
  });

  test("handles falsy but valid key", () => {
    const vnode = h("div", { key: 0 });
    expect(vnode.key).toBe(0);
    expect(vnode.props).toEqual({});
  });

  test("handles very deep nesting", () => {
    const vnode = h("div", null, [[[[[["deep"]]]]]]);
    expect(strip(vnode).children).toEqual(["deep"]);
  });
});
