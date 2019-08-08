import { Sharp } from 'sharp';
import { InputQueryParams } from '../../QueryParams';
import { toInt, toBoolean } from '../../Utils';

const defaultJpgSettings = {
  quality: 75,
  progressive: true
};

export const jpeg = (
  queryParams: InputQueryParams,
  transformer: Sharp
) =>
  transformer.jpeg({
    quality: toInt(queryParams.quality, defaultJpgSettings.quality),
    progressive: toBoolean(
      queryParams.progressive,
      defaultJpgSettings.progressive
    )
  });
