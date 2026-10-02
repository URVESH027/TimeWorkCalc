import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimeInput } from "@/components/calculator/inputs/TimeInput";

describe("TimeInput", () => {
  it("renders with inputMode text (not decimal)", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} />);
    const input = screen.getByLabelText("Start") as HTMLInputElement;
    expect(input).toHaveAttribute("inputmode", "text");
  });

  it("supports 12-hour input", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="" onChange={onChange} />);
    const input = screen.getByLabelText("Start");
    fireEvent.change(input, { target: { value: "9:00 AM" } });
    expect(onChange).toHaveBeenCalledWith("9:00 AM");
  });

  it("supports 24-hour input", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="" onChange={onChange} />);
    const input = screen.getByLabelText("Start");
    fireEvent.change(input, { target: { value: "17:30" } });
    expect(onChange).toHaveBeenCalledWith("17:30");
  });

  it("shows error state when error prop is provided", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} error="Invalid time" />);
    const input = screen.getByLabelText("Start");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid time");
  });

  it("does not show error state when error prop is absent", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} />);
    const input = screen.getByLabelText("Start");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("displays required indicator when required", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
