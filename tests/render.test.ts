import { render } from "../src/render.js";
import { createElement as h } from "../src/createElement.js";

describe("render", () => {
  test("renders string to container", () => {
    const container = document.createElement("div");
    render("hello", container);
    expect(container.textContent).toBe("hello");
  });

  test("renders null does nothing", () => {
    const container = document.createElement("div");
    render(null, container);
    expect(container.children.length).toBe(0);
  });

  test("renders simple element", () => {
    const container = document.createElement("div");
    const vnode = h("span", null, "content");
    render(vnode, container);
    expect(container.innerHTML).toBe("<span>content</span>");
  });

  test("renders element with props", () => {
    const container = document.createElement("div");
    const vnode = h("p", { id: "test", className: "foo" });
    render(vnode, container);
    expect(container.innerHTML).toBe('<p id="test" class="foo"></p>');
  });

  test("renders nested elements", () => {
    const container = document.createElement("div");
    const vnode = h("div", null, h("span", null, "nested"));
    render(vnode, container);
    expect(container.innerHTML).toBe("<div><span>nested</span></div>");
  });

  test("renders multiple children", () => {
    const container = document.createElement("div");
    const vnode = h("ul", null, h("li", null, "A"), h("li", null, "B"));
    render(vnode, container);
    expect(container.innerHTML).toBe("<ul><li>A</li><li>B</li></ul>");
  });

  test("renders function component", () => {
    const Hello = (props: any) => h("div", null, "Hello ", props.name);
    const container = document.createElement("div");
    const vnode = h(Hello, { name: "World" });
    render(vnode, container);
    expect(container.innerHTML).toBe("<div>Hello World</div>");
  });

  test("renders empty element", () => {
    const container = document.createElement("div");
    const vnode = h("br", null);
    render(vnode, container);
    expect(container.innerHTML).toBe("<br>");
  });

  test("renders mixed content", () => {
    const container = document.createElement("div");
    const vnode = h("p", null, "Hello ", h("strong", null, "world"), "!");
    render(vnode, container);
    expect(container.innerHTML).toBe("<p>Hello <strong>world</strong>!</p>");
  });

  test("renders with multiple props", () => {
    const container = document.createElement("div");
    const vnode = h("input", {
      type: "text",
      placeholder: "Enter name",
      disabled: "true",
    });
    render(vnode, container);
    expect(container.innerHTML).toBe(
      '<input type="text" placeholder="Enter name" disabled="true">'
    );
  });
});
