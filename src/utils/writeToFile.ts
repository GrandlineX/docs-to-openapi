import * as fs from 'fs';

import { GlConfig } from '../lib';
import jsonToYmlParser from './jsonToYmlParser';

export default function writeToFile(
  filePath: string,
  config: GlConfig,
  paths: string[]
): void {
  const base = jsonToYmlParser(config.baseConfig);
  const text = ['  openapi: 3.0.1', base, '  paths:', ...paths].join('\n');
  fs.writeFileSync(filePath, text);
}
