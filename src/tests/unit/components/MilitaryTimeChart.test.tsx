import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MilitaryTimeChart } from "@/components/military-time/MilitaryTimeChart";

describe("MilitaryTimeChart", () => {
  it("renders a semantic table with a caption", () => {
    render(<MilitaryTimeChart />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Military time conversion chart",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: /military time conversion chart/i }),
    ).toBeInTheDocument();
  });

  it("renders the three column headers", () => {
    render(<MilitaryTimeChart />);

    expect(
      screen.getByRole("columnheader", { name: "Military" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "24-hour" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "12-hour" }),
    ).toBeInTheDocument();
  });

  it("renders all 24 hours (25 rows including the header)", () => {
    render(<MilitaryTimeChart />);

    expect(screen.getAllByRole("row")).toHaveLength(25);
  });

  it("maps midnight (0000), 1300, and 2300 correctly", () => {
    render(<MilitaryTimeChart />);
    const rows = screen.getAllByRole("row");

    const midnight = within(rows[1]);
    expect(midnight.getByText("0000")).toBeInTheDocument();
    expect(midnight.getByText("00:00")).toBeInTheDocument();
    expect(midnight.getByText("12:00 AM")).toBeInTheDocument();

    const afternoon = within(rows[14]);
    expect(afternoon.getByText("1300")).toBeInTheDocument();
    expect(afternoon.getByText("13:00")).toBeInTheDocument();
    expect(afternoon.getByText("1:00 PM")).toBeInTheDocument();

    const lastHour = within(rows[24]);
    expect(lastHour.getByText("2300")).toBeInTheDocument();
    expect(lastHour.getByText("23:00")).toBeInTheDocument();
    expect(lastHour.getByText("11:00 PM")).toBeInTheDocument();
  });

  it("uses an internal scroll wrapper instead of page overflow", () => {
    const { container } = render(<MilitaryTimeChart />);

    const scrollWrapper = container.querySelector(".overflow-x-auto");
    expect(scrollWrapper).not.toBeNull();
    expect(scrollWrapper?.querySelector("table")).not.toBeNull();
  });
});
