import * as React from 'react';
import {
  StyleSheet,
  View,
  Button,
  SafeAreaView,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr';

function launchGallery(setImage, setResult) {
  launchImageLibrary(
    {
      mediaType: 'photo',
    },
    async (response: ImagePickerResponse) => {
      if (!response.uri) {
        throw new Error('oh!');
      }
      setImage(response);
      try {
        const result = await MlkitOcr.detectFromUri(response.uri);
        setResult(result);
      } catch (e) {
        console.error(e);
      }
    }
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
export default function App() {
  const [image, setImage] = React.useState<ImagePickerResponse | undefined>();
  const [result, setResult] = React.useState<MlkitOcrResult | undefined>();

  return (
    <SafeAreaView style={styles.container}>
      {!!result?.length && (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'stretch',
          }}
          showsVerticalScrollIndicator
          style={{
            flex: 1,
            borderColor: 'red',
            borderWidth: 1,
            backgroundColor: 'transparent',
            position: 'relative',
          }}
        >
          <View>
            {result?.map((block) => {
              return block.lines.map((line) => {
                return (
                  <View
                    key={line.text}
                    style={{
                      zIndex: 1,
                      backgroundColor: '#ccccccaf',
                      position: 'absolute',
                      top: fitHeight(line.bounding.top, image!.height),
                      height: fitHeight(line.bounding.height, image!.height),
                      left: fitWidth(line.bounding.left, image!.width),
                      width: fitWidth(line.bounding.width, image!.width),
                    }}
                  >
                    <Text style={{ fontSize: 8 }}>{line.text}</Text>
                  </View>
                );
              });
            })}
          </View>
        </ScrollView>
      )}
      <Button
        onPress={() => launchGallery(setImage, setResult)}
        title="Dang!"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
