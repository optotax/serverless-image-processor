import { curry } from 'ramda';
import { InputQueryParams } from '../../QueryParams';
import { SupportedInputMime, PipeOutput } from '../index';
import { Sharp } from 'sharp';
import { jpeg } from './Jpeg';
import { toBoolean } from '../../Utils';
import { webP } from './WebP';
import { png } from './Png';

export const convert = curry(
  (
    queryParams: InputQueryParams,
    inputMime: SupportedInputMime,
    transformer: Sharp
  ): PipeOutput => {
    if (toBoolean(queryParams.jpg)) {
      return {
        mime: 'image/jpeg',
        transformer: jpeg(queryParams, transformer)
      };
    }

    if (toBoolean(queryParams.webp)) {
      return {
        mime: 'image/webp',
        transformer: webP(queryParams, transformer)
      };
    }

    switch (inputMime) {
      case 'image/gif':
      case 'image/jpeg':
        return {
          mime: 'image/jpeg',
          transformer: jpeg(queryParams, transformer)
        };
      case 'image/png':
        return {
          mime: 'image/png',
          transformer: png(queryParams, transformer)
        };
    }
  }
);
