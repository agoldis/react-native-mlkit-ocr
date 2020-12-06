# react-native-mlkit-ocr

Google on-device MLKit text recognition for React Native

## Installation

```sh
npm install react-native-mlkit-ocr
```

## Usage

```js
import MlkitOcr from 'react-native-mlkit-ocr';

// ...

const resultFromUri = await MlkitOcr.detectFromUri(uri);
const resultFromFile = await MlkitOcr.detectFromFile(path);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
