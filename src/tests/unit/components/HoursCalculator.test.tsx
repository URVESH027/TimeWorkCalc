import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HoursCalculator } from "@/components/calculator/HoursCalculator";

function getInput(name: RegExp) {
  return screen.getByRole("textbox", { name }) as HTMLInputElement;
}

describe("HoursCalculator", () => {
  it("calculates normal elapsed time (9:00 AM to 5:30 PM)", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "9:00 AM" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "5:30 PM" } });

    expect(screen.getByText("8 hours 30 minutes")).toBeInTheDocument();
    expect(screen.getByText("8.50 hours")).toBeInTheDocument();
    expect(screen.getByText("510 minutes")).toBeInTheDocument();
  });

  it("shows error and overnight hint when end < start without overnight", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "5:00 PM" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "9:00 AM" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/crosses midnight/i)).toBeInTheDocument();
  });

  it("calculates correctly when overnight is enabled", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "10:00 PM" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "6:00 AM" } });
    fireEvent.click(screen.getByLabelText(/Overnight shift/i));

    expect(screen.getByText("8 hours")).toBeInTheDocument();
    expect(screen.queryByText("Does your shift cross midnight? Enable \"Overnight shift\" above.")).not.toBeInTheDocument();
  });

  it("shows empty state when no input", () => {
    render(<HoursCalculator />);
    expect(screen.getByText("Enter start and end times to calculate elapsed time.")).toBeInTheDocument();
  });

  it("calculates natural hour-only input (10 am to 6 pm = 8 hours)", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "10 am" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "6 pm" } });

    expect(screen.getByText("8 hours")).toBeInTheDocument();
    expect(screen.getByText("8.00 hours")).toBeInTheDocument();
    expect(screen.getByText("480 minutes")).toBeInTheDocument();
  });

  it("calculates overnight with natural input (10 pm to 6 am = 8 hours)", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "10 pm" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "6 am" } });
    fireEvent.click(screen.getByLabelText(/Overnight shift/i));

    expect(screen.getByText("8 hours")).toBeInTheDocument();
  });

  it("calculates 12 am to 12 pm = 12 hours", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "12 am" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "12 pm" } });

    expect(screen.getByText("12 hours")).toBeInTheDocument();
    expect(screen.getByText("12.00 hours")).toBeInTheDocument();
  });

  it("calculates 12 pm to 12 am overnight = 12 hours", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "12 pm" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "12 am" } });
    fireEvent.click(screen.getByLabelText(/Overnight shift/i));

    expect(screen.getByText("12 hours")).toBeInTheDocument();
  });

  it("shows error for invalid input (25)", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "25" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "6 pm" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows error for ambiguous hour-only input (6)", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "6" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "6 pm" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/AM or PM/i);
  });

  it("preserves input seconds in the result (14:45:30 → 15:00:00 = 14m 30s)", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "14:45:30" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "15:00:00" } });

    expect(screen.getByText("14 minutes 30 seconds")).toBeInTheDocument();
    expect(screen.getByText("0.24 hours")).toBeInTheDocument();
    expect(screen.getByText("14 minutes")).toBeInTheDocument();
  });

  it("preserves seconds across midnight (23:59:30 → 00:00:15 overnight = 45s)", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "23:59:30" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "00:00:15" } });
    fireEvent.click(screen.getByLabelText(/Overnight shift/i));

    expect(screen.getByText("45 seconds")).toBeInTheDocument();
  });

  it("minute-only input produces no seconds component", () => {
    render(<HoursCalculator />);
    fireEvent.change(getInput(/start time/i), { target: { value: "14:45" } });
    fireEvent.change(getInput(/end time/i), { target: { value: "15:00" } });

    expect(screen.getAllByText("15 minutes").length).toBeGreaterThan(0);
    expect(screen.queryByText(/seconds/i)).not.toBeInTheDocument();
  });
});
