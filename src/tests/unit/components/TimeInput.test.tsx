import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
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

describe("TimeInput AM/PM select", () => {
  function getSelect(label = "Start AM/PM") {
    return screen.getByRole("combobox", { name: label }) as HTMLSelectElement;
  }

  it("renders a native select with — / AM / PM options", () => {
    render(<TimeInput label="Start" value="10:00" onChange={() => {}} />);
    const select = getSelect();
    expect(select.tagName).toBe("SELECT");
    const options = within(select).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(["—", "AM", "PM"]);
    expect(select).toHaveValue("");
  });

  it("disables the selector when the input is empty", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} />);
    expect(getSelect()).toBeDisabled();
  });

  it("enables the selector when the input is non-empty", () => {
    render(<TimeInput label="Start" value="10:00" onChange={() => {}} />);
    expect(getSelect()).not.toBeDisabled();
  });

  it("derives PM from a typed value (10:00 PM shows PM)", () => {
    render(<TimeInput label="Start" value="10:00 PM" onChange={() => {}} />);
    expect(getSelect()).toHaveValue("PM");
  });

  it("derives AM from a typed value (6 am shows AM)", () => {
    render(<TimeInput label="Start" value="6 am" onChange={() => {}} />);
    expect(getSelect()).toHaveValue("AM");
  });

  it("shows no period for 24-hour input (18:00)", () => {
    render(<TimeInput label="Start" value="18:00" onChange={() => {}} />);
    expect(getSelect()).toHaveValue("");
  });

  it("shows no period for invalid input", () => {
    render(<TimeInput label="Start" value="abc" onChange={() => {}} />);
    expect(getSelect()).toHaveValue("");
  });

  it("selecting PM on 10:00 produces 10:00 PM", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="10:00" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(onChange).toHaveBeenCalledWith("10:00 PM");
  });

  it("selecting AM on 10:00 PM produces 10:00 AM", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="10:00 PM" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "AM" } });
    expect(onChange).toHaveBeenCalledWith("10:00 AM");
  });

  it("selecting PM on hour-only text rescues it (6 → 6:00 PM)", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="6" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(onChange).toHaveBeenCalledWith("6:00 PM");
  });

  it("selecting PM on 24-hour out-of-range hour converts (18:00 → 6:00 PM)", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="18:00" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(onChange).toHaveBeenCalledWith("6:00 PM");
  });

  it("selecting AM on 18:00 is a no-op (never invents a time)", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="18:00" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "AM" } });
    expect(onChange).toHaveBeenCalledWith("18:00");
  });

  it("removing the period converts to 24-hour (6 pm → 18:00)", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="6 pm" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith("18:00");
  });

  it("removing the period from 10:00 PM produces 22:00", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="10:00 PM" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith("22:00");
  });

  it("does not turn invalid text valid via the select (25 + PM stays 25)", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="25" onChange={onChange} />);
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(onChange).toHaveBeenCalledWith("25");
  });

  it("keeps the text input passthrough intact (raw typed value)", () => {
    const onChange = vi.fn();
    render(<TimeInput label="Start" value="" onChange={onChange} />);
    const input = screen.getByLabelText("Start");
    fireEvent.change(input, { target: { value: "10:00 PM" } });
    expect(onChange).toHaveBeenCalledWith("10:00 PM");
  });

  it("links the error to both input and select via aria-describedby", () => {
    render(
      <TimeInput label="Start" value="10:00" onChange={() => {}} error="Invalid time" />,
    );
    const input = screen.getByLabelText("Start");
    const select = getSelect();
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(select.getAttribute("aria-describedby")).toBe(describedBy);
    expect(document.getElementById(describedBy!)).toHaveTextContent("Invalid time");
  });
});

