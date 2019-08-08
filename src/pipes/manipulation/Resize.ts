import { curry } from 'ramda';
import { Sharp } from 'sharp';
import { InputQueryParams } from '../../QueryParams';
import { toBoolean } from '../../Utils';

export const resize = curry(
  (queryParams: InputQueryParams, transformer: Sharp) => {
    const { width, height } = calculate(queryParams);
    const withoutEnlargement = toBoolean(queryParams.withoutEnlargement, true);
    const options: any = {};
    options["withoutEnlargement"] = withoutEnlargement;
    if (queryParams.background != null) {
      options["background"] = queryParams.background
    }
    if (queryParams.fit) {
      return options["fit"] = queryParams.fit;
    }
    return transformer.resize(width, height, options);
  }
);

export interface Dimension {
  width?: number;
  height?: number;
}

const defaultDimension = { width: 1920 };
const maxPx = 5000;

export const calculate = (queryParams: InputQueryParams): Dimension => {
  const width = parseInt(queryParams.width || '');
  const height = parseInt(queryParams.height || '');

  if (!isValidPixelCount(width) && !isValidPixelCount(height)) {
    return defaultDimension;
  } else if (!isValidPixelCount(width)) {
    return {
      height: Math.min(maxPx, height)
    };
  } else if (!isValidPixelCount(height)) {
    return {
      width: Math.min(maxPx, width)
    };
  } else {
    return {
      width: Math.min(maxPx, width),
      height: Math.min(maxPx, height)
    };
  }
};

export const isValidPixelCount = (parsedInt: number) => {
  return !isNaN(parsedInt) && parsedInt > 0;
};
