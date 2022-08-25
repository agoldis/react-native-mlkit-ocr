require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name            = package["name"]
  s.version         = package["version"]
  s.summary         = package["description"]
  s.description     = package["description"]
  s.homepage        = package["homepage"]
  s.license         = package["license"]
  s.author          = package["author"]

  s.platforms       = { :ios => "10.0" }
  s.source          = { :git => "https://github.com/agoldis/react-native-mlkit-ocr.git", :tag => "#{s.version}" }

  s.source_files    = "ios/**/*.{h,m,mm}"

  s.dependency "GoogleMLKit/TextRecognition", "2.6.0"

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

    s.pod_target_xcconfig = {
      'HEADER_SEARCH_PATHS' => '"$(PODS_ROOT)/boost" "$(PODS_ROOT)/boost-for-react-native" "$(PODS_ROOT)/RCT-Folly"',
      'CLANG_CXX_LANGUAGE_STANDARD' => 'c++17',
    }

    s.compiler_flags  = folly_compiler_flags + ' -DRN_FABRIC_ENABLED'

    s.dependency "React"
    s.dependency "React-RCTFabric" # This is for fabric component
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  else
    s.dependency "React-Core"
  end
end

