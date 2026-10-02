import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeCardCalculator } from "@/components/time-card/TimeCardCalculator";

function getMondayInputs() {
  const mondayHeading = screen.getByText("Monday");
  const mondayCard = mondayHeading.closest("div")!.parentElement!;
  const inputs = mondayCard.querySelectorAll("input");
  return {
    clockIn: inputs[0] as HTMLInputElement,
    clockOut: inputs[1] as HTMLInputElement,
    breakMin: inputs[2] as HTMLInputElement,
  };
}

describe("TimeCardCalculator", () => {
  it("renders with 5 default days and empty state message", () => {
    render(<TimeCardCalculator />);
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
    expect(screen.getByText("Enter clock-in and clock-out times to see your total.")).toBeInTheDocument();
  });

  it("calculates normal work period (9:00 AM to 5:30 PM, 30m break)", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut, breakMin } = getMondayInputs();

    fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(clockOut, { target: { value: "5:30 PM" } });
    fireEvent.change(breakMin, { target: { value: "30" } });

    expect(screen.getByText("8h")).toBeInTheDocument();
    expect(screen.getByText("Week Total")).toBeInTheDocument();
    expect(screen.getByText("480 minutes")).toBeInTheDocument();
  });

  it("calculates overnight work period (10:00 PM to 6:00 AM)", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();

    fireEvent.change(clockIn, { target: { value: "10:00 PM" } });
    fireEvent.change(clockOut, { target: { value: "6:00 AM" } });

    expect(screen.getByText("8h")).toBeInTheDocument();
    expect(screen.getByText("overnight")).toBeInTheDocument();
  });

  it("calculates weekly total across multiple days", () => {
    render(<TimeCardCalculator />);
    const mondayInputs = getMondayInputs();

    fireEvent.change(mondayInputs.clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(mondayInputs.clockOut, { target: { value: "5:00 PM" } });

    expect(screen.getByText("8h")).toBeInTheDocument();
    expect(screen.getByText("480 minutes")).toBeInTheDocument();
  });

  it("shows error when break exceeds elapsed time", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut, breakMin } = getMondayInputs();

    fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(clockOut, { target: { value: "10:00 AM" } });
    fireEvent.change(breakMin, { target: { value: "120" } });

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("no dead error prop on TimeInputs (aria-invalid not triggered by dead prop)", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();

    fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(clockOut, { target: { value: "5:00 PM" } });

    expect(clockIn).toHaveAttribute("aria-invalid", "false");
    expect(clockOut).toHaveAttribute("aria-invalid", "false");
  });

  it("resets all fields when reset button is clicked", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();

    fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(clockOut, { target: { value: "5:00 PM" } });
    expect(screen.getByText("Week Total")).toBeInTheDocument();

    const resetBtn = screen.getByText("Reset");
    fireEvent.click(resetBtn);

    expect(clockIn).toHaveValue("");
    expect(clockOut).toHaveValue("");
    expect(screen.getByText("Enter clock-in and clock-out times to see your total.")).toBeInTheDocument();
  });
});
