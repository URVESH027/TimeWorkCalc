import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MilitaryTimeConverter } from "@/components/military-time/MilitaryTimeConverter";

function getInput() {
  return screen.getByRole("textbox", { name: /time/i }) as HTMLInputElement;
}

function setTime(value: string) {
  fireEvent.change(getInput(), { target: { value } });
}

describe("MilitaryTimeConverter", () => {
  it("shows the empty state before any input", () => {
    render(<MilitaryTimeConverter />);

    expect(
      screen.getByText(
        "Enter a time to see the military, 24-hour, and 12-hour versions.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("converts compact military input 1430", () => {
    render(<MilitaryTimeConverter />);
    setTime("1430");

    const region = screen.getByRole("region", { name: "Results" });
    expect(screen.getByText("Military time")).toBeInTheDocument();
    expect(screen.getByText("1430")).toBeInTheDocument();
    expect(screen.getByText("24-hour time")).toBeInTheDocument();
    expect(screen.getByText("14:30")).toBeInTheDocument();
    expect(screen.getByText("12-hour time")).toBeInTheDocument();
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
    expect(region).toHaveTextContent("1430");
    expect(
      screen.queryByText(
        "Enter a time to see the military, 24-hour, and 12-hour versions.",
      ),
    ).not.toBeInTheDocument();
  });

  it("converts midnight (0000)", () => {
    render(<MilitaryTimeConverter />);
    setTime("0000");

    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveTextContent("0000");
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("12:00 AM")).toBeInTheDocument();
  });

  it("converts noon (1200)", () => {
    render(<MilitaryTimeConverter />);
    setTime("1200");

    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveTextContent("1200");
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
  });

  it("auto-detects 12-hour input", () => {
    render(<MilitaryTimeConverter />);
    setTime("9:00 AM");

    expect(screen.getByText("0900")).toBeInTheDocument();
    expect(screen.getByText("9:00 AM")).toBeInTheDocument();
  });

  it("shows a single alert and no result for an invalid hour", () => {
    render(<MilitaryTimeConverter />);
    setTime("2500");

    expect(screen.getByRole("alert")).toHaveTextContent(/invalid military time/i);
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy result" })).toBeNull();
  });

  it("shows a format hint for unparseable text", () => {
    render(<MilitaryTimeConverter />);
    setTime("abcd");

    expect(screen.getByRole("alert")).toHaveTextContent(
      /Enter a time like 1430, 14:30, or 2:30 PM\./,
    );
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
  });

  it("recalculates when the input changes", () => {
    render(<MilitaryTimeConverter />);
    setTime("0900");
    expect(screen.getByText("9:00 AM")).toBeInTheDocument();

    setTime("1200");
    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
    expect(screen.queryByText("9:00 AM")).not.toBeInTheDocument();
    expect(screen.getByText("1200")).toBeInTheDocument();
  });

  it("copies all three representations", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<MilitaryTimeConverter />);
    setTime("1430");
    fireEvent.click(screen.getByRole("button", { name: "Copy result" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        [
          "Military time: 1430",
          "24-hour time: 14:30",
          "12-hour time: 2:30 PM",
        ].join("\n"),
      );
    });
  });

  it("resets to the empty state", () => {
    render(<MilitaryTimeConverter />);
    setTime("1430");
    expect(screen.getByRole("region", { name: "Results" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(getInput().value).toBe("");
    expect(
      screen.getByText(
        "Enter a time to see the military, 24-hour, and 12-hour versions.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Results" }),
    ).not.toBeInTheDocument();
  });
});
