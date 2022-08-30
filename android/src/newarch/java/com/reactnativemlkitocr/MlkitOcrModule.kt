package com.reactnativemlkitocr

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext

class MlkitOcrModule(reactContext: ReactApplicationContext) :
  NativeMlkitOcrSpec(reactContext) {

  override fun getName(): String {
    return NAME
  }

  override fun detectFromUri(imagePath: String, promise: Promise) {
    return MlkitOcrModuleImpl.detectFromResource(this.reactApplicationContext, imagePath, promise)
  }

  override fun detectFromFile(imagePath: String, promise: Promise) {
    return MlkitOcrModuleImpl.detectFromResource(this.reactApplicationContext, imagePath, promise)
  }

  companion object {
    const val NAME = MlkitOcrModuleImpl.NAME
  }
}
