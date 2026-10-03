import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultCard } from "@/components/calculator/results/ResultCard";

describe("ResultCard", () => {
  it("renders primary value", () => {
    render(
      <ResultCard primaryLabel="Result" primaryValue="8 hours 30 minutes" />,
    );
    expect(screen.getByText("8 hours 30 minutes")).toBeInTheDocument();
  });

  it("renders primary label", () => {
    render(
      <ResultCard primaryLabel="Worked time" primaryValue="8 hours" />,
    );
    expect(screen.getByText("Worked time")).toBeInTheDocument();
  });

  it("renders secondary items", () => {
    render(
      <ResultCard
        primaryLabel="Result"
        primaryValue="8 hours"
        secondaryItems={[
          { label: "Decimal hours", value: "8.00 hours" },
          { label: "Minutes", value: "480 minutes" },
        ]}
      />,
    );
    expect(screen.getByText("Decimal hours")).toBeInTheDocument();
    expect(screen.getByText("8.00 hours")).toBeInTheDocument();
    expect(screen.getByText("Minutes")).toBeInTheDocument();
    expect(screen.getByText("480 minutes")).toBeInTheDocument();
  });

  it("renders without secondary items", () => {
    render(<ResultCard primaryLabel="Result" primaryValue="5h" />);
    expect(screen.queryByText("Decimal hours")).not.toBeInTheDocument();
  });

  it("acts as a polite live region for result updates", () => {
    const { rerender } = render(
      <ResultCard primaryLabel="Result" primaryValue="8 hours" />,
    );
    const region = screen.getByRole("region", { name: "Results" });
    expect(region).toHaveAttribute("aria-live", "polite");

    rerender(<ResultCard primaryLabel="Result" primaryValue="8 hours 30 minutes" />);
    expect(region).toHaveTextContent("8 hours 30 minutes");
    expect(screen.getAllByRole("region", { name: "Results" })).toHaveLength(1);
  });
});
