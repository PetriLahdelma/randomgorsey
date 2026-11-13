import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { formFieldStyles } from "@/components/forms";
import Contact from "../Contact";

const sendMock = vi.fn();

vi.mock("@emailjs/browser", () => ({
  default: {
    init: vi.fn(),
    send: (...args: unknown[]) => sendMock(...args),
  },
}));

describe("Contact inquiry behavior", () => {
  beforeEach(() => {
    sendMock.mockReset();
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID", "service-test");
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "template-test");
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY", "public-test");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  function fillHelloForm() {
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Quiet Listener" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "listener@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /just saying hello/i }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello from Helsinki." },
    });
  }

  it("explains the missing inquiry type instead of presenting a dead submit button", async () => {
    render(<Contact />);

    const submit = screen.getByRole("button", { name: /send message/i });
    expect(submit).toBeEnabled();
    fireEvent.click(submit);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /choose an inquiry type/i
    );
    expect(
      screen.getByRole("button", { name: /booking & events/i })
    ).toHaveFocus();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("keeps identity while clearing fields that belong to the previous reason", () => {
    render(<Contact />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "A Promoter" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "promoter@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /booking & events/i }));
    fireEvent.change(screen.getByLabelText("Venue or event"), {
      target: { value: "Kaiku" },
    });

    fireEvent.click(screen.getByRole("button", { name: /change inquiry type/i }));
    fireEvent.click(screen.getByRole("button", { name: /collaboration/i }));

    expect(screen.getByLabelText("Name")).toHaveValue("A Promoter");
    expect(screen.getByLabelText("Email")).toHaveValue("promoter@example.com");
    expect(screen.queryByDisplayValue("Kaiku")).not.toBeInTheDocument();
  });

  it("summarizes validation errors and focuses the first invalid field", async () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: /just saying hello/i }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "The required identity fields were missed." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Please check the highlighted fields.")).toBeVisible();
    expect(screen.getByLabelText("Name")).toHaveFocus();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("uses a hidden non-autofillable spam trap", () => {
    render(<Contact />);
    const trap = document.getElementById("contact-company");
    expect(trap).toHaveAttribute("type", "hidden");
    expect(trap).toHaveAttribute("name", "contact_website");
    expect(trap).toHaveAttribute("autocomplete", "off");
  });

  it("blocks a normally filled spam trap with visible feedback", async () => {
    render(<Contact />);
    fillHelloForm();
    const trap = document.getElementById("contact-company") as HTMLInputElement;
    trap.value = "bot-filled";
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/clear browser autofill/i)).toBeVisible();
    expect(sendMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Message")).toHaveValue("Hello from Helsinki.");
  });

  it("clears a browser-autofilled trap and submits the valid visible form", async () => {
    sendMock.mockResolvedValue({ status: 200, text: "OK" });
    const originalMatches = Element.prototype.matches;
    vi.spyOn(Element.prototype, "matches").mockImplementation(function (selector) {
      if (selector === ":-webkit-autofill" && this.id === "contact-company") return true;
      return originalMatches.call(this, selector);
    });
    render(<Contact />);
    fillHelloForm();
    const trap = document.getElementById("contact-company") as HTMLInputElement;
    trap.value = "browser-profile";
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(sendMock).toHaveBeenCalledOnce());
    expect(trap).toHaveValue("");
    expect(await screen.findByRole("heading", { name: "Message submitted" })).toBeVisible();
  });

  it("submits once while pending and retains the entered values when delivery fails", async () => {
    let rejectDelivery: ((reason: Error) => void) | undefined;
    sendMock.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectDelivery = reject;
      })
    );

    render(<Contact />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Quiet Listener" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "listener@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /just saying hello/i }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Hello from Helsinki." },
    });

    const submit = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(submit);
    fireEvent.click(submit);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();

    rejectDelivery?.(new Error("provider unavailable"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/could not be submitted/i);
    });
    expect(screen.getByLabelText("Name")).toHaveValue("Quiet Listener");
    expect(screen.getByLabelText("Email")).toHaveValue("listener@example.com");
    expect(screen.getByLabelText("Message")).toHaveValue("Hello from Helsinki.");
  });

  it("shows an unconfirmed locked state, then reconciles a late success", async () => {
    vi.useFakeTimers();
    let resolveDelivery: ((value: { status: number; text: string }) => void) | undefined;
    sendMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDelivery = resolve;
      })
    );
    render(<Contact />);
    fillHelloForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await act(async () => vi.advanceTimersByTime(12_000));
    expect(screen.getByText("UNCONFIRMED")).toBeVisible();
    expect(screen.getByRole("button", { name: "Delivery unconfirmed" })).toBeDisabled();
    expect(screen.getByLabelText("Name")).toBeDisabled();
    expect(screen.getByRole("button", { name: /just saying hello/i })).toBeDisabled();
    expect(screen.getByRole("link", { name: "SoundCloud" })).toBeEnabled();
    expect(screen.getByText(/request is still pending/i)).toBeVisible();

    await act(async () => resolveDelivery?.({ status: 200, text: "OK" }));
    expect(screen.getByRole("heading", { name: "Message submitted" })).toBeVisible();
    expect(screen.getByText("SUBMITTED")).toBeVisible();
  });

  it("unlocks the retained form after a late delivery failure", async () => {
    vi.useFakeTimers();
    let rejectDelivery: ((reason: Error) => void) | undefined;
    sendMock.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectDelivery = reject;
      })
    );
    render(<Contact />);
    fillHelloForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await act(async () => vi.advanceTimersByTime(12_000));

    await act(async () => rejectDelivery?.(new Error("late provider failure")));
    expect(screen.getByText(/delayed delivery failed/i)).toBeVisible();
    expect(screen.getByText("READY")).toBeVisible();
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
    expect(screen.getByLabelText("Name")).toHaveValue("Quiet Listener");
    expect(screen.getByLabelText("Message")).toHaveValue("Hello from Helsinki.");
  });

  it("reconciles a late success under StrictMode effect replay", async () => {
    vi.useFakeTimers();
    let resolveDelivery: ((value: { status: number; text: string }) => void) | undefined;
    sendMock.mockReturnValue(
      new Promise((resolve) => {
        resolveDelivery = resolve;
      })
    );
    render(
      <React.StrictMode>
        <Contact />
      </React.StrictMode>
    );
    fillHelloForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await act(async () => vi.advanceTimersByTime(12_000));
    await act(async () => resolveDelivery?.({ status: 200, text: "OK" }));

    expect(screen.getByRole("heading", { name: "Message submitted" })).toBeVisible();
  });

  it("reconciles a late failure under StrictMode effect replay", async () => {
    vi.useFakeTimers();
    let rejectDelivery: ((reason: Error) => void) | undefined;
    sendMock.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectDelivery = reject;
      })
    );
    render(
      <React.StrictMode>
        <Contact />
      </React.StrictMode>
    );
    fillHelloForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await act(async () => vi.advanceTimersByTime(12_000));
    await act(async () => rejectDelivery?.(new Error("late provider failure")));

    expect(screen.getByText(/delayed delivery failed/i)).toBeVisible();
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("delivers an allowed long message without truncating its ending", async () => {
    sendMock.mockResolvedValue({ status: 200, text: "OK" });
    const ending = "END-OF-MESSAGE";
    const longMessage = `${"a".repeat(1485)}${ending}`;

    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Long Form" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "long@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /just saying hello/i }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: longMessage },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(sendMock).toHaveBeenCalledTimes(1));
    const payload = sendMock.mock.calls[0][2] as { message: string };
    expect(payload.message).toContain(longMessage);
    expect(payload.message).toContain(ending);
  });

  it("rejects a message over 5000 characters instead of clipping and sending it", async () => {
    sendMock.mockResolvedValue({ status: 200, text: "OK" });

    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Too Long" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "toolong@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /just saying hello/i }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "x".repeat(5001) },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/5000 characters/i)).toBeVisible();
    expect(sendMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Message")).toHaveValue("x".repeat(5001));
  });

  it("sends the complete booking fields with the selected budget label", async () => {
    sendMock.mockResolvedValue({ status: 200, text: "OK" });

    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Booking Agent" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "agent@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /booking & events/i }));
    fireEvent.change(screen.getByLabelText("Date or date range"), {
      target: { value: "15 June 2027" },
    });
    fireEvent.change(screen.getByLabelText("Venue or event"), {
      target: { value: "Kaiku" },
    });
    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: "Helsinki" },
    });
    fireEvent.change(screen.getByLabelText("Budget"), {
      target: { value: "1000-2500" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Please send availability and technical details." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(sendMock).toHaveBeenCalledTimes(1));
    const [serviceId, templateId, payload, publicKey] = sendMock.mock.calls[0] as [
      string,
      string,
      { name: string; email: string; subject: string; message: string },
      string,
    ];
    expect({ serviceId, templateId, publicKey }).toEqual({
      serviceId: "service-test",
      templateId: "template-test",
      publicKey: "public-test",
    });
    expect(payload).toMatchObject({
      name: "Booking Agent",
      email: "agent@example.com",
      subject: "Contact: booking",
    });
    expect(payload.message).toContain("Date: 15 June 2027");
    expect(payload.message).toContain("Venue: Kaiku");
    expect(payload.message).toContain("Location: Helsinki");
    expect(payload.message).toContain("Budget: €1,000–€2,500");
    expect(payload.message).toContain(
      "Message: Please send availability and technical details."
    );
    expect(payload.message).not.toContain("Project Type:");
    expect(payload.message).not.toContain("Timeline:");
  });

  it("sends collaboration fields without stale booking data", async () => {
    sendMock.mockResolvedValue({ status: 200, text: "OK" });

    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Collaborator" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "collab@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /booking & events/i }));
    fireEvent.change(screen.getByLabelText("Venue or event"), {
      target: { value: "Stale Venue" },
    });
    fireEvent.click(screen.getByRole("button", { name: /collaboration/i }));
    fireEvent.change(screen.getByLabelText("Project type"), {
      target: { value: "remix" },
    });
    fireEvent.change(screen.getByLabelText("Timeline"), {
      target: { value: "Autumn 2027" },
    });
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "I would like to discuss a remix project." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(sendMock).toHaveBeenCalledTimes(1));
    const payload = sendMock.mock.calls[0][2] as {
      subject: string;
      message: string;
    };
    expect(payload.subject).toBe("Contact: collaboration");
    expect(payload.message).toContain("Project Type: Remix");
    expect(payload.message).toContain("Timeline: Autumn 2027");
    expect(payload.message).toContain(
      "Message: I would like to discuss a remix project."
    );
    expect(payload.message).not.toContain("Stale Venue");
    expect(payload.message).not.toContain("Budget:");
    expect(payload.message).not.toContain("Date:");
  });

  it("keeps valid details and reports unavailable delivery when configuration is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_SERVICE_ID", "");
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID", "");
    vi.stubEnv("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY", "");

    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Config Check" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "config@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /just saying hello/i }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "This message should remain in the form." },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /message service is unavailable/i
    );
    expect(sendMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Name")).toHaveValue("Config Check");
    expect(screen.getByLabelText("Email")).toHaveValue("config@example.com");
    expect(screen.getByLabelText("Message")).toHaveValue(
      "This message should remain in the form."
    );
  });

  it("reports a synchronous provider failure and leaves the completed form editable", async () => {
    sendMock.mockImplementation(() => {
      throw new Error("provider initialization failed");
    });
    render(<Contact />);
    fillHelloForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /could not be submitted/i
    );
    expect(screen.getByRole("button", { name: /send message/i })).toBeEnabled();
    expect(screen.getByLabelText("Message")).toHaveValue("Hello from Helsinki.");
  });

  it("consumes the shared Contact field presentation without changing labels or focus order", () => {
    render(<Contact />);
    const name = screen.getByLabelText("Name");
    const email = screen.getByLabelText("Email");
    const submit = screen.getByRole("button", { name: /send message/i });

    expect(name).toHaveClass(formFieldStyles.contactControl);
    expect(email).toHaveClass(formFieldStyles.contactControl);
    expect(name.compareDocumentPosition(email) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(email.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
