import { Sharp } from 'sharp';
import { isDevEnv } from './Utils';

export const getTransformer = (): Sharp => {
  return require('sharp')();
};
