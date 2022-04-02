import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { GLView } from 'expo-gl';
import { Camera } from 'expo-camera';

export default CameraApp;

function CameraApp() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.flex}>
        <Camera type={type} style={styles.flex}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text> Flip </Text>
          </TouchableOpacity>
        </Camera>
      </View>
      <View style={[styles.flex, styles.center]}>
        <GLView
          style={{ width: 300, height: 300 }}
          onContextCreate={onContextCreate}
        />
      </View>
    </SafeAreaView>
  );
}

function onContextCreate() {
  // console.log(gl);
  // gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  // gl.clearColor(0, 1, 1, 1);
  // // Create vertex shader (shape & position)
  // const vert = gl.createShader(gl.VERTEX_SHADER);
  // gl.shaderSource(
  //   vert,
  //   `
  //   void main(void) {
  //     gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  //     gl_PointSize = 150.0;
  //   }
  // `,
  // );
  // gl.compileShader(vert);
  // // Create fragment shader (color)
  // const frag = gl.createShader(gl.FRAGMENT_SHADER);
  // gl.shaderSource(
  //   frag,
  //   `
  //   void main(void) {
  //     gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  //   }
  // `,
  // );
  // gl.compileShader(frag);
  // Link together into a program
  // const program = gl.createProgram();
  // gl.attachShader(program, vert);
  // gl.attachShader(program, frag);
  // gl.linkProgram(program);
  // gl.useProgram(program);
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.POINTS, 0, 1);
  // gl.flush();
  // gl.endFrameEXP();
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  flex: {
    flex: 1,
  },

  flipButton: {
    height: 50,
    width: 200,
    bottom: 20,
    position: 'absolute',
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
