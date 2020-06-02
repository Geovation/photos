import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { HashRouter } from "react-router-dom";
import config from "./custom/config";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <HashRouter>
      <App config={config} />
    </HashRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
