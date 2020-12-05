import * as React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import MlkitOcr from 'react-native-mlkit-ocr';
function launchGallery() {
  launchImageLibrary(
    {
      mediaType: 'photo',
    },
    async (response: ImagePickerResponse) => {
      if (!response.uri) {
        throw new Error('oh!');
      }
      try {
        const result = await MlkitOcr.detectFromUri(response.uri);
        console.log('Blocks', result.length);
      } catch (e) {
        console.error(e);
      }
    }
  );
}
export default function App() {
  // const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    // MlkitOcr.multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Button onPress={launchGallery} title="Dang!" />
      {/* <Text>Result: {result}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
