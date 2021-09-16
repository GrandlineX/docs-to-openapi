import * as Path from 'path';
import { GlConfig, parseCom, parseConfig,writeToFile } from '../src';
import fileIndexer from '../src/utils/fileIndexer';
import mergePath from '../src/utils/mergePath';

const base = __dirname;

const configPath=Path.join(base,"test.json");
const specPath=Path.join(base,"openapi.yml");
const testModPathA=Path.join(base,"..","res","root","A.ts");
const testModPath=Path.join(base,"..","res","root");
const testModExternal=[Path.join(base,"..","res","external")];

describe('full generator test', () => {
  test('definePreload', async () => {
    let config=parseConfig(configPath);
    expect(config).not.toBeNull();
   })
  test('parseA', async () => {
    const comment=parseCom(testModPathA)
    expect(comment).not.toBeNull();
  })
  test('indexer', async () => {
    const rawData=fileIndexer(testModPath,["ts"])
     expect(rawData.length).toBe(4);
  })
  test('wireToFile', async () => {
    let config=parseConfig(configPath) as GlConfig;
    let rawData=fileIndexer(testModPath,["ts"])
    testModExternal.forEach((external)=>{
      rawData=rawData.concat(fileIndexer(external,["ts"]))
    })
    writeToFile(specPath,config,mergePath(rawData))
  })
})
