import { render, screen } from "@testing-library/react";

import Checkbox from "../Checkbox";
import GroupLabel from "../GroupLabel";
import Input from "../Input";
import Select from "../Select";
import TextArea from "../TextArea";
import { Field, formFieldStyles } from "./Field";

describe("form field contracts", () => {
  it("associates input help and error text without duplicate descriptions", () => {
    const { rerender } = render(<Input id="reference" type="text" label="Reference" value="" onChange={() => undefined} helpText="Archive identifier" />);
    expect(screen.getByLabelText("Reference")).toHaveAttribute("aria-describedby", "reference-help");
    expect(screen.getByText("Archive identifier")).toHaveAttribute("id", "reference-help");

    rerender(<Input id="reference" type="text" label="Reference" value="RG" onChange={() => undefined} helpText="Archive identifier" error="Reference is incomplete." />);
    expect(screen.getByLabelText("Reference")).toHaveAttribute("aria-describedby", "reference-error");
    expect(screen.queryByText("Archive identifier")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Reference is incomplete.");
  });

  it("keeps loading controls disabled and announced by their label", () => {
    render(<Input type="text" label="Reference" value="Loading" onChange={() => undefined} loading />);
    expect(screen.getByLabelText("Reference")).toBeDisabled();
  });

  it("preserves native select and checkbox semantics", () => {
    render(
      <>
        <Select id="route" label="Route" options={[{ label: "Booking", value: "booking" }]} value="booking" onChange={() => undefined} />
        <Checkbox id="consent" label="Retain selection" checked={false} onChange={() => undefined} helpText="Stored locally" />
      </>
    );
    expect(screen.getByRole("combobox", { name: "Route" })).toHaveValue("booking");
    expect(screen.getByRole("checkbox", { name: /retain selection/i })).toHaveAttribute("aria-describedby", "consent-help");
  });

  it("renders grouped-field descriptions through native fieldset semantics", () => {
    render(<fieldset aria-describedby="delivery-description"><GroupLabel as="legend" description="Choose a delivery route." descriptionId="delivery-description">Delivery</GroupLabel><input aria-label="Email" /></fieldset>);
    expect(screen.getByRole("group", { name: "Delivery" })).toHaveAccessibleDescription("Choose a delivery route.");
  });

  it("keeps the extracted Contact presentation reusable without changing field semantics", () => {
    render(<Field id="contact-name" label="Name" presentation="contact" error="Name is required."><input id="contact-name" className={formFieldStyles.contactControl} aria-invalid="true" aria-describedby="contact-name-error" /></Field>);
    expect(screen.getByLabelText("Name")).toHaveClass(formFieldStyles.contactControl);
    expect(screen.getByLabelText("Name")).toHaveAccessibleDescription("Name is required.");
  });

  it("associates TextArea help text and invalid state", () => {
    render(<TextArea id="message" label="Message" value="" onChange={() => undefined} error="Add a message." />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveAccessibleDescription("Add a message.");
  });
});
