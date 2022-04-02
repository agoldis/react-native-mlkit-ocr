// import React from 'react';
// import {
//   StyleSheet,
//   PixelRatio,
//   LayoutChangeEvent,
//   Platform,
// } from 'react-native';
// import {Camera} from 'expo-camera';
// import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';

// interface State {
//   cameraLayout: {x: number; y: number; width: number; height: number} | null;
// }
// interface Props {
//   useCustomShadersToResize: boolean;
//   cameraTextureWidth: number;
//   cameraTextureHeight: number;
//   resizeWidth: number;
//   resizeHeight: number;
//   resizeDepth: number;
//   autorender: boolean;
//   onReady: (
//     // images: IterableIterator<tf.Tensor3D>,
//     updateCameraPreview: () => void,
//     gl: ExpoWebGLRenderingContext,
//     // cameraTexture: WebGLTexture,
//   ) => void;
// }

// interface WrappedComponentProps {
//   onLayout?: (event: LayoutChangeEvent) => void;
//   // tslint:disable-next-line: no-any
//   [index: string]: any;
// }

// const DEFAULT_AUTORENDER = true;
// const DEFAULT_RESIZE_DEPTH = 3;
// const DEFAULT_USE_CUSTOM_SHADERS_TO_RESIZE = false;

// export function cameraWithTensors<T extends WrappedComponentProps>(
//   CameraComponent: React.ComponentType<T>,
// ) {
//   return class CameraWithTensorStream extends React.Component<Props, State> {
//     camera: Camera | null = null;
//     glView: GLView | null = null;
//     glContext: ExpoWebGLRenderingContext | null = null;
//     rafID: number | null = null;

//     constructor(props: Props) {
//       super(props);
//       this.onCameraLayout = this.onCameraLayout.bind(this);
//       this.onGLContextCreate = this.onGLContextCreate.bind(this);

//       this.state = {
//         cameraLayout: null,
//       };
//     }

//     componentWillUnmount() {
//       this.rafID && cancelAnimationFrame(this.rafID);
//       if (this.glContext) {
//         GLView.destroyContextAsync(this.glContext);
//       }
//       this.camera = null;
//       this.glView = null;
//       this.glContext = null;
//     }

//     /*
//      * Measure the camera component when it is laid out so that we can overlay
//      * the GLView.
//      */
//     onCameraLayout(event: LayoutChangeEvent) {
//       const {x, y, width, height} = event.nativeEvent.layout;
//       this.setState({
//         cameraLayout: {x, y, width, height},
//       });
//     }

//     /**
//      * Creates a WebGL texture that is updated by the underlying platform to
//      * contain the contents of the camera.
//      */
//     async createCameraTexture(): Promise<any> {
//       if (this.glView != null && this.camera != null) {
//         //@ts-ignore
//         return this.glView.createCameraTextureAsync(this.camera);
//       } else {
//         throw new Error('Expo GL context or camera not available');
//       }
//     }

//     /**
//      * Callback for GL context creation. We do mose of the work of setting
//      * up the component here.
//      * @param gl
//      */
//     async onGLContextCreate(gl: ExpoWebGLRenderingContext) {
//       this.glContext = gl;
//       const cameraTexture = await this.createCameraTexture();
//       // await detectGLCapabilities(gl);

//       // Optionally set up a render loop that just displays the camera texture
//       // to the GLView.
//       const autorender =
//         this.props.autorender != null
//           ? this.props.autorender
//           : DEFAULT_AUTORENDER;
//       const updatePreview = this.previewUpdateFunc(gl, cameraTexture);
//       if (autorender) {
//         const renderLoop = () => {
//           updatePreview();
//           gl.endFrameEXP();
//           this.rafID = requestAnimationFrame(renderLoop);
//         };
//         renderLoop();
//       }

//       const {resizeHeight, resizeWidth, resizeDepth} = this.props;

//       // cameraTextureHeight and cameraTextureWidth props can be omitted when
//       // useCustomShadersToResize is set to false. Setting a default value to
//       // them here.
//       const cameraTextureHeight =
//         this.props.cameraTextureHeight != null
//           ? this.props.cameraTextureHeight
//           : 0;
//       const cameraTextureWidth =
//         this.props.cameraTextureWidth != null
//           ? this.props.cameraTextureWidth
//           : 0;
//       const useCustomShadersToResize =
//         this.props.useCustomShadersToResize != null
//           ? this.props.useCustomShadersToResize
//           : DEFAULT_USE_CUSTOM_SHADERS_TO_RESIZE;

