import { reflectComponentType, Type } from '@angular/core';
import catalogue from '../../../../docs/create-dashboard/components.md' with { loader: 'text' };
import * as api from './public-api';

describe('component catalogue', () => {
  it('lists every exported component', () => {
    const selectors = Object.values(api).map((value) => reflectComponentType(value as Type<unknown>)?.selector);
    const missing = selectors.filter((selector) => selector && !catalogue.includes(`\`${selector}\``));
    expect(
      missing,
      `Add a row for ${missing.join(', ')} to the table in docs/create-dashboard/components.md: ` +
        'do it in the same way as the others are already there.',
    ).toEqual([]);
  });
});
