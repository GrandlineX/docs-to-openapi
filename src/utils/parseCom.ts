import * as fs from 'fs';
import yaml from 'js-yaml';
import { parse } from 'comment-parser';

export default function parseCom(path: string): unknown | null {
  try {
    const out: string[] = [];
    const configText = fs.readFileSync(path, 'utf-8');
    const res = parse(configText);
    res.forEach((element) => {
      const tags = element.tags.filter(
        (tag) => tag.tag === 'openapi' || tag.tag === 'swagger'
      );
      tags.forEach((tag) => {
        tag.source.forEach((line, index) => {
          if (index > 0) {
            const { source } = line;

            if (!source.startsWith(' */')) {
              out.push(`  ${source.substr(2)}`);
            }
          }
        });
      });
    });
    if (out.length === 0) {
      return null;
    }

    const temp = out.join('\n');

    return yaml.load(temp);
  } catch (e) {
    console.error(`Cant Read Comment @${path}`);
    return null;
  }
}
