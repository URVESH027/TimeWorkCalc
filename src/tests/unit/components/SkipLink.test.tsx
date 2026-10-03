import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipLink } from "@/components/layout/SkipLink";

describe("SkipLink", () => {
  it("links to the main content target", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("is present in the accessibility tree before focus", () => {
    render(<SkipLink />);
    const link = screen.getByRole("link", { name: "Skip to main content" });
    expect(link).toBeInTheDocument();
    expect(link.className).toContain("sr-only");
  });
});
