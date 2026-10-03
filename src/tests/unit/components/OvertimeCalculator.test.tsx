import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OvertimeCalculator } from "@/components/overtime/OvertimeCalculator";

function setField(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe("OvertimeCalculator — states", () => {
  it("shows the empty state by default (hourly rate empty)", () => {
    render(<OvertimeCalculator />);

    expect(
      screen.getByText(
        "Enter all four values to estimate overtime hours and gross pay.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders the four inputs with intended defaults", () => {
    render(<OvertimeCalculator />);

    expect(
      (screen.getByLabelText("Hourly rate") as HTMLInputElement).value,
    ).toBe("");
    expect(
      (screen.getByLabelText("Total hours worked this week") as HTMLInputElement)
        .value,
    ).toBe("40");
    expect(
      (screen.getByLabelText("Overtime threshold") as HTMLInputElement).value,
    ).toBe("40");
    expect(
      (screen.getByLabelText("Overtime multiplier") as HTMLInputElement).value,
    ).toBe("1.5");
  });
});

describe("OvertimeCalculator — calculation", () => {
  it("valid calculation: 45 hours at $20, threshold 40, 1.5×", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "45");

    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveTextContent("Total gross pay");
    expect(screen.getByText("$950.00")).toBeInTheDocument();
    expect(screen.getByText("Regular hours")).toBeInTheDocument();
    expect(screen.getByText("40 hours")).toBeInTheDocument();
    expect(screen.getByText("Overtime hours")).toBeInTheDocument();
    expect(screen.getByText("5 hours")).toBeInTheDocument();
    expect(screen.getByText("Regular pay")).toBeInTheDocument();
    expect(screen.getByText("$800.00")).toBeInTheDocument();
    expect(screen.getByText("Overtime rate")).toBeInTheDocument();
    expect(screen.getByText("$30.00")).toBeInTheDocument();
    expect(screen.getByText("Overtime pay")).toBeInTheDocument();
    expect(screen.getByText("$150.00")).toBeInTheDocument();
  });

  it("shows all six result labels", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");

    expect(screen.getByText("Total gross pay")).toBeInTheDocument();
    expect(screen.getByText("Regular hours")).toBeInTheDocument();
    expect(screen.getByText("Overtime hours")).toBeInTheDocument();
    expect(screen.getByText("Regular pay")).toBeInTheDocument();
    expect(screen.getByText("Overtime rate")).toBeInTheDocument();
    expect(screen.getByText("Overtime pay")).toBeInTheDocument();
  });

  it("recalculates when hours change", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "45");
    expect(screen.getByText("$950.00")).toBeInTheDocument();

    setField("Total hours worked this week", "50");
    expect(screen.getByText("$1100.00")).toBeInTheDocument();
    expect(screen.getByText("10 hours")).toBeInTheDocument();
    expect(screen.queryByText("$950.00")).not.toBeInTheDocument();
  });

  it("below-threshold result: 35 hours → no overtime", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "35");

    expect(screen.getByText("35 hours")).toBeInTheDocument();
    expect(screen.getByText("0 hours")).toBeInTheDocument();
    expect(screen.getAllByText("$700.00").length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText("$150.00")).not.toBeInTheDocument();
  });

  it("above-threshold result: 44 hours → 4 overtime hours", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "44");

    expect(screen.getByText("40 hours")).toBeInTheDocument();
    expect(screen.getByText("4 hours")).toBeInTheDocument();
    expect(screen.getByText("$920.00")).toBeInTheDocument();
  });

  it("custom threshold: 45 hours with threshold 44 → 1 overtime hour", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "45");
    setField("Overtime threshold", "44");

    expect(screen.getByText("44 hours")).toBeInTheDocument();
    expect(screen.getByText("1 hour")).toBeInTheDocument();
    expect(screen.getByText("$910.00")).toBeInTheDocument();
  });

  it("custom multiplier: 2× → overtime rate $40 and total $1000", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "45");
    setField("Overtime multiplier", "2");

    expect(screen.getByText("$40.00")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
    expect(screen.getByText("$1000.00")).toBeInTheDocument();
  });

  it("decimal hours: 42.5 → 2.5 overtime hours", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "42.5");

    expect(screen.getByText("40 hours")).toBeInTheDocument();
    expect(screen.getByText("2.5 hours")).toBeInTheDocument();
    expect(screen.getByText("$875.00")).toBeInTheDocument();
  });
});

describe("OvertimeCalculator — validation", () => {
  it("shows an alert for a negative hourly rate and no result", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "-5");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Hourly rate cannot be negative.",
    );
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Enter all four values to estimate overtime hours and gross pay.",
      ),
    ).not.toBeInTheDocument();
  });

  it("shows an alert for a zero overtime threshold", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Overtime threshold", "0");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Overtime threshold must be greater than 0.",
    );
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
  });

  it("shows an empty state when a required field is cleared", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "45");
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).toBeInTheDocument();

    setField("Hourly rate", "");

    expect(
      screen.getByText(
        "Enter all four values to estimate overtime hours and gross pay.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("OvertimeCalculator — copy and reset", () => {
  it("copies the full readable result text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "45");
    fireEvent.click(screen.getByRole("button", { name: "Copy result" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        [
          "Hourly rate: $20.00",
          "Hours worked: 45",
          "Overtime threshold: 40",
          "Overtime multiplier: 1.5x",
          "Regular hours: 40",
          "Overtime hours: 5",
          "Regular pay: $800.00",
          "Overtime rate: $30.00",
          "Overtime pay: $150.00",
          "Total gross pay: $950.00",
        ].join("\n"),
      );
    });
  });

  it("resets to the intended defaults and empty state", () => {
    render(<OvertimeCalculator />);
    setField("Hourly rate", "20");
    setField("Total hours worked this week", "45");
    setField("Overtime threshold", "44");
    setField("Overtime multiplier", "2");
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(
      (screen.getByLabelText("Hourly rate") as HTMLInputElement).value,
    ).toBe("");
    expect(
      (screen.getByLabelText("Total hours worked this week") as HTMLInputElement)
        .value,
    ).toBe("40");
    expect(
      (screen.getByLabelText("Overtime threshold") as HTMLInputElement).value,
    ).toBe("40");
    expect(
      (screen.getByLabelText("Overtime multiplier") as HTMLInputElement).value,
    ).toBe("1.5");
    expect(
      screen.getByText(
        "Enter all four values to estimate overtime hours and gross pay.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("OvertimeCalculator — scope wording", () => {
  it("shows the user-defined threshold disclaimer", () => {
    const { container } = render(<OvertimeCalculator />);

    expect(
      screen.getByText(
        /This calculator uses a user-defined weekly overtime threshold and multiplier\./,
      ),
    ).toBeInTheDocument();
    expect(container.textContent).toContain(
      "do not model every employer, state, or overtime rule.",
    );
  });

  it("makes no legal-rule claims", () => {
    const { container } = render(<OvertimeCalculator />);
    setField("Hourly rate", "20");

    expect(container.textContent ?? "").not.toMatch(
      /legally entitled|legally required|you are entitled|guaranteed by law|state law requires|must pay overtime/i,
    );
  });
});