describe("TimeInput defaultPeriod", () => {
  function getSelect(label = "Start AM/PM") {
    return screen.getByRole("combobox", { name: label }) as HTMLSelectElement;
  }

  function getInput() {
    return screen.getByLabelText("Start") as HTMLInputElement;
  }

  it("empty + defaultPeriod AM → selector shows AM and is enabled", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} defaultPeriod="AM" />);
    const select = getSelect();
    expect(select).toHaveValue("AM");
    expect(select).not.toBeDisabled();
    expect(getInput()).toHaveValue("");
  });

  it("empty + defaultPeriod PM → selector shows PM and is enabled", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} defaultPeriod="PM" />);
    const select = getSelect();
    expect(select).toHaveValue("PM");
    expect(select).not.toBeDisabled();
    expect(getInput()).toHaveValue("");
  });

  it("changing the period on an empty field keeps the text empty (no fabricated time)", () => {
    const onChange = vi.fn();
    render(
      <TimeInput label="Start" value="" onChange={onChange} defaultPeriod="AM" />,
    );
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(getSelect()).toHaveValue("PM");
    expect(onChange).not.toHaveBeenCalled();
    expect(getInput()).toHaveValue("");
  });

  it("9:00 + explicit AM → 9:00 AM", () => {
    const onChange = vi.fn();
    render(
      <TimeInput label="Start" value="9:00" onChange={onChange} defaultPeriod="AM" />,
    );
    fireEvent.change(getSelect(), { target: { value: "AM" } });
    expect(onChange).toHaveBeenCalledWith("9:00 AM");
  });

  it("9:00 + explicit PM → 9:00 PM", () => {
    const onChange = vi.fn();
    render(
      <TimeInput label="Start" value="9:00" onChange={onChange} defaultPeriod="AM" />,
    );
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(onChange).toHaveBeenCalledWith("9:00 PM");
  });

  it("5:30 + explicit PM → 5:30 PM", () => {
    const onChange = vi.fn();
    render(
      <TimeInput label="Start" value="5:30" onChange={onChange} defaultPeriod="PM" />,
    );
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(onChange).toHaveBeenCalledWith("5:30 PM");
  });

  it("typing 9:00 does not auto-rewrite to 9:00 AM (default stays UI-only)", () => {
    function Harness() {
      const [v, setV] = useState("");
      return (
        <TimeInput label="Start" value={v} onChange={setV} defaultPeriod="AM" />
      );
    }
    render(<Harness />);
    fireEvent.change(getInput(), { target: { value: "9:00" } });
    expect(getInput()).toHaveValue("9:00");
    expect(getInput()).not.toHaveValue("9:00 AM");
    expect(getSelect()).toHaveValue("");
  });

  it("explicit 9:00 AM → selector AM (derived wins over defaultPeriod)", () => {
    render(
      <TimeInput label="Start" value="9:00 AM" onChange={() => {}} defaultPeriod="PM" />,
    );
    expect(getSelect()).toHaveValue("AM");
    expect(getInput()).toHaveValue("9:00 AM");
  });

  it("explicit 5:30 PM → selector PM", () => {
    render(
      <TimeInput label="Start" value="5:30 PM" onChange={() => {}} defaultPeriod="AM" />,
    );
    expect(getSelect()).toHaveValue("PM");
  });

  it("24-hour 18:00 does not become 18:00 PM (selector shows no period)", () => {
    const onChange = vi.fn();
    render(
      <TimeInput label="Start" value="18:00" onChange={onChange} defaultPeriod="PM" />,
    );
    expect(getSelect()).toHaveValue("");
    expect(getInput()).toHaveValue("18:00");
    expect(onChange).not.toHaveBeenCalled();
  });

  const naturalInputs = [
    ["6 am", "AM"],
    ["6 pm", "PM"],
    ["10 am", "AM"],
    ["10 pm", "PM"],
  ] as const;

  for (const [typed, expected] of naturalInputs) {
    it(`natural input "${typed}" → selector ${expected}`, () => {
      render(
        <TimeInput label="Start" value={typed} onChange={() => {}} defaultPeriod="AM" />,
      );
      expect(getSelect()).toHaveValue(expected);
      expect(getInput()).toHaveValue(typed);
    });
  }

  it("without defaultPeriod keeps the legacy empty behavior (disabled, —)", () => {
    render(<TimeInput label="Start" value="" onChange={() => {}} />);
    const select = getSelect();
    expect(select).toHaveValue("");
    expect(select).toBeDisabled();
  });
});

describe("TimeInput defaultPeriod clearing (regression)", () => {
  function Harness({ defaultPeriod }: { defaultPeriod: "AM" | "PM" }) {
    const [v, setV] = useState("");
    return (
      <TimeInput
        label="Start"
        value={v}
        onChange={setV}
        defaultPeriod={defaultPeriod}
      />
    );
  }

  function getInput() {
    return screen.getByLabelText("Start") as HTMLInputElement;
  }

  function getSelect() {
    return screen.getByRole("combobox", { name: "Start AM/PM" }) as HTMLSelectElement;
  }

  it("default AM → type PM → manually clear → selector returns to AM", () => {
    render(<Harness defaultPeriod="AM" />);
    expect(getSelect()).toHaveValue("AM");

    fireEvent.change(getInput(), { target: { value: "9:00" } });
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(getInput()).toHaveValue("9:00 PM");
    expect(getSelect()).toHaveValue("PM");

    fireEvent.change(getInput(), { target: { value: "" } });
    expect(getInput()).toHaveValue("");
    expect(getSelect()).toHaveValue("AM");
  });

  it("default PM → type AM → manually clear → selector returns to PM", () => {
    render(<Harness defaultPeriod="PM" />);
    expect(getSelect()).toHaveValue("PM");

    fireEvent.change(getInput(), { target: { value: "5:30" } });
    fireEvent.change(getSelect(), { target: { value: "AM" } });
    expect(getInput()).toHaveValue("5:30 AM");
    expect(getSelect()).toHaveValue("AM");

    fireEvent.change(getInput(), { target: { value: "" } });
    expect(getInput()).toHaveValue("");
    expect(getSelect()).toHaveValue("PM");
  });

  it("clearing a directly-typed explicit time also returns to the default", () => {
    render(<Harness defaultPeriod="AM" />);

    fireEvent.change(getInput(), { target: { value: "9:00 PM" } });
    expect(getSelect()).toHaveValue("PM");

    fireEvent.change(getInput(), { target: { value: "" } });
    expect(getInput()).toHaveValue("");
    expect(getSelect()).toHaveValue("AM");
  });

  it("clearing after an empty-field period pick returns to the default", () => {
    render(<Harness defaultPeriod="AM" />);

    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(getSelect()).toHaveValue("PM");
    expect(getInput()).toHaveValue("");

    fireEvent.change(getInput(), { target: { value: "9:00" } });
    fireEvent.change(getInput(), { target: { value: "" } });
    expect(getInput()).toHaveValue("");
    expect(getSelect()).toHaveValue("AM");
  });

  it("empty field value remains \"\" after every period change", () => {
    render(<Harness defaultPeriod="PM" />);
    fireEvent.change(getSelect(), { target: { value: "AM" } });
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(getInput()).toHaveValue("");
  });

  it("changing AM/PM while empty never calls onChange with a fabricated value", () => {
    const onChange = vi.fn();
    render(
      <TimeInput
        label="Start"
        value=""
        onChange={onChange}
        defaultPeriod="AM"
      />,
    );
    fireEvent.change(getSelect(), { target: { value: "PM" } });
    expect(onChange).not.toHaveBeenCalled();
    expect(getInput()).toHaveValue("");
  });
});
