#!/usr/bin/env node
import * as Path from 'path';
import * as fs from 'fs';
import express from 'express';
import { parseConfig, writeToFile } from './utils';
import { GlConfig } from './lib';
import fileIndexer from './utils/fileIndexer';
import mergePath from './utils/mergePath';

const { cwd, argv, env } = process;
const version = env.npm_package_version;
const path = cwd();
const configPath = Path.join(path, 'glconf.json');

function makeApi() {
  if (fs.existsSync(configPath)) {
    console.log(`# Project to OpenApi\n`);
    console.log(`Config found`);
    const config = parseConfig(configPath) as GlConfig;
    if (version !== undefined && version !== null && version !== '') {
      config.baseConfig.info.version = version;
    }
    const rootDir = Path.join(path, config.rootDir);
    let rawData = fileIndexer(rootDir, config.filetypes);
    config.externalModules.forEach((external) => {
      const externalDir = Path.join(path, external);
      rawData = rawData.concat(fileIndexer(externalDir, config.filetypes));
    });

    let specPath: string;
    let htmlPath: string;
    if (config.outPutDir) {
      specPath = Path.join(path, config.outPutDir, 'openapi.yml');
      htmlPath = Path.join(path, config.outPutDir, 'swagger.yml');
    } else {
      specPath = Path.join(path, 'openapi.yml');
      htmlPath = Path.join(path, 'swagger.html');
    }

    if (argv.find((el) => el === '--html')) {
      const htmlFile = Path.join(__dirname, '..', 'res', 'html', 'index.html');
      fs.copyFileSync(htmlFile, htmlPath);
      console.log(`Html generated`);
    }
    writeToFile(specPath, config, mergePath(rawData));
    console.log(`Transformation complete`);

    if (argv.find((el) => el === '--serve')) {
      const htmlFile = Path.join(__dirname, '..', 'res', 'html', 'index.html');
      console.log(`Start Serve`);
      const app = express();
      app.get('/', (req, res) => {
        fs.createReadStream(htmlFile).pipe(res);
      });
      app.get('/openapi.yml', (req, res) => {
        fs.createReadStream(specPath).pipe(res);
      });
      app.listen(9000, () => {
        console.log(`listen on http://localhost:9000`);
      });
    }
  } else {
    console.error(`No config file @${path}`);
  }
}

makeApi();
