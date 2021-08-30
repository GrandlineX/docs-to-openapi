#!/usr/bin/env node
import * as Path from 'path';
import * as fs from 'fs';
import { parseConfig, writeToFile } from './utils';
import { GlConfig } from './lib';
import fileIndexer from './utils/fileIndexer';

const { cwd } = process;
const version = process.env.npm_package_version;
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
    let specPath;
    if (config.outPutDir){
      specPath=Path.join(path,config.outPutDir,'openapi.yml');
    }else {
      specPath= Path.join(path, 'openapi.yml')
    }

    writeToFile(specPath, config, rawData);
    console.log(`Transformation complete`);
  } else {
    console.error(`No config file @${path}`);
  }
}

makeApi();
