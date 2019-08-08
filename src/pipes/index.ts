import { Sharp } from 'sharp';
import { pipe } from 'ramda';
import { InputQueryParams } from '../QueryParams';
import { manipulate } from './manipulation';
import { convert } from './conversion';

export type SupportedInputMime = 'image/jpeg' | 'image/gif' | 'image/png';

export type SupportedOutputMime = 'image/jpeg' | 'image/webp' | 'image/png';

export type PipeOutput = {
  transformer: Sharp;
  mime: SupportedOutputMime;
};

export function isSupportedInputMime(
  mime: string | null
): mime is SupportedInputMime {
  return ['image/jpeg', 'image/gif', 'image/png'].some(x => x === mime);
}

export const createPipe = (
  queryParams: InputQueryParams,
  inputMime: SupportedInputMime,
  inputTransformer: Sharp
): PipeOutput =>
  pipe(
    manipulate(queryParams),
    convert(queryParams, inputMime)
  )(inputTransformer);
