import { toCsv } from './csv';
import { Column } from './data-table';

interface City {
  name: string;
  country: string;
}

const columns: Column<City>[] = [
  { header: 'Name', value: (city) => city.name },
  { header: 'Country', value: (city) => city.country },
];

describe('toCsv', () => {
  it('writes a header line and one line per item, every cell quoted', () => {
    const cities = [
      { name: 'Berlin', country: 'Germany' },
      { name: 'Paris', country: 'France' },
    ];

    expect(toCsv(cities, columns)).toBe('"Name","Country"\r\n"Berlin","Germany"\r\n"Paris","France"');
  });

  it('keeps commas and line breaks inside a cell and doubles its quotes', () => {
    const cities = [{ name: 'The "Big" Apple, NY', country: 'United\nStates\r\nof America' }];

    expect(toCsv(cities, columns)).toBe('"Name","Country"\r\n"The ""Big"" Apple, NY","United\nStates\r\nof America"');
  });

  it('trims the spaces around a cell', () => {
    const cities = [{ name: ' Berlin ', country: 'Germany  ' }];

    expect(toCsv(cities, columns)).toBe('"Name","Country"\r\n"Berlin","Germany"');
  });

  it('puts an apostrophe in front of cells that Excel would read as a formula', () => {
    const cities = [
      { name: '+33 1 00 00 00 00', country: '-' },
      { name: '=1+1', country: ' @SUM(A1)' },
    ];

    expect(toCsv(cities, columns)).toBe(
      `"Name","Country"\r\n"'+33 1 00 00 00 00","'-"\r\n"'=1+1","'@SUM(A1)"`,
    );
  });
});
