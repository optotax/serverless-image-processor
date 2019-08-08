import { curry } from 'ramda';
import { Sharp } from 'sharp';
import { InputQueryParams } from '../../QueryParams';

export const blur = curry(
  (queryParams: InputQueryParams, transformer: Sharp) => {
    const blurFactor = parseFloat(queryParams.blur || '');
    if (!isNaN(blurFactor) && blurFactor >= 0.3 && blurFactor <= 100) {
      return transformer.blur(blurFactor);
    }

    return transformer;
  }
);
