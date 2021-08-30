import * as fs from 'fs';
import { GlConfig } from '../lib';

export default function parseConfig(path: string): GlConfig | null {
  try {
    const configText = fs.readFileSync(path, 'utf-8');
    const config = JSON.parse(configText);
    console.log(`Config @${path}`);
    return config;
  } catch (e) {
    console.error('Cant Read Config');
    return null;
  }
}
