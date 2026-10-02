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
});