//       //
//       //  Set up a generator function that yields tensors representing the
//       // camera on demand.
//       //
//       const cameraStreamView = this;
//       function* nextFrameGenerator() {
//         const RGBA_DEPTH = 4;
//         const textureDims = {
//           height: cameraTextureHeight,
//           width: cameraTextureWidth,
//           depth: RGBA_DEPTH,
//         };

//         const targetDims = {
//           height: resizeHeight,
//           width: resizeWidth,
//           depth: resizeDepth || DEFAULT_RESIZE_DEPTH,
//         };

//         while (cameraStreamView.glContext != null) {
//           const imageTensor = fromTexture(
//             gl,
//             cameraTexture,
//             textureDims,
//             targetDims,
//             useCustomShadersToResize,
//           );
//           yield imageTensor;
//         }
//       }
//       const nextFrameIterator = nextFrameGenerator();

//       // Pass the utility functions to the caller provided callback
//       this.props.onReady(nextFrameIterator, updatePreview, gl, cameraTexture);
//     }

//     /**
//      * Helper function that can be used to update the GLView framebuffer.
//      *
//      * @param gl the open gl texture to render to
//      * @param cameraTexture the texture to draw.
//      */
//     previewUpdateFunc(
//       gl: ExpoWebGLRenderingContext,
//       cameraTexture: WebGLTexture,
//     ) {
//       const renderFunc = () => {
//         const {cameraLayout} = this.state;
//         const width = PixelRatio.getPixelSizeForLayoutSize(cameraLayout.width);
//         const height = PixelRatio.getPixelSizeForLayoutSize(
//           cameraLayout.height,
//         );
//         const isFrontCamera =
//           this.camera.props.type === Camera.Constants.Type.front;
//         const flipHorizontal =
//           Platform.OS === 'ios' && isFrontCamera ? false : true;

//         renderToGLView(gl, cameraTexture, {width, height}, flipHorizontal);
//       };

//       return renderFunc.bind(this);
//     }

//     /**
//      * Render the component
//      */
//     render() {
//       const {cameraLayout} = this.state;

//       // Before passing props into the original wrapped component we want to
//       // remove the props that we augment the component with.

//       // Use this object to use typescript to check that we are removing
//       // all the tensorCamera properties.
//       const tensorCameraPropMap: Props = {
//         useCustomShadersToResize: null,
//         cameraTextureWidth: null,
//         cameraTextureHeight: null,
//         resizeWidth: null,
//         resizeHeight: null,
//         resizeDepth: null,
//         autorender: null,
//         onReady: null,
//       };
//       const tensorCameraPropKeys = Object.keys(tensorCameraPropMap);

//       const cameraProps: WrappedComponentProps = {};
//       const allProps = Object.keys(this.props);
//       for (let i = 0; i < allProps.length; i++) {
//         const key = allProps[i];
//         if (!tensorCameraPropKeys.includes(key)) {
//           cameraProps[key] = this.props[key];
//         }
//       }

//       // Set up an on layout handler
//       const onlayout = this.props.onLayout
//         ? (e: LayoutChangeEvent) => {
//             this.props.onLayout(e);
//             this.onCameraLayout(e);
//           }
//         : this.onCameraLayout;

//       cameraProps.onLayout = onlayout;

//       const cameraComp = (
//         //@ts-ignore see https://github.com/microsoft/TypeScript/issues/30650
//         <CameraComponent
//           key="camera-with-tensor-camera-view"
//           {...cameraProps}
//           ref={(ref: Camera) => (this.camera = ref)}
//         />
//       );

//       // Create the glView if the camera has mounted.
//       let glViewComponent = null;
//       if (cameraLayout != null) {
//         const styles = StyleSheet.create({
//           glView: {
//             position: 'absolute',
//             left: cameraLayout.x,
//             top: cameraLayout.y,
//             width: cameraLayout.width,
//             height: cameraLayout.height,
//             zIndex: this.props.style.zIndex
//               ? parseInt(this.props.style.zIndex, 10) + 10
//               : 10,
//           },
//         });

//         glViewComponent = (
//           <GLView
//             key="camera-with-tensor-gl-view"
//             style={styles.glView}
//             onContextCreate={this.onGLContextCreate}
//             ref={ref => (this.glView = ref)}
//           />
//         );
//       }

//       return [cameraComp, glViewComponent];
//     }
//   };
// }
