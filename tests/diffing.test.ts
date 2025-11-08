import { update } from "../src/reconciler.js";
import { createElement as h } from "../src/createElement.js";
import { render } from "../src/render.js";

describe("diffing", () => {
  // Basic operations
  test("mounts new vnode", () => {
    const container = document.createElement("div");
    const vnode = h("span", null, "hello");
    update(container, null, vnode);
    expect(container.innerHTML).toBe("<span>hello</span>");
  });

  test("unmounts vnode", () => {
    const container = document.createElement("div");
    const vnode = h("span", null, "hello");
    render(vnode, container);
    update(container, vnode, null);
    expect(container.innerHTML).toBe("");
  });

  test("replaces different type", () => {
    const container = document.createElement("div");
    const prev = h("span", null, "old");
    const next = h("div", null, "new");
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div>new</div>");
  });

  // Props updates
  test("updates props", () => {
    const container = document.createElement("div");
    const prev = h("div", { id: "old", className: "foo" });
    const next = h("div", { id: "new", className: "bar" });
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe('<div id="new" class="bar"></div>');
  });

  test("removes props", () => {
    const container = document.createElement("div");
    const prev = h("div", { id: "test", className: "foo" });
    const next = h("div", { id: "test" });
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe('<div id="test"></div>');
  });

  test("adds props", () => {
    const container = document.createElement("div");
    const prev = h("div", { id: "test" });
    const next = h("div", { id: "test", className: "new" });
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe('<div id="test" class="new"></div>');
  });

  test("updates from null props to props", () => {
    const container = document.createElement("div");
    const prev = h("div", null);
    const next = h("div", { id: "test" });
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe('<div id="test"></div>');
  });

  test("updates from props to null props", () => {
    const container = document.createElement("div");
    const prev = h("div", { id: "test" });
    const next = h("div", null);
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div></div>");
  });

  // Event listeners
  test("updates event listeners", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const container = document.createElement("div");
    const prev = h("button", { onClick: handler1 }, "Click");
    const next = h("button", { onClick: handler2 }, "Click");
    render(prev, container);
    update(container, prev, next);

    const button = container.querySelector("button");
    button?.click();
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  test("removes event listeners", () => {
    const handler = jest.fn();
    const container = document.createElement("div");
    const prev = h("button", { onClick: handler }, "Click");
    const next = h("button", null, "Click");
    render(prev, container);
    update(container, prev, next);

    const button = container.querySelector("button");
    button?.click();
    expect(handler).not.toHaveBeenCalled();
  });

  test("adds event listeners", () => {
    const handler = jest.fn();
    const container = document.createElement("div");
    const prev = h("button", null, "Click");
    const next = h("button", { onClick: handler }, "Click");
    render(prev, container);
    update(container, prev, next);

    const button = container.querySelector("button");
    button?.click();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  // Children updates
  test("updates children", () => {
    const container = document.createElement("div");
    const prev = h("div", null, h("span", null, "old"));
    const next = h("div", null, h("span", null, "new"));
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div><span>new</span></div>");
  });

  test("adds children", () => {
    const container = document.createElement("div");
    const prev = h("ul", null, h("li", null, "A"));
    const next = h("ul", null, h("li", null, "A"), h("li", null, "B"));
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<ul><li>A</li><li>B</li></ul>");
  });

  test("removes children", () => {
    const container = document.createElement("div");
    const prev = h("ul", null, h("li", null, "A"), h("li", null, "B"));
    const next = h("ul", null, h("li", null, "A"));
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<ul><li>A</li></ul>");
  });

  test("updates from no children to children", () => {
    const container = document.createElement("div");
    const prev = h("div", null);
    const next = h("div", null, h("span", null, "child"));
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div><span>child</span></div>");
  });

  test("updates from children to no children", () => {
    const container = document.createElement("div");
    const prev = h("div", null, h("span", null, "child"));
    const next = h("div", null);
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div></div>");
  });

  // Text node updates
  test("updates text node", () => {
    const container = document.createElement("div");
    const prev = h("div", null, "old");
    const next = h("div", null, "new");
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div>new</div>");
  });

  test("replaces text with element", () => {
    const container = document.createElement("div");
    const prev = h("div", null, "text");
    const next = h("div", null, h("span", null, "element"));
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div><span>element</span></div>");
  });

  test("replaces element with text", () => {
    const container = document.createElement("div");
    const prev = h("div", null, h("span", null, "element"));
    const next = h("div", null, "text");
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div>text</div>");
  });

  // Edge cases
  test("handles empty string children", () => {
    const container = document.createElement("div");
    const prev = h("div", null, "text");
    const next = h("div", null, "");
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div></div>");
  });

  test("handles mixed children types", () => {
    const container = document.createElement("div");
    const prev = h("div", null, "text", h("span", null, "span"));
    const next = h("div", null, h("span", null, "span"), "text");
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe("<div><span>span</span>text</div>");
  });

  test("handles deeply nested updates", () => {
    const container = document.createElement("div");
    const prev = h("div", null, h("div", null, h("div", null, "deep")));
    const next = h("div", null, h("div", null, h("div", null, "updated")));
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe(
      "<div><div><div>updated</div></div></div>"
    );
  });

  test("handles multiple prop changes at once", () => {
    const container = document.createElement("div");
    const prev = h("input", { type: "text", value: "old", disabled: "true" });
    const next = h("input", {
      type: "email",
      value: "new",
      placeholder: "hint",
    });
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe(
      '<input type="email" value="new" placeholder="hint">'
    );
  });

  test("handles same vnode reference", () => {
    const container = document.createElement("div");
    const vnode = h("div", { id: "same" }, "content");
    render(vnode, container);
    update(container, vnode, vnode);
    expect(container.innerHTML).toBe('<div id="same">content</div>');
  });

  test("handles null to null", () => {
    const container = document.createElement("div");
    update(container, null, null);
    expect(container.innerHTML).toBe("");
  });

  test("updates multiple children with different operations", () => {
    const container = document.createElement("div");
    const prev = h(
      "div",
      null,
      h("span", null, "keep"),
      h("p", null, "remove"),
      h("div", null, "change")
    );
    const next = h(
      "div",
      null,
      h("span", null, "keep"),
      h("div", null, "changed"),
      h("a", null, "new")
    );
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe(
      "<div><span>keep</span><div>changed</div><a>new</a></div>"
    );
  });

  test("handles className updates", () => {
    const container = document.createElement("div");
    const prev = h("div", { className: "old-class" });
    const next = h("div", { className: "new-class" });
    render(prev, container);
    update(container, prev, next);
    expect(container.innerHTML).toBe('<div class="new-class"></div>');
  });

  test("handles multiple event types", () => {
    const onClick = jest.fn();
    const onMouseOver = jest.fn();
    const container = document.createElement("div");
    const prev = h("button", null, "Test");
    const next = h("button", { onClick, onMouseOver }, "Test");
    render(prev, container);
    update(container, prev, next);

    const button = container.querySelector("button");
    button?.click();
    button?.dispatchEvent(new MouseEvent("mouseover"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onMouseOver).toHaveBeenCalledTimes(1);
  });
});
