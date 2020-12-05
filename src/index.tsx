import { NativeModules } from 'react-native';

type MlkitOcrType = {
  multiply(a: number, b: number): Promise<number>;
};

const { MlkitOcr } = NativeModules;

export default MlkitOcr as MlkitOcrType;
