import { describe, it, expect } from "vitest";
import {
  parseMilitaryTime,
  toTimeRepresentations,
} from "@/lib/time/military-time";
import type { TimeRepresentations } from "@/lib/time/military-time";

function convert(input: string): TimeRepresentations {
  const parsed = parseMilitaryTime(input);
  if (!parsed.ok) {
    throw new Error(`Expected "${input}" to parse: ${parsed.error.message}`);
  }
  return toTimeRepresentations(parsed.value);
}

describe("parseMilitaryTime — compact military input", () => {
  it("converts 1430 to all three representations", () => {
    expect(convert("1430")).toEqual({
      military: "1430",
      hour24: "14:30",
      hour12: "2:30 PM",
    });
  });

  it("converts 0900 to all three representations", () => {
    expect(convert("0900")).toEqual({
      military: "0900",
      hour24: "09:00",
      hour12: "9:00 AM",
    });
  });

  it("converts 0000 (midnight)", () => {
    expect(convert("0000")).toEqual({
      military: "0000",
      hour24: "00:00",
      hour12: "12:00 AM",
    });
  });

  it("converts 1200 (noon)", () => {
    expect(convert("1200")).toEqual({
      military: "1200",
      hour24: "12:00",
      hour12: "12:00 PM",
    });
  });

  it("converts 2359", () => {
    expect(convert("2359")).toEqual({
      military: "2359",
      hour24: "23:59",
      hour12: "11:59 PM",
    });
  });

  it.each([
    ["0000", "12:00 AM"],
    ["0030", "12:30 AM"],
    ["0100", "1:00 AM"],
    ["0900", "9:00 AM"],
    ["1200", "12:00 PM"],
    ["1230", "12:30 PM"],
    ["1300", "1:00 PM"],
    ["1430", "2:30 PM"],
    ["1800", "6:00 PM"],
    ["2300", "11:00 PM"],
  ])("converts compact %s to %s", (military, expected12Hour) => {
    expect(convert(military).hour12).toBe(expected12Hour);
  });

  it("ignores surrounding whitespace", () => {
    expect(convert("  1430  ").military).toBe("1430");
  });
});

describe("parseMilitaryTime — colon (24-hour) input", () => {
  it.each([
    ["14:30", "1430", "14:30", "2:30 PM"],
    ["09:00", "0900", "09:00", "9:00 AM"],
    ["00:00", "0000", "00:00", "12:00 AM"],
    ["12:00", "1200", "12:00", "12:00 PM"],
    ["23:59", "2359", "23:59", "11:59 PM"],
  ])("converts %s", (input, military, hour24, hour12) => {
    expect(convert(input)).toEqual({ military, hour24, hour12 });
  });

  it("keeps seconds in the 24-hour and 12-hour output", () => {
    const result = convert("14:30:15");
    expect(result.military).toBe("1430");
    expect(result.hour24).toBe("14:30:15");
    expect(result.hour12).toBe("2:30:15 PM");
  });
});

describe("parseMilitaryTime — 12-hour input", () => {
  it.each([
    ["2:30 PM", "1430", "14:30", "2:30 PM"],
    ["9:00 AM", "0900", "09:00", "9:00 AM"],
    ["12:00 AM", "0000", "00:00", "12:00 AM"],
    ["12:00 PM", "1200", "12:00", "12:00 PM"],
    ["11:59 PM", "2359", "23:59", "11:59 PM"],
  ])("converts %s", (input, military, hour24, hour12) => {
    expect(convert(input)).toEqual({ military, hour24, hour12 });
  });

  it("accepts lowercase am/pm", () => {
    expect(convert("2:30 pm").military).toBe("1430");
    expect(convert("2:30 am").military).toBe("0230");
    expect(convert("9:00 am").hour12).toBe("9:00 AM");
  });

  it("accepts uppercase AM/PM and mixed case", () => {
    expect(convert("2:30 PM").military).toBe("1430");
    expect(convert("2:30 Am").hour12).toBe("2:30 AM");
  });
});

describe("parseMilitaryTime — invalid input", () => {
  it.each([
    "2500",
    "2460",
    "2360",
    "1260",
    "1360",
    "25:00",
    "24:01",
    "13:70",
    "6:90 PM",
    "13 PM",
    "0 PM",
    "12:75 PM",
    "9999",
    "abcd",
  ])("rejects %s with an error result (no throw)", (input) => {
    const parsed = parseMilitaryTime(input);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message.length).toBeGreaterThan(0);
    }
  });

  it("rejects empty input", () => {
    const parsed = parseMilitaryTime("");
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.code).toBe("EMPTY_INPUT");
    }
  });

  it("rejects three-digit input such as 100", () => {
    expect(parseMilitaryTime("100").ok).toBe(false);
  });
});

describe("toTimeRepresentations — edges", () => {
  it("always renders military time with four digits", () => {
    expect(convert("1:00 AM").military).toBe("0100");
    expect(convert("1:05 AM").military).toBe("0105");
    expect(convert("1:05 PM").military).toBe("1305");
    expect(convert("12:05 AM").military).toBe("0005");
  });

  it("maps midnight and noon correctly", () => {
    expect(convert("12:00 AM")).toEqual({
      military: "0000",
      hour24: "00:00",
      hour12: "12:00 AM",
    });
    expect(convert("12:00 PM")).toEqual({
      military: "1200",
      hour24: "12:00",
      hour12: "12:00 PM",
    });
  });

  it("converts 1:00 PM to 1300", () => {
    expect(convert("1:00 PM").military).toBe("1300");
  });
});
