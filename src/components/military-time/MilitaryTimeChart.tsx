import { to12Hour, formatClockTime } from "@/lib/time";

const CHART_ROWS = Array.from({ length: 24 }, (_, hours) => {
  const padded = String(hours).padStart(2, "0");
  const hour12 = to12Hour({ hours, minutes: 0, seconds: 0, period: null });
  return {
    military: `${padded}00`,
    hour24: `${padded}:00`,
    hour12: formatClockTime(hour12.hours, hour12.minutes, hour12.period, false),
  };
});

export function MilitaryTimeChart() {
  return (
    <div id="conversion-chart">
      <h2 className="mb-2 text-lg font-semibold text-zinc-900">
        Military time conversion chart
      </h2>
      <p className="mb-3">
        Every hour of the day in military, 24-hour, and 12-hour formats:
      </p>
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Military time conversion chart for all 24 hours
          </caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th
                scope="col"
                className="px-4 py-2 font-medium text-zinc-700"
              >
                Military
              </th>
              <th
                scope="col"
                className="px-4 py-2 font-medium text-zinc-700"
              >
                24-hour
              </th>
              <th
                scope="col"
                className="px-4 py-2 font-medium text-zinc-700"
              >
                12-hour
              </th>
            </tr>
          </thead>
          <tbody>
            {CHART_ROWS.map((row) => (
              <tr
                key={row.military}
                className="border-b border-zinc-100 last:border-0"
              >
                <td className="px-4 py-1.5 tabular-nums">{row.military}</td>
                <td className="px-4 py-1.5 tabular-nums">{row.hour24}</td>
                <td className="px-4 py-1.5 text-zinc-500">{row.hour12}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
