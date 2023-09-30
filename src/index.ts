import { NativeModules } from 'react-native';
import type { MlkitOcrResult } from './index.d';

export * from './index.d';

type MlkitOcrModule = {
  detectFromUri(uri: string): Promise<MlkitOcrResult>;
  detectFromFile(path: string): Promise<MlkitOcrResult>;
};

// @ts-ignore
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const MlkitOcr: MlkitOcrModule = isTurboModuleEnabled
  ? require('./NativeMlkitOcr').default
  : NativeModules.MlkitOcr;

const MLKit: MlkitOcrModule = {
  detectFromUri: async (uri: string) => {
    const result = await MlkitOcr.detectFromUri(uri);
    if (!result) {
      return [];
    }
    return result;
  },
  detectFromFile: async (path: string) => {
    const result = await MlkitOcr.detectFromFile(path);
    if (!result) {
      return [];
    }
    return result;
  },
};

export default MLKit;
