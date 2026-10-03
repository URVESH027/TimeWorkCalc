import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TimesheetCalculator } from "@/components/timesheet/TimesheetCalculator";

function getHoursInput(name: string) {
  return screen.getByLabelText(name) as HTMLInputElement;
}

function setHours(name: string, value: string) {
  fireEvent.change(getHoursInput(name), { target: { value } });
}

describe("TimesheetCalculator", () => {
  it("shows empty state by default", () => {
    render(<TimesheetCalculator />);
    expect(
      screen.getByText("Enter hours worked each day to see your weekly total."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument();
  });

  it("renders seven day inputs with visible short labels", () => {
    render(<TimesheetCalculator />);
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
    const monday = getHoursInput("Monday");
    expect(monday).toHaveAttribute("type", "number");
    expect(monday).toHaveAttribute("min", "0");
    expect(monday).toHaveAttribute("step", "0.25");
    expect(getHoursInput("Sunday")).toBeInTheDocument();
  });

  it("calculates a single day (Monday 7.5)", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "7.5");

    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveTextContent("7h 30m");
    expect(screen.getByText("7.5 hours")).toBeInTheDocument();
    expect(screen.getByText("450 minutes")).toBeInTheDocument();
  });

  it("calculates the full-week example (7.5, 8, 6.5, 8, 7.5)", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "7.5");
    setHours("Tuesday", "8");
    setHours("Wednesday", "6.5");
    setHours("Thursday", "8");
    setHours("Friday", "7.5");

    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveTextContent("37h 30m");
    expect(screen.getByText("37.5 hours")).toBeInTheDocument();
    expect(screen.getByText("2250 minutes")).toBeInTheDocument();
  });

  it("ignores empty days when summing", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "8");
    setHours("Friday", "4");

    expect(
      screen.getByRole("region", { name: "Results" }),
    ).toHaveTextContent("12h");
    expect(screen.getByText("12 hours")).toBeInTheDocument();
    expect(screen.getByText("720 minutes")).toBeInTheDocument();
  });

  it("handles zero hours", () => {
    render(<TimesheetCalculator />);
    setHours("Saturday", "0");

    expect(screen.getByRole("region", { name: "Results" })).toHaveTextContent("0h");
    expect(screen.getByText("0 hours")).toBeInTheDocument();
    expect(screen.getByText("0 minutes")).toBeInTheDocument();
  });

  it("handles fractional hours (0.5)", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "0.5");

    expect(screen.getByRole("region", { name: "Results" })).toHaveTextContent("30m");
    expect(screen.getByText("0.5 hours")).toBeInTheDocument();
    expect(screen.getByText("30 minutes")).toBeInTheDocument();
  });

  it("handles quarter hours (1.25)", () => {
    render(<TimesheetCalculator />);
    setHours("Tuesday", "1.25");

    expect(screen.getByRole("region", { name: "Results" })).toHaveTextContent(
      "1h 15m",
    );
    expect(screen.getByText("1.25 hours")).toBeInTheDocument();
    expect(screen.getByText("75 minutes")).toBeInTheDocument();
  });

  it("handles a whole hour (1) with singular units", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "1");

    expect(screen.getByRole("region", { name: "Results" })).toHaveTextContent("1h");
    expect(screen.getByText("1 hour")).toBeInTheDocument();
    expect(screen.getByText("60 minutes")).toBeInTheDocument();
  });

  it("handles 8 hours", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "8");

    expect(screen.getByRole("region", { name: "Results" })).toHaveTextContent("8h");
    expect(screen.getByText("8 hours")).toBeInTheDocument();
    expect(screen.getByText("480 minutes")).toBeInTheDocument();
  });

  it("handles a 24-hour day without capping", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "24");

    expect(screen.getByRole("region", { name: "Results" })).toHaveTextContent("24h");
    expect(screen.getByText("24 hours")).toBeInTheDocument();
    expect(screen.getByText("1440 minutes")).toBeInTheDocument();
  });

  it("shows an error and no result for negative hours", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "-5");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Hours must be a number of 0 or greater.",
    );
    expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument();
    expect(
      screen.queryByText("Enter hours worked each day to see your weekly total."),
    ).not.toBeInTheDocument();
  });

  it("sanitizes non-numeric text to an empty value (number input)", () => {
    render(<TimesheetCalculator />);
    const input = getHoursInput("Monday");
    fireEvent.change(input, { target: { value: "abc" } });

    expect(input.value).toBe("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(
      screen.getByText("Enter hours worked each day to see your weekly total."),
    ).toBeInTheDocument();
  });

  it("keeps other days when one day becomes negative", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "8");
    setHours("Tuesday", "-1");

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument();
  });

  it("resets all days and returns to the empty state", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "8");
    setHours("Thursday", "6.5");
    expect(
      screen.getByRole("region", { name: "Results" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(getHoursInput("Monday").value).toBe("");
    expect(getHoursInput("Thursday").value).toBe("");
    expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument();
    expect(
      screen.getByText("Enter hours worked each day to see your weekly total."),
    ).toBeInTheDocument();
  });

  it("copies the entered days and weekly total", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<TimesheetCalculator />);
    setHours("Monday", "7.5");
    setHours("Tuesday", "1");

    fireEvent.click(screen.getByRole("button", { name: "Copy result" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "Monday: 7.5 hours\nTuesday: 1 hour\nWeekly Total: 8.5 hours",
      );
    });
  });

  it("shows both result formats together", () => {
    render(<TimesheetCalculator />);
    setHours("Monday", "7.5");

    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveTextContent("7h 30m");
    expect(screen.getByText("Weekly total")).toBeInTheDocument();
    expect(screen.getByText("Decimal hours")).toBeInTheDocument();
    expect(screen.getByText("Total minutes")).toBeInTheDocument();
  });
});
