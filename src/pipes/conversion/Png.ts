import { Sharp } from 'sharp';
import { InputQueryParams } from '../../QueryParams';
import { toBoolean } from '../../Utils';

const defaultPngSettings = {
  progressive: true
};

export const png = (
  queryParams: InputQueryParams,
  transformer: Sharp
) =>
  transformer.png({
    progressive: toBoolean(
      queryParams.progressive,
      defaultPngSettings.progressive
    )
  });
