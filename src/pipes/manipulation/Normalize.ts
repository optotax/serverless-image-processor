import { curry } from 'ramda';
import { Sharp } from 'sharp';
import { InputQueryParams } from '../../QueryParams';
import { toBoolean } from '../../Utils';

export const normalize = curry(
  (queryParams: InputQueryParams, transformer: Sharp) => {
    if (toBoolean(queryParams.normalize)) {
      return transformer.normalize();
    }

    return transformer;
  }
);
