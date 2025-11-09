import { createElement as h, render, useState } from "../src/index";

function Counter() {
  const [count, setCount] = useState(0);
  return h("button", { onClick: () => setCount(count + 1) }, "Count: " + count);
}

function App() {
  return h("div", null, h(Counter, null), h(Counter, null), h(Counter, null));
}

render(h(App, null), document.getElementById("root"));
