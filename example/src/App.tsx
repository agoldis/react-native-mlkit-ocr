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
  ActivityIndicator,
} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr';

export default function App() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<MlkitOcrResult | undefined>();
  const [image, setImage] = React.useState<ImagePickerResponse | undefined>();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {!!result?.length && (
        <ScrollView
          contentContainerStyle={{
            alignItems: 'stretch',
            padding: 20,
            height: Dimensions.get('window').height,
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
                    top: fitHeight(line.bounding.top, image?.height ?? 0),
                    height: fitHeight(line.bounding.height, image?.height ?? 0),
                    left: fitWidth(line.bounding.left, image?.width ?? 0),
                    width: fitWidth(line.bounding.width, image?.width ?? 0),
                  }}
                >
                  <Text style={{ fontSize: 10 }}>{line.text}</Text>
                </View>
              );
            });
          })}
        </ScrollView>
      )}

      <Button
        onPress={() => {
          setLoading(true);
          launchGallery(setResult, setImage, setLoading);
        }}
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
  setImage: (result: ImagePickerResponse) => void,
  setLoading: (value: boolean) => void
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
      } finally {
        setLoading(false);
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
    flex: 1,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 2,
  },
});
