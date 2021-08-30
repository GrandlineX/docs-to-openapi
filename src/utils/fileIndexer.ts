import * as fs from 'fs';
import * as Path from 'path';
import parseCom from './parseCom';

function handleElement(
  rootPath: string,
  el: string,
  out: string[],
  fileTypes: string[]
) {
  const fullPath = Path.join(rootPath, el);
  const stat = fs.lstatSync(fullPath);
  if (stat.isDirectory()) {
    const folder = fs.readdirSync(fullPath);
    folder.forEach((folderItem) => {
      handleElement(fullPath, folderItem, out, fileTypes);
    });
  } else {
    let matched = false;

    fileTypes.forEach((fileType) => {
      if (!matched && el.endsWith(fileType)) matched = true;
    });
    if (matched) {
      const parsed = parseCom(Path.join(rootPath, el));
      if (parsed !== null) {
        out.push(parsed);
      }
    }
  }
}

export default function fileIndexer(
  rootPath: string,
  fileTypes: string[]
): string[] {
  const out: string[] = [];

  if (!fs.existsSync(rootPath)) {
    throw new Error('Root folder not exist');
  }
  const stat = fs.lstatSync(rootPath);
  if (!stat.isDirectory()) {
    throw new Error('Root is not a folder');
  }

  const root = fs.readdirSync(rootPath);
  root.forEach((el) => {
    handleElement(rootPath, el, out, fileTypes);
  });

  return out;
}
