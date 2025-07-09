import React from "react";
import { render, screen } from "@testing-library/react";

const Dummy = () => <h1>Hello World</h1>;

test("renders Hello World", () => {
  render(<Dummy />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});
