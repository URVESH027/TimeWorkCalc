import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WorkHoursInYearCalculator } from "@/components/work-hours-in-year/WorkHoursInYearCalculator";

function getInput(label: string) {
  return screen.getByLabelText(label) as HTMLInputElement;
}

function setField(label: string, value: string) {
  fireEvent.change(getInput(label), { target: { value } });
}

describe("WorkHoursInYearCalculator", () => {
  it("shows the default 40 × 52 result immediately", () => {
    render(<WorkHoursInYearCalculator />);

    const region = screen.getByRole("region", { name: "Results" });
    expect(screen.getByText("Worked hours per year")).toBeInTheDocument();
    expect(screen.getByText("Scheduled hours per year")).toBeInTheDocument();
    expect(screen.getByText("Holiday/PTO hours")).toBeInTheDocument();
    expect(screen.getByText("Average hours per month")).toBeInTheDocument();

    const worked = screen.getAllByText("2,080 hours");
    expect(worked.length).toBe(2);
    expect(screen.getByText("173.33 hours")).toBeInTheDocument();
    expect(region).toHaveTextContent("2,080 hours");
  });

  it("renders all five inputs with default values", () => {
    render(<WorkHoursInYearCalculator />);

    expect(getInput("Hours per week").value).toBe("40");
    expect(getInput("Weeks per year").value).toBe("52");
    expect(getInput("Hours per workday").value).toBe("8");
    expect(getInput("Paid holidays per year (days)").value).toBe("0");
    expect(getInput("PTO / vacation days (days)").value).toBe("0");
  });

  it("explains that holidays and PTO are deductions", () => {
    render(<WorkHoursInYearCalculator />);
    expect(
      screen.getByText(/deducted from your scheduled annual hours/i),
    ).toBeInTheDocument();
  });

  it("recalculates when weekly hours change", () => {
    render(<WorkHoursInYearCalculator />);
    setField("Hours per week", "20");

    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveTextContent("1,040 hours");
    expect(screen.queryByText("173.33 hours")).not.toBeInTheDocument();
    expect(screen.getByText("86.67 hours")).toBeInTheDocument();
  });

  it("deducts paid holidays from scheduled hours", () => {
    render(<WorkHoursInYearCalculator />);
    setField("Paid holidays per year (days)", "10");

    const region = screen.getByRole("region", { name: "Results" });
    expect(screen.getByText("2,000 hours")).toBeInTheDocument();
    expect(screen.getByText("80 hours")).toBeInTheDocument();
    expect(region).toHaveTextContent("2,080 hours");
  });

  it("deducts PTO days from scheduled hours", () => {
    render(<WorkHoursInYearCalculator />);
    setField("PTO / vacation days (days)", "15");

    expect(screen.getByText("1,960 hours")).toBeInTheDocument();
    expect(screen.getByText("120 hours")).toBeInTheDocument();
  });

  it("shows an error and no result for negative values", () => {
    render(<WorkHoursInYearCalculator />);
    setField("Paid holidays per year (days)", "-5");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Paid holidays cannot be negative.",
    );
    expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument();
  });

  it("shows an error when a required field is cleared", () => {
    render(<WorkHoursInYearCalculator />);
    setField("Hours per week", "");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Hours per week is required.",
    );
    expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument();
  });

  it("shows the empty state when all fields are cleared", () => {
    render(<WorkHoursInYearCalculator />);
    setField("Hours per week", "");
    setField("Weeks per year", "");
    setField("Hours per workday", "");
    setField("Paid holidays per year (days)", "");
    setField("PTO / vacation days (days)", "");

    expect(
      screen.getByText("Enter your weekly schedule to see your annual work hours."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Results" })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("resets back to the default schedule", () => {
    render(<WorkHoursInYearCalculator />);
    setField("Hours per week", "10");
    expect(screen.queryByText("2,080 hours")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(getInput("Hours per week").value).toBe("40");
    expect(screen.getAllByText("2,080 hours").length).toBe(2);
    expect(screen.getByText("173.33 hours")).toBeInTheDocument();
  });

  it("copies the result values", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<WorkHoursInYearCalculator />);
    fireEvent.click(screen.getByRole("button", { name: "Copy result" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        [
          "Worked Hours Per Year: 2,080 hours",
          "Scheduled Hours Per Year: 2,080 hours",
          "Holiday/PTO Hours: 0 hours",
          "Average Hours Per Month: 173.33 hours",
        ].join("\n"),
      );
    });
  });
});
