import * as fs from 'fs';
import yaml from 'js-yaml';
import { GlConfig } from '../lib';

export default function writeToFile(
  filePath: string,
  config: GlConfig,
  paths: unknown[]
): void {
  const spec: any = {
    ...config.baseConfig,
  };
  spec.openapi = '3.0.1';
  spec.paths = {};
  paths.forEach((el: any) => {
    if (typeof el === 'object' && el !== null) {
      const keys = Object.keys(el);
      if (keys.length === 1) {
        const key = keys[0];
        spec.paths[keys[0]] = el[keys[0]];
      } else {
        console.error(el);
        throw new Error('# Invalid Syntax');
      }
    } else {
      console.error(el);
      throw new Error('# Invalid Input');
    }
  });
  fs.writeFileSync(filePath, yaml.dump(spec));
}
