import { Column } from './data-table';

// Turns the items into CSV text: a header line plus one line per item.
export function toCsv<T>(items: T[], columns: Column<T>[]): string {
  const header = columns.map((column) => cell(column.header));
  const rows = items.map((item) => columns.map((column) => cell(column.value(item))));
  return [header, ...rows].map((row) => row.join(',')).join('\r\n');
}

// Every cell is quoted, so commas and line breaks stay inside it; quotes inside are doubled.
// A leading ' keeps Excel from reading a cell starting with = + - @ as a formula.
function cell(text: string): string {
  const trimmed = text.trim();
  const safe = /^[=+\-@]/.test(trimmed) ? `'${trimmed}` : trimmed;
  return `"${safe.replaceAll('"', '""')}"`;
}
