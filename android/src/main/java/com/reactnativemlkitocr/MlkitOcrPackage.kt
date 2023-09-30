package com.reactnativemlkitocr

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import java.util.*

class MlkitOcrPackage : TurboReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == MlkitOcrModuleImpl.NAME) {
      MlkitOcrModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
    return ReactModuleInfoProvider {
      val moduleInfos: MutableMap<String, ReactModuleInfo> =
        HashMap()
      val isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      moduleInfos[MlkitOcrModuleImpl.NAME] = ReactModuleInfo(
        MlkitOcrModuleImpl.NAME,
        MlkitOcrModuleImpl.NAME,
        false,  // canOverrideExistingModule
        false,  // needsEagerInit
        true,  // hasConstants
        false,  // isCxxModule
        isTurboModule // isTurboModule
      )
      moduleInfos
    }
  }
}

