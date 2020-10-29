import { HashRouter } from "react-router-dom";
import config from "./custom/config";

import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders without crashing", () => {
  render(
    <HashRouter>
      <App config={config} />
    </HashRouter>
  );
  const linkElement = screen.getByText(/learn react/i);
  console.log(linkElement);
  // expect(linkElement).toBeInTheDocument();
});