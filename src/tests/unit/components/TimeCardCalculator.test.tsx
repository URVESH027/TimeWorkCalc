import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { TimeCardCalculator } from "@/components/time-card/TimeCardCalculator";

function getMondayRow(): HTMLTableRowElement {
  const dayHeader = screen.getByRole("rowheader", { name: "Monday" });
  return dayHeader.closest("tr") as HTMLTableRowElement;
}

function getMondayInputs() {
  const inputs = getMondayRow().querySelectorAll("input");
  return {
    clockIn: inputs[0] as HTMLInputElement,
    clockOut: inputs[1] as HTMLInputElement,
    breakMin: inputs[2] as HTMLInputElement,
  };
}

function getMondaySelects() {
  const selects = getMondayRow().querySelectorAll("select");
  return {
    clockIn: selects[0] as HTMLSelectElement,
    clockOut: selects[1] as HTMLSelectElement,
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

  it("empty row: Clock In selector defaults to AM, Clock Out to PM, both enabled", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();
    const selects = getMondaySelects();

    expect(selects.clockIn).toHaveValue("AM");
    expect(selects.clockOut).toHaveValue("PM");
    expect(selects.clockIn).not.toBeDisabled();
    expect(selects.clockOut).not.toBeDisabled();
    expect(clockIn).toHaveValue("");
    expect(clockOut).toHaveValue("");
  });

  it("empty row with only the period changed is not calculated", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(selects.clockIn, { target: { value: "PM" } });

    expect(selects.clockIn).toHaveValue("PM");
    expect(clockIn).toHaveValue("");
    expect(clockOut).toHaveValue("");
    expect(
      screen.getByText("Enter clock-in and clock-out times to see your total."),
    ).toBeInTheDocument();
  });

  it("Clock In: 9:00 + explicit AM → 9:00 AM", () => {
    render(<TimeCardCalculator />);
    const { clockIn } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockIn, { target: { value: "9:00" } });
    fireEvent.change(selects.clockIn, { target: { value: "AM" } });

    expect(clockIn).toHaveValue("9:00 AM");
    expect(selects.clockIn).toHaveValue("AM");
  });

  it("Clock In: 9:00 + explicit PM → 9:00 PM", () => {
    render(<TimeCardCalculator />);
    const { clockIn } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockIn, { target: { value: "9:00" } });
    fireEvent.change(selects.clockIn, { target: { value: "PM" } });

    expect(clockIn).toHaveValue("9:00 PM");
  });

  it("Clock Out: 5:30 + explicit PM → 5:30 PM", () => {
    render(<TimeCardCalculator />);
    const { clockOut } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockOut, { target: { value: "5:30" } });
    fireEvent.change(selects.clockOut, { target: { value: "PM" } });

    expect(clockOut).toHaveValue("5:30 PM");
  });

  it("explicit times drive the selectors (9:00 AM → AM, 5:30 PM → PM)", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(clockOut, { target: { value: "5:30 PM" } });

    expect(selects.clockIn).toHaveValue("AM");
    expect(selects.clockOut).toHaveValue("PM");
  });

  it("24-hour clock out (18:00) does not become 18:00 PM", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(clockOut, { target: { value: "18:00" } });

    expect(clockOut).toHaveValue("18:00");
    expect(selects.clockOut).toHaveValue("");
    expect(screen.getByText("9h")).toBeInTheDocument();
  });

  it("natural hour-only input still calculates (10 am → 6 pm = 8h)", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();

    fireEvent.change(clockIn, { target: { value: "10 am" } });
    fireEvent.change(clockOut, { target: { value: "6 pm" } });

    expect(screen.getByText("8h")).toBeInTheDocument();
    expect(screen.getByText("480 minutes")).toBeInTheDocument();
  });

  it("selectors exist for every active day row", () => {
    render(<TimeCardCalculator />);
    const selects = document.querySelectorAll("select");
    expect(selects.length).toBe(10);
  });

  it("reset restores the default AM/PM selections on cleared rows", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockIn, { target: { value: "9:00" } });
    fireEvent.change(selects.clockIn, { target: { value: "PM" } });
    fireEvent.change(clockOut, { target: { value: "5:30" } });
    fireEvent.change(selects.clockOut, { target: { value: "AM" } });
    expect(clockIn).toHaveValue("9:00 PM");

    fireEvent.click(screen.getByText("Reset"));

    expect(clockIn).toHaveValue("");
    expect(clockOut).toHaveValue("");
    expect(selects.clockIn).toHaveValue("AM");
    expect(selects.clockOut).toHaveValue("PM");
  });

  it("manually clearing a populated Clock In returns its selector to AM", () => {
    render(<TimeCardCalculator />);
    const { clockIn } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockIn, { target: { value: "9:00" } });
    fireEvent.change(selects.clockIn, { target: { value: "PM" } });
    expect(clockIn).toHaveValue("9:00 PM");
    expect(selects.clockIn).toHaveValue("PM");

    fireEvent.change(clockIn, { target: { value: "" } });

    expect(clockIn).toHaveValue("");
    expect(selects.clockIn).toHaveValue("AM");
    expect(
      screen.getByText("Enter clock-in and clock-out times to see your total."),
    ).toBeInTheDocument();
  });

  it("manually clearing a populated Clock Out returns its selector to PM", () => {
    render(<TimeCardCalculator />);
    const { clockIn, clockOut } = getMondayInputs();
    const selects = getMondaySelects();

    fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
    fireEvent.change(clockOut, { target: { value: "5:30" } });
    fireEvent.change(selects.clockOut, { target: { value: "AM" } });
    expect(clockOut).toHaveValue("5:30 AM");
    expect(selects.clockOut).toHaveValue("AM");

    fireEvent.change(clockOut, { target: { value: "" } });

    expect(clockOut).toHaveValue("");
    expect(selects.clockOut).toHaveValue("PM");
    expect(
      screen.getByText("Enter clock-in and clock-out times to see your total."),
    ).toBeInTheDocument();
  });

  describe("compact weekly table", () => {
    const COLUMN_HEADERS = ["Day", "In", "Out", "Break", "Worked", "Action"];

    it("renders a semantic table with an sr-only caption", () => {
      render(<TimeCardCalculator />);
      const table = screen.getByRole("table");
      const caption = table.querySelector("caption");
      expect(caption).toBeInTheDocument();
      expect(caption!.className).toContain("sr-only");
      expect(caption).toHaveTextContent(/weekly time card/i);
    });

    it("renders all column headers", () => {
      render(<TimeCardCalculator />);
      for (const name of COLUMN_HEADERS) {
        expect(screen.getByRole("columnheader", { name })).toBeInTheDocument();
      }
    });

    it("renders header row plus 5 day rows with Monday–Friday row headers", () => {
      render(<TimeCardCalculator />);
      expect(screen.getAllByRole("row")).toHaveLength(6);
      for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) {
        expect(screen.getByRole("rowheader", { name: day })).toBeInTheDocument();
      }
      expect(screen.queryByRole("rowheader", { name: "Saturday" })).not.toBeInTheDocument();
      expect(screen.queryByRole("rowheader", { name: "Sunday" })).not.toBeInTheDocument();
    });

    it("wraps the table in an inner-scroll container so the page never overflows", () => {
      render(<TimeCardCalculator />);
      const table = screen.getByRole("table");
      const wrapper = table.parentElement!;
      expect(wrapper.className).toContain("min-w-0");
      expect(wrapper.className).toContain("max-w-full");
      expect(wrapper.className).toContain("overflow-x-auto");
      expect(table.className).toContain("min-w-");
    });

    it("shows the daily total inside the row's Worked cell", () => {
      render(<TimeCardCalculator />);
      const { clockIn, clockOut, breakMin } = getMondayInputs();

      fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
      fireEvent.change(clockOut, { target: { value: "5:30 PM" } });
      fireEvent.change(breakMin, { target: { value: "30" } });

      const row = getMondayRow();
      expect(within(row).getByText("8h")).toBeInTheDocument();
      expect(within(row).getByText("8.00h")).toBeInTheDocument();
    });

    it("renders an error row with colSpan=6 when a calculation fails", () => {
      render(<TimeCardCalculator />);
      const { clockIn, clockOut, breakMin } = getMondayInputs();

      fireEvent.change(clockIn, { target: { value: "9:00 AM" } });
      fireEvent.change(clockOut, { target: { value: "10:00 AM" } });
      fireEvent.change(breakMin, { target: { value: "120" } });

      const alert = screen.getByRole("alert");
      const cell = alert.closest("td")!;
      expect(cell).toHaveAttribute("colspan", "6");
    });

    it("adds Saturday and Sunday via Add day", () => {
      render(<TimeCardCalculator />);
      fireEvent.click(screen.getByText("+ Add day"));
      expect(screen.getByRole("rowheader", { name: "Saturday" })).toBeInTheDocument();

      fireEvent.click(screen.getByText("+ Add day"));
      expect(screen.getByRole("rowheader", { name: "Sunday" })).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(8);
    });

    it("removes a day via its Remove button", () => {
      render(<TimeCardCalculator />);
      expect(screen.getByRole("rowheader", { name: "Tuesday" })).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Remove Tuesday" }));

      expect(screen.queryByRole("rowheader", { name: "Tuesday" })).not.toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(5);
    });

    it("keeps Clock In defaulting to AM and Clock Out to PM inside the table", () => {
      render(<TimeCardCalculator />);
      const { clockIn, clockOut } = getMondayInputs();
      const selects = getMondaySelects();

      expect(selects.clockIn).toHaveValue("AM");
      expect(selects.clockOut).toHaveValue("PM");
      expect(clockIn).toHaveAttribute("aria-invalid", "false");
      expect(clockOut).toHaveAttribute("aria-invalid", "false");
    });
  });
});
