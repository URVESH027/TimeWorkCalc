import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UnitConverterCalculator } from "@/components/converters/UnitConverterCalculator";

function getHoursInput() {
  return screen.getByLabelText("Hours") as HTMLInputElement;
}

function getMinutesInput() {
  return screen.getByLabelText("Minutes") as HTMLInputElement;
}

function renderHoursToMinutes() {
  render(<UnitConverterCalculator direction="hours-to-minutes" />);
  return getHoursInput();
}

function renderMinutesToHours() {
  render(<UnitConverterCalculator direction="minutes-to-hours" />);
  return getMinutesInput();
}

describe("UnitConverterCalculator — Hours to Minutes", () => {
  it("converts 0 hours to 0 minutes", () => {
    const input = renderHoursToMinutes();
    fireEvent.change(input, { target: { value: "0" } });

    expect(screen.getByText("0 minutes")).toBeInTheDocument();
    expect(screen.getByText("0 hours")).toBeInTheDocument();
  });

  it("converts 1 hour to 60 minutes", () => {
    const input = renderHoursToMinutes();
    fireEvent.change(input, { target: { value: "1" } });

    expect(screen.getByText("60 minutes")).toBeInTheDocument();
    expect(screen.getByText("1 hour")).toBeInTheDocument();
    expect(screen.getByText("3600 seconds")).toBeInTheDocument();
  });

  it("converts 1.5 hours to 90 minutes", () => {
    const input = renderHoursToMinutes();
    fireEvent.change(input, { target: { value: "1.5" } });

    expect(screen.getByText("90 minutes")).toBeInTheDocument();
    expect(screen.getByText("1 hour 30 minutes")).toBeInTheDocument();
  });

  it("converts 2.5 hours to 150 minutes", () => {
    const input = renderHoursToMinutes();
    fireEvent.change(input, { target: { value: "2.5" } });

    expect(screen.getByText("150 minutes")).toBeInTheDocument();
    expect(screen.getByText("2 hours 30 minutes")).toBeInTheDocument();
  });

  it("converts 7.5 hours to 450 minutes", () => {
    const input = renderHoursToMinutes();
    fireEvent.change(input, { target: { value: "7.5" } });

    expect(screen.getByText("450 minutes")).toBeInTheDocument();
    expect(screen.getByText("7 hours 30 minutes")).toBeInTheDocument();
  });

  it("converts fractional values (0.25 → 15, 0.75 → 45)", () => {
    const input = renderHoursToMinutes();

    fireEvent.change(input, { target: { value: "0.25" } });
    expect(screen.getAllByText("15 minutes").length).toBeGreaterThanOrEqual(2);

    fireEvent.change(input, { target: { value: "0.75" } });
    expect(screen.getAllByText("45 minutes").length).toBeGreaterThanOrEqual(2);
  });

  it("shows the empty state for empty input", () => {
    renderHoursToMinutes();

    expect(
      screen.getByText("Enter hours to convert to minutes."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
  });

  it("rejects negative input", () => {
    const input = renderHoursToMinutes();
    fireEvent.change(input, { target: { value: "-5" } });

    expect(
      screen.getByText("Enter hours to convert to minutes."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
  });

  it("resets back to the empty state", () => {
    const input = renderHoursToMinutes();
    fireEvent.change(input, { target: { value: "2.5" } });
    expect(screen.getByText("150 minutes")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reset"));

    expect(input.value).toBe("");
    expect(
      screen.getByText("Enter hours to convert to minutes."),
    ).toBeInTheDocument();
  });
});

describe("UnitConverterCalculator — Minutes to Hours", () => {
  it("converts 0 minutes to 0 hours", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "0" } });

    expect(screen.getAllByText("0 hours").length).toBeGreaterThan(0);
    expect(screen.getByText("0 minutes")).toBeInTheDocument();
  });

  it("converts 30 minutes to 30 minutes and 0.5 hours", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "30" } });

    expect(screen.getAllByText("30 minutes").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("0.5 hours")).toBeInTheDocument();
  });

  it("converts 60 minutes to 1 hour", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "60" } });

    expect(screen.getAllByText("1 hour").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("60 minutes")).toBeInTheDocument();
  });

  it("converts 90 minutes to 1 hour 30 minutes = 1.5 hours", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "90" } });

    expect(screen.getByText("1 hour 30 minutes")).toBeInTheDocument();
    expect(screen.getByText("1.5 hours")).toBeInTheDocument();
    expect(screen.getByText("90 minutes")).toBeInTheDocument();
  });

  it("converts 120 minutes to 2 hours", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "120" } });

    expect(screen.getAllByText("2 hours").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("120 minutes")).toBeInTheDocument();
  });

  it("converts 190 minutes to 3 hours 10 minutes = 3.1667 hours", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "190" } });

    expect(screen.getByText("3 hours 10 minutes")).toBeInTheDocument();
    expect(screen.getByText("3.1667 hours")).toBeInTheDocument();
    expect(screen.getByText("190 minutes")).toBeInTheDocument();
  });

  it("converts fractional minutes without floating-point artifacts", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "45.5" } });

    expect(screen.getByText("45 minutes 30 seconds")).toBeInTheDocument();
    expect(screen.getByText("0.7583 hours")).toBeInTheDocument();
  });

  it("shows the empty state for empty input", () => {
    renderMinutesToHours();

    expect(
      screen.getByText("Enter minutes to convert to hours."),
    ).toBeInTheDocument();
  });

  it("rejects negative input", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "-10" } });

    expect(
      screen.getByText("Enter minutes to convert to hours."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
  });

  it("resets back to the empty state", () => {
    const input = renderMinutesToHours();
    fireEvent.change(input, { target: { value: "90" } });
    expect(screen.getByText("1 hour 30 minutes")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Reset"));

    expect(input.value).toBe("");
    expect(
      screen.getByText("Enter minutes to convert to hours."),
    ).toBeInTheDocument();
  });
});
