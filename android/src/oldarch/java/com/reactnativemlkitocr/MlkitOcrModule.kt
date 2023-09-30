package com.reactnativemlkitocr

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class MlkitOcrModule internal constructor(context: ReactApplicationContext?) :
    ReactContextBaseJavaModule(context) {

    override fun getName(): String {
        return MlkitOcrModuleImpl.NAME
    }

    @ReactMethod
    fun detectFromUri(imagePath: String, promise: Promise) {
      return MlkitOcrModuleImpl.detectFromResource(this.reactApplicationContext, imagePath, promise)
    }

    @ReactMethod
    fun detectFromFile(imagePath: String, promise: Promise) {
      return MlkitOcrModuleImpl.detectFromResource(this.reactApplicationContext, imagePath, promise)
    }
}
