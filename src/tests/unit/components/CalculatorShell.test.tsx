import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalculatorShell } from "@/components/calculator/CalculatorShell";

const BREADCRUMBS = [
  { label: "Home", href: "/" },
  { label: "Hours Calculator", href: "/hours-calculator" },
];

function getLdScripts(): HTMLScriptElement[] {
  return Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
  );
}

describe("CalculatorShell", () => {
  it("renders title, description, and children", () => {
    render(
      <CalculatorShell title="Test Calculator" description="A test shell.">
        <p>child content</p>
      </CalculatorShell>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Calculator",
    );
    expect(screen.getByText("A test shell.")).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("exposes the skip-link target on its main element", () => {
    render(
      <CalculatorShell title="Test">
        <span />
      </CalculatorShell>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("renders breadcrumb navigation UI", () => {
    render(
      <CalculatorShell title="Test" breadcrumbs={BREADCRUMBS}>
        <span />
      </CalculatorShell>,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByText("Hours Calculator")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("emits exactly one valid BreadcrumbList JSON-LD script", () => {
    render(
      <CalculatorShell title="Test" breadcrumbs={BREADCRUMBS}>
        <span />
      </CalculatorShell>,
    );

    const scripts = getLdScripts();
    expect(scripts).toHaveLength(1);

    const data = JSON.parse(scripts[0].innerHTML);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("BreadcrumbList");
    expect(data.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.timeworkcalc.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hours Calculator",
        item: "https://www.timeworkcalc.com/hours-calculator",
      },
    ]);
  });

  it("emits no JSON-LD when breadcrumbs are absent", () => {
    render(
      <CalculatorShell title="Test">
        <span />
      </CalculatorShell>,
    );
    expect(getLdScripts()).toHaveLength(0);
    expect(
      screen.queryByRole("navigation", { name: "Breadcrumb" }),
    ).not.toBeInTheDocument();
  });

  it("breadcrumb JSON-LD and UI stay in sync (same source)", () => {
    render(
      <CalculatorShell title="Test" breadcrumbs={BREADCRUMBS}>
        <span />
      </CalculatorShell>,
    );

    const data = JSON.parse(getLdScripts()[0].innerHTML);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    for (const item of data.itemListElement) {
      expect(nav.textContent).toContain(item.name);
    }
  });
});
