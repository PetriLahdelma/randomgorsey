import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Select from "../Select";

describe("Select Component", () => {
  const options = [
    { label: "One", value: "1" },
    { label: "Two", value: "2" },
  ];

  it("renders all options", () => {
    render(
      <Select
        options={options}
        value=""
        onChange={() => {}}
        placeholder="choose"
      />
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("calls onChange when new value selected", () => {
    const handleChange = jest.fn();
    render(<Select options={options} value="1" onChange={handleChange} />);
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "2" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders with label correctly", () => {
    const handleChange = jest.fn();
    render(
      <Select
        options={options}
        value="1"
        onChange={handleChange}
        label="Select option"
      />
    );

    // Should be able to find by label text
    expect(screen.getByLabelText("Select option")).toBeInTheDocument();

    // Should render the label
    expect(screen.getByText("Select option")).toBeInTheDocument();
  });
});
