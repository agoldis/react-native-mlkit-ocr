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


## Example

To get started with the project, run `yarn bootstrap` in the root directory to install the required dependencies for each package:

```sh
yarn bootstrap
```

To start the packager:

```sh
yarn example start
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
