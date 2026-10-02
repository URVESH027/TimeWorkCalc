import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DecimalHoursCalculator } from "@/components/calculator/DecimalHoursCalculator";

function getInput(label: string) {
  return screen.getByLabelText(label) as HTMLInputElement;
}

describe("DecimalHoursCalculator", () => {
  describe("HH:MM to Decimal direction", () => {
    it("converts 7h 30m to 7.50", () => {
      render(<DecimalHoursCalculator />);
      fireEvent.change(getInput("Hours"), { target: { value: "7" } });
      fireEvent.change(getInput("Minutes"), { target: { value: "30" } });

      expect(screen.getByText("7.50 decimal hours")).toBeInTheDocument();
      expect(screen.getByText("7 hours 30 minutes")).toBeInTheDocument();
      expect(screen.getByText("450 minutes")).toBeInTheDocument();
    });

    it("converts 7h 15m to 7.25", () => {
      render(<DecimalHoursCalculator />);
      fireEvent.change(getInput("Hours"), { target: { value: "7" } });
      fireEvent.change(getInput("Minutes"), { target: { value: "15" } });

      expect(screen.getByText("7.25 decimal hours")).toBeInTheDocument();
      expect(screen.getByText("7 hours 15 minutes")).toBeInTheDocument();
    });

    it("converts 7h 45m to 7.75", () => {
      render(<DecimalHoursCalculator />);
      fireEvent.change(getInput("Hours"), { target: { value: "7" } });
      fireEvent.change(getInput("Minutes"), { target: { value: "45" } });

      expect(screen.getByText("7.75 decimal hours")).toBeInTheDocument();
      expect(screen.getByText("7 hours 45 minutes")).toBeInTheDocument();
    });
  });

  describe("Decimal to HH:MM direction", () => {
    it("converts 7.5 to 7h 30m", () => {
      render(<DecimalHoursCalculator />);
      fireEvent.click(screen.getByText("Decimal → HH:MM"));
      fireEvent.change(getInput("Decimal hours"), { target: { value: "7.5" } });

      expect(screen.getByText("7 hours 30 minutes")).toBeInTheDocument();
    });

    it("converts 7.25 to 7h 15m", () => {
      render(<DecimalHoursCalculator />);
      fireEvent.click(screen.getByText("Decimal → HH:MM"));
      fireEvent.change(getInput("Decimal hours"), { target: { value: "7.25" } });

      expect(screen.getByText("7 hours 15 minutes")).toBeInTheDocument();
    });

    it("converts 7.75 to 7h 45m", () => {
      render(<DecimalHoursCalculator />);
      fireEvent.click(screen.getByText("Decimal → HH:MM"));
      fireEvent.change(getInput("Decimal hours"), { target: { value: "7.75" } });

      expect(screen.getByText("7 hours 45 minutes")).toBeInTheDocument();
    });
  });

  it("shows empty state when no input", () => {
    render(<DecimalHoursCalculator />);
    expect(screen.getByText("Enter a value to convert between hours/minutes and decimal hours.")).toBeInTheDocument();
  });

  it("uses durationToTotalMinutes for minutes display (not manual math)", () => {
    render(<DecimalHoursCalculator />);
    fireEvent.change(getInput("Hours"), { target: { value: "2" } });
    fireEvent.change(getInput("Minutes"), { target: { value: "30" } });

    expect(screen.getByText("150 minutes")).toBeInTheDocument();
  });
});
