/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr';

export default function App() {
  const [result, setResult] = React.useState<MlkitOcrResult | undefined>();
  const [image, setImage] = React.useState<ImagePickerResponse | undefined>();

  return (
    <SafeAreaView style={styles.container}>
      {!!result?.length && (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'stretch',
          }}
          showsVerticalScrollIndicator
          style={styles.scroll}
        >
          {result?.map((block) => {
            return block.lines.map((line) => {
              return (
                <View
                  key={line.text}
                  style={{
                    backgroundColor: '#ccccccaf',
                    position: 'absolute',
                    // @ts-ignore
                    top: fitHeight(line.bounding.top, image!.height),
                    // @ts-ignore
                    height: fitHeight(line.bounding.height, image!.height),
                    // @ts-ignore
                    left: fitWidth(line.bounding.left, image!.width),
                    // @ts-ignore
                    width: fitWidth(line.bounding.width, image!.width),
                  }}
                >
                  <Text style={{ fontSize: 8 }}>{line.text}</Text>
                </View>
              );
            });
          })}
        </ScrollView>
      )}

      <Button
        onPress={() => launchGallery(setResult, setImage)}
        title="Start"
      />
    </SafeAreaView>
  );
}

function fitWidth(value: number, imageWidth: number) {
  const fullWidth = Dimensions.get('window').width;
  return (value / imageWidth) * fullWidth;
}

function fitHeight(value: number, imageHeight: number) {
  const fullHeight = Dimensions.get('window').height;
  return (value / imageHeight) * fullHeight;
}

function launchGallery(
  setResult: (result: MlkitOcrResult) => void,
  setImage: (result: ImagePickerResponse) => void
) {
  launchImageLibrary(
    {
      mediaType: 'photo',
    },
    async (response: ImagePickerResponse) => {
      if (!response.uri) {
        throw new Error('oh!');
      }
      try {
        setImage(response);
        setResult(await MlkitOcr.detectFromUri(response.uri));
      } catch (e) {
        console.error(e);
      }
    }
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  scroll: {
    width: '100%',
    borderColor: 'red',
    borderWidth: 1,
  },
});
