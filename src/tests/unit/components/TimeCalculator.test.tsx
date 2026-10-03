import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeCalculator } from "@/components/calculator/TimeCalculator";

function hoursInputs() {
  return screen.getAllByLabelText(/hours/i) as HTMLInputElement[];
}
function minutesInputs() {
  return screen.getAllByLabelText(/minutes/i) as HTMLInputElement[];
}
function secondsInputs() {
  return screen.getAllByLabelText(/^seconds/i) as HTMLInputElement[];
}

describe("TimeCalculator validation", () => {
  it("shows the empty state when no input is entered", () => {
    render(<TimeCalculator />);
    expect(
      screen.getByText("Enter durations to perform time arithmetic."),
    ).toBeInTheDocument();
  });

  it("calculates a valid addition", () => {
    render(<TimeCalculator />);
    fireEvent.change(hoursInputs()[0], { target: { value: "1" } });
    fireEvent.change(minutesInputs()[0], { target: { value: "30" } });
    fireEvent.change(minutesInputs()[1], { target: { value: "45" } });

    expect(screen.getByText("2 hours 15 minutes")).toBeInTheDocument();
    expect(screen.getByText("2.25 hours")).toBeInTheDocument();
  });

  it("shows empty state when second duration is all zeros", () => {
    render(<TimeCalculator />);
    fireEvent.change(hoursInputs()[0], { target: { value: "2" } });
    fireEvent.change(hoursInputs()[1], { target: { value: "0" } });

    expect(
      screen.getByText("Enter durations to perform time arithmetic."),
    ).toBeInTheDocument();
  });

  it("non-numeric text is sanitized by the number input (never reaches the parser)", () => {
    render(<TimeCalculator />);
    const hours = hoursInputs()[0];
    fireEvent.change(hours, { target: { value: "abc" } });

    // type=number inputs sanitize invalid text to "" — the value never
    // reaches the duration parser, so it can never become a bogus 0.
    expect(hours.value).toBe("");
    expect(
      screen.getByText("Enter durations to perform time arithmetic."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("rejects negative input instead of coercing it", () => {
    render(<TimeCalculator />);
    fireEvent.change(minutesInputs()[0], { target: { value: "-5" } });

    expect(
      screen.getByText("First duration: minutes must be a number of 0 or greater."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("rejects fractional minutes", () => {
    render(<TimeCalculator />);
    fireEvent.change(minutesInputs()[0], { target: { value: "1.5" } });

    expect(
      screen.getByText("First duration: minutes must be a whole number."),
    ).toBeInTheDocument();
  });

  it("rejects minutes above 59", () => {
    render(<TimeCalculator />);
    fireEvent.change(minutesInputs()[0], { target: { value: "99" } });

    expect(
      screen.getByText("First duration: minutes must be between 0 and 59."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("rejects seconds above 59 on the second duration", () => {
    render(<TimeCalculator />);
    fireEvent.change(secondsInputs()[1], { target: { value: "75" } });

    expect(
      screen.getByText("Second duration: seconds must be between 0 and 59."),
    ).toBeInTheDocument();
  });

  it("zero is a valid input (0h + 45m = 45 minutes)", () => {
    render(<TimeCalculator />);
    fireEvent.change(hoursInputs()[0], { target: { value: "0" } });
    fireEvent.change(minutesInputs()[1], { target: { value: "45" } });

    expect(screen.getByText("45 minutes")).toBeInTheDocument();
  });

  it("valid seconds inputs are preserved in the result", () => {
    render(<TimeCalculator />);
    fireEvent.change(secondsInputs()[0], { target: { value: "30" } });
    fireEvent.change(secondsInputs()[1], { target: { value: "45" } });

    expect(screen.getByText("1 minute 15 seconds")).toBeInTheDocument();
  });

  it("subtraction can produce a negative result (intended semantics)", () => {
    render(<TimeCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "Subtract" }));
    fireEvent.change(hoursInputs()[0], { target: { value: "1" } });
    fireEvent.change(hoursInputs()[1], { target: { value: "2" } });

    expect(screen.getByText("-1 hours")).toBeInTheDocument();
  });

  it("multiply: valid fractional factor calculates", () => {
    render(<TimeCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "Multiply" }));
    fireEvent.change(hoursInputs()[0], { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText(/multiply by/i), {
      target: { value: "1.5" },
    });

    expect(screen.getByText("3 hours")).toBeInTheDocument();
  });

  it("multiply: empty factor shows the empty state", () => {
    render(<TimeCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "Multiply" }));
    fireEvent.change(hoursInputs()[0], { target: { value: "2" } });

    expect(
      screen.getByText("Enter durations to perform time arithmetic."),
    ).toBeInTheDocument();
  });

  it("multiply: invalid factor shows a validation error", () => {
    render(<TimeCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "Multiply" }));
    fireEvent.change(screen.getByLabelText(/multiply by/i), {
      target: { value: "-2" },
    });

    expect(
      screen.getByText("Multiply by must be a number of 0 or greater."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Result")).not.toBeInTheDocument();
  });

  it("hidden second-duration fields are not validated in multiply mode", () => {
    render(<TimeCalculator />);
    fireEvent.change(minutesInputs()[1], { target: { value: "99" } });
    fireEvent.click(screen.getByRole("button", { name: "Multiply" }));

    expect(screen.queryByText(/Second duration/)).not.toBeInTheDocument();
    expect(
      screen.queryByText("Enter durations to perform time arithmetic."),
    ).toBeInTheDocument();
  });
});
