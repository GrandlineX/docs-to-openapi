export interface GlConfig {
  rootDir: string;
  externalModules: string[];
  filetypes: string[];
  outPutDir?:string,
  baseConfig: {
    info: {
      title: string;
      version: string;
      description: string;
    };
    security?: any[];
    servers?: { url: string }[];
    components?: any;
  };
}
