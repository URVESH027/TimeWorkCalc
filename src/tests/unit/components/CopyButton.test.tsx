import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CopyButton } from "@/components/calculator/actions/CopyButton";

describe("CopyButton", () => {
  it("renders with default label", () => {
    render(<CopyButton text="test" />);
    expect(screen.getByRole("button")).toHaveTextContent("Copy result");
  });

  it("renders with custom label", () => {
    render(<CopyButton text="test" label="Copy text" />);
    expect(screen.getByRole("button")).toHaveTextContent("Copy text");
  });

  it("shows copied state after click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyButton text="8 hours" />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toHaveTextContent("Copied");
    });
  });

  it("announces copy feedback through a polite status region", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyButton text="8 hours" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("");

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(status).toHaveTextContent("Copied to clipboard");
    });
  });
});
